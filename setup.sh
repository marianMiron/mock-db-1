#!/bin/bash
# FinAgent-MCP-Simulator Setup Script
# Run this script to generate the folder structure and touch the initial files
# Also pulls llama3.2 locally using ollama (assumes ollama is installed or will be run via docker)

echo "Setting up FinAgent-MCP-Simulator..."

mkdir -p backend frontend/src/components

# Touch Backend Files
touch backend/requirements.txt
touch backend/main.py
touch backend/agent_engine.py
touch backend/mock_apis.py
touch backend/prompts.py

# Touch Frontend Files (assuming Vite will fill in some, but explicitly as requested)
touch frontend/package.json
touch frontend/vite.config.js
touch frontend/tailwind.config.js
touch frontend/postcss.config.js
touch frontend/src/main.jsx
touch frontend/src/App.jsx
touch frontend/src/index.css
touch frontend/src/components/Chat.jsx
touch frontend/src/components/Dashboard.jsx
touch frontend/src/components/ApprovalModal.jsx
touch frontend/src/components/LiveVisualizer.jsx
touch frontend/src/components/MSTeamsPanel.jsx
touch frontend/src/components/SummitDataView.jsx
touch frontend/src/components/TerminalView.jsx

echo "Directory structure created successfully!"

echo "Pulling llama3.2 locally for Ollama running on host (if applicable)..."
# ollama pull llama3.2

echo "Setup Complete!"
