import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Building frontend...');
execSync('npm run build', { 
  cwd: path.join(__dirname, 'frontend'), 
  stdio: 'inherit' 
});

console.log('Frontend built successfully!');
console.log('Starting backend server...');
execSync('npm start', { 
  cwd: path.join(__dirname, 'backend'), 
  stdio: 'inherit' 
});