#!/usr/bin/env python3
"""
Development Server Management Script for XmasMM
Provides convenient commands to start, stop, and check server status.
"""

import subprocess
import sys
import os
import signal
import argparse
from pathlib import Path

def check_port_8000():
    """Check if anything is running on port 8000"""
    try:
        result = subprocess.run(['netstat', '-ano'], capture_output=True, text=True)
        lines = result.stdout.split('\n')
        port_8000_lines = [line for line in lines if ':8000' in line and 'LISTENING' in line]
        
        if port_8000_lines:
            print("🔍 Found processes on port 8000:")
            for line in port_8000_lines:
                parts = line.split()
                if len(parts) >= 5:
                    pid = parts[-1]
                    print(f"   PID: {pid}")
            return True
        else:
            print("✅ Port 8000 is free")
            return False
    except Exception as e:
        print(f"❌ Error checking port: {e}")
        return False

def kill_server():
    """Kill any Python server running on port 8000"""
    try:
        # Get processes on port 8000
        result = subprocess.run(['netstat', '-ano'], capture_output=True, text=True)
        lines = result.stdout.split('\n')
        
        pids_to_kill = []
        for line in lines:
            if ':8000' in line and 'LISTENING' in line:
                parts = line.split()
                if len(parts) >= 5:
                    pid = parts[-1]
                    pids_to_kill.append(pid)
        
        if pids_to_kill:
            for pid in pids_to_kill:
                print(f"🔪 Killing PID {pid}...")
                subprocess.run(['taskkill', '/PID', pid, '/F'], capture_output=True)
            print("✅ Server stopped successfully")
        else:
            print("ℹ️  No server found running on port 8000")
            
    except Exception as e:
        print(f"❌ Error stopping server: {e}")

def start_server():
    """Start the development server"""
    if check_port_8000():
        print("⚠️  Port 8000 is already in use. Stop the existing server first.")
        return False
    
    print("🚀 Starting development server on http://localhost:8000")
    print("📝 Press Ctrl+C to stop the server")
    print("🎮 Navigate to http://localhost:8000/tests/ for testing")
    
    try:
        os.chdir(Path(__file__).parent.parent)
        subprocess.run([sys.executable, '-m', 'http.server', '8000'])
    except KeyboardInterrupt:
        print("\n✅ Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

def main():
    parser = argparse.ArgumentParser(description='XmasMM Development Server Manager')
    parser.add_argument('action', choices=['start', 'stop', 'status'], 
                       help='Action to perform')
    
    args = parser.parse_args()
    
    if args.action == 'start':
        start_server()
    elif args.action == 'stop':
        kill_server()
    elif args.action == 'status':
        check_port_8000()

if __name__ == '__main__':
    main()
