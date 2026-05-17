import fs from 'fs';
import { build } from 'vite';

async function run() {
  const code1 = `const m = import.meta.glob('./user-behavior/*.csv', { query: '?raw', import: 'default', eager: true }); console.log(m);`;
  const code2 = `const m = import.meta.glob('./user-behavior/*.csv', { query: 'raw', import: 'default', eager: true }); console.log(m);`;
  const code3 = `const m = import.meta.glob('./user-behavior/*.csv', { eager: true, as: 'raw' }); console.log(m);`;

  fs.writeFileSync('src/data/test1.ts', code1);
  fs.writeFileSync('src/data/test2.ts', code2);
  fs.writeFileSync('src/data/test3.ts', code3);

  for (let i of [1,2,3]) {
    try {
      const res = await build({
        root: '.',
        logLevel: 'silent',
        build: { write: false, rollupOptions: { input: `src/data/test${i}.ts` } }
      });
      console.log(`Test ${i}:`, res.output[0].code);
    } catch(e) { console.log(`Test ${i} failed:`, e.message); }
  }
}
run();
