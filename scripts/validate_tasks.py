#!/usr/bin/env python3
"""Validation script to keep tasks.json synchronized with /tasks markdown files.

Checks performed:
1. Each non-completed markdown file in /tasks has an entry in tasks.json.
2. Each task object (phase not null) has a corresponding markdown file (present either in /tasks or /tasks/completed).
3. Reports discrepancies with actionable suggestions.
4. Computes derived progress (completed vs total) and flags mismatch with tasks.json currentState.overallProgress.

Usage:
  python scripts/validate_tasks.py
"""
import json, os, sys, re, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TASKS_JSON = ROOT / 'tasks.json'
TASKS_DIR = ROOT / 'tasks'
COMPLETED_DIR = TASKS_DIR / 'completed'

ANSI = {
    'red': '\u001b[31m',
    'green': '\u001b[32m',
    'yellow': '\u001b[33m',
    'blue': '\u001b[34m',
    'reset': '\u001b[0m'
}

def color(txt, c):
    return f"{ANSI.get(c,'')}{txt}{ANSI['reset']}"

def load_tasks():
    with open(TASKS_JSON, 'r', encoding='utf-8') as f:
        return json.load(f)

def list_markdown_tasks():
    md = []
    for p in TASKS_DIR.glob('*.md'):
        md.append(p)
    for p in COMPLETED_DIR.glob('*.md'):
        md.append(p)
    return md

def id_from_filename(p: Path):
    return p.stem  # file base name without extension

def main():
    errors = []
    warnings = []

    if not TASKS_JSON.exists():
        print(color('ERROR: tasks.json not found', 'red'))
        sys.exit(1)

    data = load_tasks()

    task_objs = data.get('tasks', {})
    task_ids_json = set(task_objs.keys())

    md_files = list_markdown_tasks()
    md_ids = set(id_from_filename(p) for p in md_files)

    # Determine which markdown tasks are not represented in JSON
    missing_in_json = sorted(md_ids - task_ids_json)
    if missing_in_json:
        errors.append(f"Markdown tasks missing in tasks.json: {missing_in_json}")

    # Determine which JSON tasks have no markdown file
    missing_md = sorted(task_ids_json - md_ids)
    # Allow purely internal tasks without markdown by naming convention? Here we flag all.
    if missing_md:
        warnings.append(f"Tasks in JSON without markdown file: {missing_md}")

    # Progress recompute
    completed = 0
    total = 0
    for tid, obj in task_objs.items():
        status = obj.get('status', '').upper()
        if status:
            total += 1
            if status == 'COMPLETED':
                completed += 1
    pct_calc = int(round((completed / total) * 100)) if total else 0

    reported = data.get('currentState', {}).get('overallProgress', {})
    rep_completed = reported.get('completed')
    rep_total = reported.get('total')
    rep_pct = reported.get('percentage')

    if (rep_completed, rep_total, rep_pct) != (completed, total, pct_calc):
        warnings.append(
            f"Progress mismatch: reported (c={rep_completed}, t={rep_total}, p={rep_pct}%) vs actual (c={completed}, t={total}, p={pct_calc}%)."
        )

    # Output summary
    print(color('Task Validation Report', 'blue'))
    print('-' * 60)
    print(f"Total tasks (JSON): {total}")
    print(f"Completed tasks   : {completed}")
    print(f"Calculated percent: {pct_calc}%")
    print('-' * 60)

    if errors:
        print(color('Errors:', 'red'))
        for e in errors:
            print('  - ' + e)
    else:
        print(color('No blocking errors detected.', 'green'))

    if warnings:
        print(color('Warnings:', 'yellow'))
        for w in warnings:
            print('  - ' + w)
    else:
        print(color('No warnings.', 'green'))

    # Exit code: 1 if errors, 0 otherwise
    sys.exit(1 if errors else 0)

if __name__ == '__main__':
    main()
