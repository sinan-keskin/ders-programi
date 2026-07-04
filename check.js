const fs = require('fs');
const css = fs.readFileSync('style.css', 'utf8');
const lines = css.split('\n');
lines.forEach((line, i) => {
  if(line.includes('plan-grid')) console.log(`Line ${i+1}: ${line}`);
});
