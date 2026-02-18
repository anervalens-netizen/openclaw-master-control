#!/bin/bash

# OpenClaw Master Control - Automated Installer

echo "🦞 Installing OpenClaw Master Control..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    exit 1
fi

# Install Dependencies
echo "📦 Installing Dependencies..."
npm install --silent

echo "✅ Installation Complete!"
echo ""
echo "To start the Master Control, run:"
echo "  npm run start:all"
echo ""
echo "Or ask your agent: 'Please start the Master Control GUI now.'"
