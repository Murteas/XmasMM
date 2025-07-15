const fs = require('fs');
const path = require('path');

/**
 * Asset verification tool for XmasMM
 * Ensures all required assets exist and are properly sized
 */

class AssetVerifier {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '..');
        this.assetsDir = path.join(this.projectRoot, 'assets');
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

    async checkAssetExists(assetPath) {
        try {
            const stats = await fs.promises.stat(assetPath);
            return {
                exists: true,
                size: stats.size,
                modified: stats.mtime
            };
        } catch {
            return { exists: false };
        }
    }

    async checkGameAssets() {
        this.log('Checking game element assets...');
        
        const gameElements = [
            'candycane',
            'mistletoe', 
            'present',
            'santa',
            'snowflake',
            'star',
            'tree'
        ];

        const densities = ['1x', '2x', '3x'];

        for (const element of gameElements) {
            // Check base asset (might be legacy)
            const baseAsset = path.join(this.assetsDir, `${element}.png`);
            const baseResult = await this.checkAssetExists(baseAsset);
            
            if (baseResult.exists) {
                this.success(`✓ ${element}.png (${baseResult.size} bytes)`);
            }

            // Check density variants
            for (const density of densities) {
                const densityAsset = path.join(this.assetsDir, `${element}_${density}.png`);
                const densityResult = await this.checkAssetExists(densityAsset);
                
                if (densityResult.exists) {
                    this.success(`✓ ${element}_${density}.png (${densityResult.size} bytes)`);
                } else {
                    this.error(`✗ Missing ${element}_${density}.png`);
                }
            }
        }
    }

    async checkFeedbackAssets() {
        this.log('Checking feedback assets...');
        
        const feedbackTypes = [
            { name: 'perfect', icon: 'star' },
            { name: 'close', icon: 'bell' }
        ];

        const densities = ['1x', '2x', '3x'];

        for (const feedback of feedbackTypes) {
            for (const density of densities) {
                const assetName = `feedback_${feedback.name}_${feedback.icon}_${density}.png`;
                const assetPath = path.join(this.assetsDir, assetName);
                const result = await this.checkAssetExists(assetPath);
                
                if (result.exists) {
                    this.success(`✓ ${assetName} (${result.size} bytes)`);
                } else {
                    this.error(`✗ Missing ${assetName}`);
                }
            }
        }

        // Verify no wrong feedback assets exist
        const wrongAssets = await fs.promises.readdir(this.assetsDir);
        const wrongFeedbackFiles = wrongAssets.filter(file => file.includes('feedback_wrong'));
        
        if (wrongFeedbackFiles.length > 0) {
            this.warning(`Found ${wrongFeedbackFiles.length} legacy wrong feedback assets:`);
            wrongFeedbackFiles.forEach(file => this.warning(`  - ${file}`));
        } else {
            this.success('✓ No legacy wrong feedback assets found');
        }
    }

    async checkBackgroundAssets() {
        this.log('Checking background assets...');
        
        const backgrounds = [
            'bg_mobile_orig.png',
            'bg_mobile2.png'
        ];

        for (const bg of backgrounds) {
            const bgPath = path.join(this.assetsDir, bg);
            const result = await this.checkAssetExists(bgPath);
            
            if (result.exists) {
                this.success(`✓ ${bg} (${result.size} bytes)`);
            } else {
                this.warning(`? ${bg} missing`);
            }
        }
    }

    async checkIconAssets() {
        this.log('Checking icon assets...');
        
        const icons = ['icon.png'];

        for (const icon of icons) {
            const iconPath = path.join(this.assetsDir, icon);
            const result = await this.checkAssetExists(iconPath);
            
            if (result.exists) {
                this.success(`✓ ${icon} (${result.size} bytes)`);
            } else {
                this.warning(`? ${icon} missing`);
            }
        }
    }

    async checkAssetSizes() {
        this.log('Checking asset file sizes...');
        
        try {
            const assetFiles = await fs.promises.readdir(this.assetsDir);
            let totalSize = 0;
            let largeAssets = [];

            for (const file of assetFiles) {
                if (path.extname(file) === '.png') {
                    const filePath = path.join(this.assetsDir, file);
                    const stats = await fs.promises.stat(filePath);
                    totalSize += stats.size;
                    
                    // Flag assets larger than 100KB
                    if (stats.size > 100 * 1024) {
                        largeAssets.push({ file, size: stats.size });
                    }
                }
            }

            this.success(`Total asset size: ${Math.round(totalSize / 1024)} KB`);
            
            if (largeAssets.length > 0) {
                this.warning('Large assets found:');
                largeAssets.forEach(asset => {
                    this.warning(`  - ${asset.file}: ${Math.round(asset.size / 1024)} KB`);
                });
            }

        } catch (error) {
            this.error(`Failed to analyze asset sizes: ${error.message}`);
        }
    }

    async generateReport() {
        const reportPath = path.join(this.projectRoot, 'test-results', 'asset_verification_report.json');
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
            this.success(`Asset report saved to: ${reportPath}`);
        } catch (error) {
            this.error(`Failed to save report: ${error.message}`);
        }

        return report;
    }

    async run() {
        this.log('Starting XmasMM Asset Verification...');
        
        await this.checkGameAssets();
        await this.checkFeedbackAssets();
        await this.checkBackgroundAssets();
        await this.checkIconAssets();
        await this.checkAssetSizes();
        
        const report = await this.generateReport();
        
        this.log(`Asset verification complete. Found ${this.issues.length} issues.`);
        
        if (this.issues.length > 0) {
            console.log('\n🚨 ASSET ISSUES:');
            this.issues.forEach((issue, index) => {
                console.log(`${index + 1}. ${issue}`);
            });
        } else {
            console.log('\n✅ All assets verified!');
        }

        return report;
    }
}

// Run if called directly
if (require.main === module) {
    const verifier = new AssetVerifier();
    verifier.run().catch(console.error);
}

module.exports = AssetVerifier;
