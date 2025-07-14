// test_runner.js - Automated test runner that logs results we can verify
const fs = require('fs');
const { exec } = require('child_process');

// Simple test runner that uses curl to check endpoints and logs results
async function runTests() {
  const results = [];
  const timestamp = new Date().toISOString();
  
  console.log('🧪 Starting automated test verification...');
  
  // Test 1: Check if ModuleLoader.js is accessible
  try {
    const moduleLoaderTest = await execPromise('curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/js/utils/ModuleLoader.js');
    const status = moduleLoaderTest.trim();
    results.push({
      test: 'ModuleLoader.js accessibility',
      status: status === '200' ? 'PASS' : 'FAIL',
      details: `HTTP ${status}`
    });
  } catch (error) {
    results.push({
      test: 'ModuleLoader.js accessibility',
      status: 'FAIL',
      details: error.message
    });
  }
  
  // Test 2: Check if test files are accessible
  const testFiles = [
    'test_comprehensive.html',
    'test_mobile_expert.html',
    'test_module_loader_debug.html'
  ];
  
  for (const file of testFiles) {
    try {
      const fileTest = await execPromise(`curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/tests/${file}`);
      const status = fileTest.trim();
      results.push({
        test: `${file} accessibility`,
        status: status === '200' ? 'PASS' : 'FAIL',
        details: `HTTP ${status}`
      });
    } catch (error) {
      results.push({
        test: `${file} accessibility`,
        status: 'FAIL',
        details: error.message
      });
    }
  }
  
  // Generate report
  const report = {
    timestamp,
    results,
    summary: {
      total: results.length,
      passed: results.filter(r => r.status === 'PASS').length,
      failed: results.filter(r => r.status === 'FAIL').length
    }
  };
  
  // Write to file
  fs.writeFileSync('test_results.json', JSON.stringify(report, null, 2));
  
  // Console output
  console.log('\n📊 Test Results:');
  results.forEach(result => {
    const emoji = result.status === 'PASS' ? '✅' : '❌';
    console.log(`${emoji} ${result.test}: ${result.status} (${result.details})`);
  });
  
  console.log(`\n📈 Summary: ${report.summary.passed}/${report.summary.total} tests passed`);
  console.log(`📄 Full results saved to test_results.json`);
}

function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

runTests().catch(console.error);
