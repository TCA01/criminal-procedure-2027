const fs = require('fs');
let s = fs.readFileSync('node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js', 'utf8');
s = s.replace('bundle = await rollup(rollupOptions);', 'console.log("--> CALLING ROLLUP..."); bundle = await rollup(rollupOptions); console.log("--> ROLLUP RETURNED BUNDLE");');
s = s.replace('res.push(await bundle[options.write ? "write" : "generate"](output));', 'console.log("--> CALLING BUNDLE WRITE..."); const _r = await bundle[options.write ? "write" : "generate"](output); console.log("--> BUNDLE WRITE DONE"); res.push(_r);');
fs.writeFileSync('node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js', s);
console.log('Patched vite for debugging');
