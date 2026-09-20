/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...walk(fullPath));
    } else if (/\.(ts|tsx|js|jsx|css|sql)$/.test(item)) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = [...walk('src'), ...walk('supabase'), ...walk('scripts')];
let maxLines = 0;
const violations = [];

console.log('=== AUDIT JUMLAH BARIS KODE (< 100 BARIS PER FILE) ===');
allFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const count = content.split('\n').length;
  if (count > maxLines) maxLines = count;
  const status = count <= 100 ? '✓ PASS' : '✗ FAIL';
  console.log(`${status} [${String(count).padStart(3, ' ')} baris]: ${file}`);
  if (count > 100) {
    violations.push({ file, count });
  }
});

console.log('------------------------------------------------------');
console.log(`Total file diaudit: ${allFiles.length}`);
console.log(`Baris file terpanjang: ${maxLines} baris`);
console.log(`Pelanggaran (>100 baris): ${violations.length}`);

if (violations.length > 0) {
  console.error('Ada file yang melanggar batas 100 baris:', violations);
  process.exit(1);
} else {
  console.log('SEMUA FILE MEMENUHI ATURAN MAKSIMAL 100 BARIS!');
}
