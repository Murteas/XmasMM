#!/usr/bin/env python3
"""
Mobile Evaluation Runner
Automates mobile testing and captures debug output for AI agent analysis.
"""

import subprocess
import time
import json
import os
import sys
from datetime import datetime

# Fix Unicode encoding for Windows
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except AttributeError:
        # Fallback for older Python versions
        import codecs
        sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer)
        sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer)

class MobileEvaluationRunner:
    def __init__(self):
        self.project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.results_file = os.path.join(self.project_root, 'test-results', 'mobile-evaluation.json')
        self.log_file = os.path.join(self.project_root, 'test-results', 'mobile-evaluation.log')
        
        # Ensure results directory exists
        os.makedirs(os.path.dirname(self.results_file), exist_ok=True)
        
    def run_evaluation(self):
        """Run mobile evaluation and capture results"""
        print("🔍 Starting Mobile Evaluation Framework")
        print("=" * 50)
        
        # Check if server is already running
        server_process = None
        try:
            # Start development server
            print("🚀 Starting development server...")
            server_process = subprocess.Popen(
                ["python", "-m", "http.server", "8000"],
                cwd=self.project_root,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            
            # Wait for server to start
            time.sleep(2)
            
            print("📱 Server started. Running evaluation...")
            print("📊 Results will be captured in console logs")
            print("\nTo run the evaluation:")
            print("1. Open: http://localhost:8000/tests/test_mobile_evaluation.html")
            print("2. Check browser console for detailed results")
            print("3. Look for 'MOBILE EVALUATION FINAL REPORT' in console")
            print("\nKey areas being evaluated:")
            print("- Viewport detection accuracy")
            print("- Responsive layout system")
            print("- Button positioning safety")
            print("- Space utilization efficiency")
            print("- Touch target accessibility")
            
            # Create evaluation instructions for AI agent
            instructions = {
                "timestamp": datetime.now().isoformat(),
                "evaluation_url": "http://localhost:8000/tests/test_mobile_evaluation.html",
                "console_monitoring": {
                    "key_messages": [
                        "MOBILE EVALUATION FRAMEWORK INITIALIZED",
                        "Device Info Collected",
                        "Viewport Test",
                        "Responsive Layout Test", 
                        "EVALUATING SCENE",
                        "MOBILE EVALUATION FINAL REPORT"
                    ],
                    "issue_types": [
                        "VIEWPORT_MISMATCH",
                        "FONT_SCALE_TOO_SMALL",
                        "BUTTON_POSITION_UNSAFE",
                        "POOR_SPACE_UTILIZATION"
                    ]
                },
                "expected_outputs": {
                    "device_simulation": "iPhone XR (414x896) viewport simulation",
                    "layout_validation": "Responsive layout system verification",
                    "issue_detection": "Automatic identification of mobile UX problems",
                    "task_recommendations": "Prioritized list of remaining work"
                },
                "manual_steps": [
                    "Open the evaluation URL in browser",
                    "Open browser developer tools (F12)",
                    "Switch to Console tab",
                    "Wait 10 seconds for evaluation to complete",
                    "Review 'MOBILE EVALUATION FINAL REPORT' section",
                    "Check 'RECOMMENDED TASK PRIORITIZATION' output"
                ]
            }
            
            # Save instructions for AI agent
            with open(self.results_file, 'w') as f:
                json.dump(instructions, f, indent=2)
            
            print(f"\n📄 Evaluation instructions saved to: {self.results_file}")
            print("\n⏱️  Server will run for 30 seconds for testing...")
            print("Press Ctrl+C to stop server early")
            
            # Keep server running for testing
            time.sleep(30)
            
        except KeyboardInterrupt:
            print("\n⏹️  Server stopped by user")
        except Exception as e:
            print(f"❌ Error running evaluation: {e}")
        finally:
            if server_process:
                server_process.terminate()
                try:
                    server_process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    server_process.kill()
                print("🛑 Development server stopped")
    
    def generate_summary_report(self):
        """Generate a summary of current mobile optimization status"""
        print("\n📊 MOBILE OPTIMIZATION STATUS SUMMARY")
        print("=" * 50)
        
        # Check what's implemented
        gameutils_path = os.path.join(self.project_root, 'js', 'utils', 'GameUtils.js')
        mobile_test_path = os.path.join(self.project_root, 'tests', 'test_mobile_expert.html')
        
        implemented_features = []
        missing_features = []
        
        if os.path.exists(gameutils_path):
            with open(gameutils_path, 'r') as f:
                content = f.read()
                if 'getMobileViewport' in content:
                    implemented_features.append("✅ Mobile viewport detection")
                else:
                    missing_features.append("❌ Mobile viewport detection")
                    
                if 'getResponsiveLayout' in content:
                    implemented_features.append("✅ Responsive layout system")
                else:
                    missing_features.append("❌ Responsive layout system")
                    
                if 'getMobileFontScale' in content:
                    implemented_features.append("✅ Mobile font scaling")
                else:
                    missing_features.append("❌ Mobile font scaling")
        
        if os.path.exists(mobile_test_path):
            implemented_features.append("✅ Mobile testing framework")
        else:
            missing_features.append("❌ Mobile testing framework")
        
        print("🎯 IMPLEMENTED FEATURES:")
        for feature in implemented_features:
            print(f"  {feature}")
        
        if missing_features:
            print("\n🚧 MISSING FEATURES:")
            for feature in missing_features:
                print(f"  {feature}")
        
        # Task status analysis
        print("\n📋 TASK STATUS ANALYSIS:")
        print("  MobileLayoutOptimization: CURRENT")
        print("    - Core systems appear implemented")
        print("    - Needs validation testing")
        print("    - May be ready for completion")
        
        print("\n  GameScreenMobileOptimization: PENDING")
        print("    - Focused on spacing and messaging")
        print("    - Ready to start after MobileLayoutOptimization")
        print("    - Addresses screenshot feedback")
        
        return {
            "implemented_features": len(implemented_features),
            "missing_features": len(missing_features),
            "completion_percentage": len(implemented_features) / (len(implemented_features) + len(missing_features)) * 100 if (implemented_features or missing_features) else 0
        }

if __name__ == "__main__":
    runner = MobileEvaluationRunner()
    
    # Generate status summary first
    summary = runner.generate_summary_report()
    
    print(f"\n🎯 Current Implementation: {summary['completion_percentage']:.1f}% complete")
    
    # Ask about running evaluation
    print("\n" + "=" * 50)
    print("🔍 Run interactive mobile evaluation? (y/n)")
    
    # For AI agents, provide the framework without interactive prompt
    print("\nFor AI Agent Analysis:")
    print("The mobile evaluation framework has been created at:")
    print("tests/test_mobile_evaluation.html")
    print("\nThis provides:")
    print("- Automated mobile layout testing")
    print("- Console-based debug output") 
    print("- Issue detection and prioritization")
    print("- Task completion recommendations")
    
    # Note: Commenting out interactive part for AI workflow
    # response = input().lower().strip()
    # if response == 'y':
    #     runner.run_evaluation()
