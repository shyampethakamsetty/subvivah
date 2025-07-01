// Environment validation test script
require('dotenv').config({ path: './docker.env' });

console.log('🧪 ===== ENVIRONMENT VALIDATION TEST =====\n');

// Import the validation functions
const { validateEnvironment, validateCriticalEnvVars, debugEnvironment } = require('./src/lib/envValidation.ts');

try {
  console.log('🔍 Running comprehensive environment validation...\n');
  
  // Run full validation
  const result = validateEnvironment();
  
  console.log('\n📊 ===== VALIDATION RESULTS =====');
  console.log(`✅ Overall Status: ${result.isValid ? 'PASSED' : 'FAILED'}`);
  console.log(`📊 Total Variables: ${result.summary.total}`);
  console.log(`✅ Valid: ${result.summary.valid}`);
  console.log(`❌ Missing: ${result.summary.missing}`);
  console.log(`❌ Invalid: ${result.summary.invalid}`);
  console.log(`⚠️ Warnings: ${result.summary.warnings}`);
  
  if (result.errors.length > 0) {
    console.log('\n❌ ===== CRITICAL ERRORS =====');
    result.errors.forEach(error => console.log(error));
  }
  
  if (result.warnings.length > 0) {
    console.log('\n⚠️ ===== WARNINGS =====');
    result.warnings.forEach(warning => console.log(warning));
  }
  
  // Test critical variables specifically
  console.log('\n🔍 Testing critical environment variables...');
  const criticalValid = validateCriticalEnvVars();
  console.log(`✅ Critical variables validation: ${criticalValid ? 'PASSED' : 'FAILED'}`);
  
  // Debug environment
  console.log('\n🔍 Environment debug information:');
  debugEnvironment();
  
  // Final result
  if (result.isValid && criticalValid) {
    console.log('\n🎉 ===== ALL TESTS PASSED =====');
    console.log('✅ Environment is properly configured for production');
    console.log('✅ All critical variables are set');
    console.log('✅ JWT secrets are properly configured');
    console.log('✅ Database connection is configured');
    console.log('✅ Application URL is set');
  } else {
    console.log('\n❌ ===== VALIDATION FAILED =====');
    console.log('❌ Please fix the issues above before deploying to production');
    process.exit(1);
  }
  
} catch (error) {
  console.error('\n❌ ===== VALIDATION ERROR =====');
  console.error('❌ Error during validation:', error.message);
  console.error('❌ Stack trace:', error.stack);
  process.exit(1);
} 