const fs = require('fs');
const path = require('path');

/**
 * Debug tool for XmasMM interaction issues
 * Analyzes game structure and identifies potential interaction problems
 */

class InteractionDebugger {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '..');
        this.issues = [];
        this.checks = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
        console.log(logEntry);
        this.checks.push({ timestamp, type, message });
    }

    error(message) {
        this.log(message, 'error');
        this.issues.push(message);
    }

    warning(message) {
        this.log(message, 'warning');
    }

    success(message) {
        this.log(message, 'success');
    }

    async checkFileExists(filePath) {
        try {
            await fs.promises.access(path.join(this.projectRoot, filePath));
            return true;
        } catch {
            return false;
        }
    }

    async readFile(filePath) {
        try {
            return await fs.promises.readFile(path.join(this.projectRoot, filePath), 'utf8');
        } catch (error) {
            this.error(`Failed to read ${filePath}: ${error.message}`);
            return null;
        }
    }

    async checkCoreFiles() {
        this.log('Checking core game files...');
        
        const coreFiles = [
            'index.html',
            'js/main.js',
            'js/scenes/GameScene.js',
            'js/managers/ActiveRowManager.js',
            'js/managers/ScrollableHistoryManager.js',
            'js/managers/ElementPicker.js'
        ];

        for (const file of coreFiles) {
            const exists = await this.checkFileExists(file);
            if (exists) {
                this.success(`✓ ${file} exists`);
            } else {
                this.error(`✗ ${file} missing`);
            }
        }
    }

    async checkAssetReferences() {
        this.log('Checking asset references...');
        
        const gameSceneContent = await this.readFile('js/scenes/GameScene.js');
        if (!gameSceneContent) return;

        // Check for removed wrong symbol references
        const wrongSymbolRefs = gameSceneContent.match(/feedback_wrong_/g);
        if (wrongSymbolRefs) {
            this.error(`Found ${wrongSymbolRefs.length} references to removed wrong symbols`);
        } else {
            this.success('✓ No wrong symbol references found');
        }

        // Check for required assets
        const requiredAssets = [
            'feedback_perfect_star',
            'feedback_close_bell',
            'candycane',
            'mistletoe',
            'present',
            'santa',
            'snowflake',
            'star',
            'tree'
        ];

        for (const asset of requiredAssets) {
            if (gameSceneContent.includes(asset)) {
                this.success(`✓ ${asset} referenced in code`);
            } else {
                this.warning(`? ${asset} not found in GameScene`);
            }
        }
    }

    async checkInteractionSetup() {
        this.log('Checking interaction setup...');

        const activeRowContent = await this.readFile('js/managers/ActiveRowManager.js');
        if (!activeRowContent) return;

        // Check for key interaction methods
        const interactionMethods = [
            'setupSlotInteraction',
            'addSlotTouchFeedback',
            'showElementPicker'
        ];

        for (const method of interactionMethods) {
            if (activeRowContent.includes(method)) {
                this.success(`✓ ${method} found in ActiveRowManager`);
            } else {
                this.error(`✗ ${method} missing from ActiveRowManager`);
            }
        }

        // Check for container interaction setup
        if (activeRowContent.includes('setInteractive') || activeRowContent.includes('on(\'pointerdown\'')) {
            this.success('✓ Interactive elements configured');
        } else {
            this.warning('? No interactive setup found');
        }
    }

    async checkElementPicker() {
        this.log('Checking ElementPicker service...');

        const pickerContent = await this.readFile('js/managers/ElementPicker.js');
        if (!pickerContent) return;

        // Check for key picker methods
        const pickerMethods = [
            'showElementPicker',
            'closeElementPicker',
            'selectElement'
        ];

        for (const method of pickerMethods) {
            if (pickerContent.includes(method)) {
                this.success(`✓ ${method} found in ElementPicker`);
            } else {
                this.error(`✗ ${method} missing from ElementPicker`);
            }
        }
    }

    async checkContainerStructure() {
        this.log('Checking container structure...');

        const scrollManagerContent = await this.readFile('js/managers/ScrollableHistoryManager.js');
        if (!scrollManagerContent) return;

        // Check for container hierarchy
        if (scrollManagerContent.includes('this.activeRowContainer')) {
            this.success('✓ Active row container found');
        } else {
            this.error('✗ Active row container missing');
        }

        if (scrollManagerContent.includes('submitButton')) {
            this.success('✓ Submit button container integration found');
        } else {
            this.warning('? Submit button integration unclear');
        }
    }

    async generateReport() {
        const reportPath = path.join(this.projectRoot, 'test-results', 'interaction_debug_report.json');
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalChecks: this.checks.length,
                issues: this.issues.length,
                status: this.issues.length === 0 ? 'PASSED' : 'ISSUES_FOUND'
            },
            issues: this.issues,
            checks: this.checks
        };

        try {
            await fs.promises.mkdir(path.dirname(reportPath), { recursive: true });
            await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));
            this.success(`Report saved to: ${reportPath}`);
        } catch (error) {
            this.error(`Failed to save report: ${error.message}`);
        }

        return report;
    }

    async run() {
        this.log('Starting XmasMM Interaction Debug Analysis...');
        
        await this.checkCoreFiles();
        await this.checkAssetReferences();
        await this.checkInteractionSetup();
        await this.checkElementPicker();
        await this.checkContainerStructure();
        
        const report = await this.generateReport();
        
        this.log(`Debug analysis complete. Found ${this.issues.length} issues.`);
        
        if (this.issues.length > 0) {
            console.log('\n🚨 ISSUES FOUND:');
            this.issues.forEach((issue, index) => {
                console.log(`${index + 1}. ${issue}`);
            });
        } else {
            console.log('\n✅ No critical issues found!');
        }

        return report;
    }
}

// Run if called directly
if (require.main === module) {
    const interactionDebugger = new InteractionDebugger();
    interactionDebugger.run().catch(console.error);
}

module.exports = InteractionDebugger;
