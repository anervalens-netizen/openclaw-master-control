import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import net from 'net';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3001;
// Robust config path resolution
const CONFIG_PATH = process.env.OPENCLAW_CONFIG || path.join(os.homedir(), '.openclaw', 'openclaw.json');

process.on('uncaughtException', (err) => {
  console.error('[Bridge Panic]', err);
});

function checkGatewayPort(port, callback) {
    const socket = new net.Socket();
    const timeout = 500;
    
    socket.setTimeout(timeout);
    socket.on('connect', () => {
        socket.destroy();
        callback(true);
    });
    
    socket.on('timeout', () => {
        socket.destroy();
        callback(false);
    });
    
    socket.on('error', (err) => {
        socket.destroy();
        callback(false);
    });
    
    socket.connect(port, '127.0.0.1');
}

function validateConfig() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      console.warn(`[Bridge] Config not found at ${CONFIG_PATH}`);
      return { 
        status: 'not_installed', 
        message: 'OpenClaw is not installed on this system.',
        action: 'Please use the Install button to begin.'
      };
    }
    const content = fs.readFileSync(CONFIG_PATH, 'utf8');
    let json;
    try {
        json = JSON.parse(content);
    } catch (e) {
        return { status: 'error', message: 'Invalid JSON in config file' };
    }
    
    // Check for profiles in the new auth structure
    const profiles = json.auth?.profiles || {};
    const profileCount = Object.keys(profiles).length;
    
    if (profileCount === 0) {
      return { 
        status: 'warning', 
        message: 'No AI profiles found in auth.profiles',
        backup: fs.existsSync(`${CONFIG_PATH}.bak`)
      };
    }
    
    // activeProvider might be undefined if profiles is empty, handled above but safe access good
    const activeProvider = Object.values(profiles)[0]?.provider || 'unknown';
    
    return { 
      status: 'healthy', 
      message: `System ready with ${profileCount} profiles (Active: ${activeProvider})`,
      backup: fs.existsSync(`${CONFIG_PATH}.bak`)
    };
  } catch (err) {
    return { status: 'error', message: `System Error: ${err.message}` };
  }
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    checkGatewayPort(18789, (isActive) => {
        const configStatus = validateConfig();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ active: isActive, config: configStatus }));
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/execute') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { command } = JSON.parse(body);
        if (!command) {
             res.writeHead(400);
             res.end('Missing command');
             return;
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' }); 
        
        // Security: potentially dangerous to run arbitrary shell commands. 
        // For a local tool, it's acceptable but should be noted.
        const child = spawn(command, { shell: true });
        
        child.stdout.on('data', (data) => { if (!res.writableEnded) res.write(data); });
        child.stderr.on('data', (data) => { if (!res.writableEnded) res.write(`STDERR: ${data}`); });
        
        const killTimeout = setTimeout(() => { if (child && !child.killed) child.kill(); }, 60000);
        
        child.on('close', (code) => {
          clearTimeout(killTimeout);
          if (!res.writableEnded) {
            res.write(`\n[Process exited with code ${code}]`);
            res.end();
          }
        });
        
        child.on('error', (err) => {
             if (!res.writableEnded) {
                res.write(`\n[Failed to start process: ${err.message}]`);
                res.end();
             }
        });

      } catch (err) {
        if (!res.writableEnded) {
            res.writeHead(400);
            res.end(`BRIDGE_ERROR: ${err.message}`);
        }
      }
    });
  } else {
      res.writeHead(404);
      res.end();
  }
});

server.listen(PORT, '127.0.0.1', (err) => {
  if (err) console.error('Failed to start bridge:', err);
  else console.log(`🚀 OpenClaw Bridge Active (LOCAL MODE) on port ${PORT}`);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log(`Address localhost:${PORT} in use, retrying...`);
    setTimeout(() => {
      server.close();
      server.listen(PORT, '127.0.0.1');
    }, 1000);
  }
});
