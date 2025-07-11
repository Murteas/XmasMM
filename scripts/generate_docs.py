#!/usr/bin/env python3
"""
Generate documentation for scripts directory dynamically.
This script scans all Python files in the scripts directory and extracts
their documentation to keep TASK_MANAGEMENT.md automatically up to date.
"""

import os
import ast
import re
from pathlib import Path

def extract_script_info(filepath):
    """Extract docstring and key functions from a Python script."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Parse the AST to get docstring
        tree = ast.parse(content)
        docstring = ast.get_docstring(tree)
        
        # Extract function definitions
        functions = []
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef) and not node.name.startswith('_'):
                func_doc = ast.get_docstring(node)
                functions.append({
                    'name': node.name,
                    'doc': func_doc or 'No documentation'
                })
        
        return {
            'name': os.path.basename(filepath),
            'docstring': docstring or 'No description available',
            'functions': functions
        }
    except Exception as e:
        return {
            'name': os.path.basename(filepath),
            'docstring': f'Error reading file: {e}',
            'functions': []
        }

def generate_scripts_documentation():
    """Generate markdown documentation for all scripts."""
    scripts_dir = Path(__file__).parent
    scripts = []
    
    # Get all Python files except this one and __pycache__
    for py_file in scripts_dir.glob('*.py'):
        if py_file.name != 'generate_docs.py':
            scripts.append(extract_script_info(py_file))
    
    # Sort by name for consistent output
    scripts.sort(key=lambda x: x['name'])
    
    # Generate markdown
    markdown = "### 🔧 Management Scripts\n\n"
    
    for script in scripts:
        markdown += f"#### `scripts/{script['name']}`\n"
        markdown += f"{script['docstring']}\n"
        
        if script['functions']:
            markdown += "Key functions:\n"
            for func in script['functions']:
                # Clean up function documentation
                func_desc = func['doc'].split('\n')[0] if func['doc'] != 'No documentation' else 'No documentation'
                markdown += f"- `{func['name']}()` - {func_desc}\n"
        
        markdown += "\n"
    
    return markdown

def update_task_management_md():
    """Update TASK_MANAGEMENT.md with current scripts documentation."""
    task_mgmt_path = Path(__file__).parent.parent / 'TASK_MANAGEMENT.md'
    
    # Read current content
    with open(task_mgmt_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Generate new scripts documentation
    new_scripts_doc = generate_scripts_documentation()
    
    # Find the scripts section and replace it
    # Look for the pattern between "### 🔧 Management Scripts" and the next "###" or "##"
    pattern = r'(### 🔧 Management Scripts\n\n).*?(?=\n## |\n### |$)'
    
    if re.search(pattern, content, re.DOTALL):
        # Replace existing section
        new_content = re.sub(pattern, r'\1' + new_scripts_doc.rstrip() + '\n\n', content, flags=re.DOTALL)
    else:
        # If section doesn't exist, add it after "## Core Files"
        core_files_pattern = r'(## Core Files\n\n.*?)(## )'
        replacement = r'\1' + new_scripts_doc + r'\2'
        new_content = re.sub(core_files_pattern, replacement, content, flags=re.DOTALL)
    
    # Write back to file
    with open(task_mgmt_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✓ Updated TASK_MANAGEMENT.md with current scripts documentation")
    print(f"📄 Documented {len([s for s in new_scripts_doc.split('####') if s.strip()])} scripts")

if __name__ == '__main__':
    update_task_management_md()
