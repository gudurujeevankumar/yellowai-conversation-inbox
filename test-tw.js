const { execSync } = require('child_process');
try {
  execSync('npx tailwindcss -i src/index.css -o dist/test.css', { stdio: 'inherit' });
} catch (e) {
  console.log(e);
}
