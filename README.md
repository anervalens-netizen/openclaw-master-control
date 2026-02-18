# 🦞 OpenClaw Master Control

**The visual command center for your local AI agent.**

Master Control provides a modern, sleek web interface to monitor, configure, and manage your local OpenClaw instance. No more digging through JSON files or guessing CLI commands—get a real-time dashboard for your AI.

![Master Control Dashboard](https://via.placeholder.com/1200x600?text=OpenClaw+Master+Control+Preview)

## ✨ Features

- **System Intelligence:** Real-time monitoring of your `openclaw.json` config integrity.
- **Visual Config:** View active providers, models, and system health at a glance.
- **One-Click Maintenance:** Run `doctor`, `update`, and `fix` commands via a GUI.
- **Secure Bridge:** A local Node.js bridge ensures your API keys and data never leave your machine.
- **Responsive Design:** Optimized for desktop and local network access.

## 🚀 How to Install

### Option A: Ask your Agent (The "AI" Way)
You don't need to install this yourself. Just copy-paste this prompt to your OpenClaw agent:

```text
Please install the 'Master Control' GUI for my local management.

1. Navigate to my workspace folder.
2. Clone the repository: git clone https://github.com/anervalens-netizen/openclaw-master-control.git
3. Enter the directory and run 'npm install'.
4. Start the system using 'npm run dev'.
5. Once running, provide me with the localhost URL to access the dashboard.
```

### Option B: Manual Install (For Humans)
Requirements: Node.js v18+

```bash
# 1. Clone the repository
git clone https://github.com/anervalens-netizen/openclaw-master-control.git
cd openclaw-master-control

# 2. Install dependencies
npm install

# 3. Start Master Control
# This automatically launches both the Backend Bridge and the Frontend
npm run dev
```

## 🛠️ Configuration
The app automatically detects your config at `~/.openclaw/openclaw.json`.
If you use a custom path, edit `bridge.js` line 7:
```javascript
const CONFIG_PATH = path.join(os.homedir(), '.openclaw', 'openclaw.json');
```

## 🤝 Contributing
Built with React, Vite, TailwindCSS, and Node.js.
Feel free to open a PR to add new "skills" to the control panel!

License: MIT
