import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const PORT = 3001;
const CONFIG_PATH = path.join(os.homedir(), '.openclaw', 'openclaw.json');

process.on('uncaughtException', (err) => {
  console.error('[Bridge Panic]', err);
});

function validateConfig() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      return { status: 'missing', message: 'Config file not found' };
    }
    const content = fs.readFileSync(CONFIG_PATH, 'utf8');
    const json = JSON.parse(content);
    
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
    
    const activeProvider = Object.values(profiles)[0]?.provider || 'unknown';
    
    return { 
      status: 'healthy', 
      message: `System ready with ${profileCount} profiles (Active: ${activeProvider})`,
      backup: fs.existsSync(`${CONFIG_PATH}.bak`)
    };
  } catch (err) {
    return { status: 'error', message: `JSON Syntax Error: ${err.message}` };
  }
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    const gatewayCheck = spawn('sh', ['-c', 'lsof -i :18789']);
    const configStatus = validateConfig();
    gatewayCheck.on('close', (code) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ active: code === 0, config: configStatus }));
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/execute') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { command } = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'text/plain', 'Transfer-Encoding': 'chunked' });
        const child = spawn('sh', ['-c', command]);
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
      } catch (err) {
        res.writeHead(400);
        res.end(`BRIDGE_ERROR: ${err.message}`);
      }
    });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 OpenClaw Bridge Active (LOCAL MODE) on port ${PORT}`);
});
