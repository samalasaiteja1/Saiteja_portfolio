const fs = require('fs');
const path = require('path');

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.ejs')) {
      let c = fs.readFileSync(p, 'utf8');
      const fixed = c.replace(/<motion/g, '<div').replace(/<\/motion>/g, '</div>');
      if (c !== fixed) {
        fs.writeFileSync(p, fixed);
        console.log('Fixed:', p);
      }
    }
  }
}

walk(path.join(__dirname, '..', 'views'));
