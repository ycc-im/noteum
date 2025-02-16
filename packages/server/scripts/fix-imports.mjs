/* global console */
import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, '..', 'src');
const typesDir = join(__dirname, '..', 'types');

async function* walk(dir) {
  const files = await readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const path = join(dir, file.name);
    if (file.isDirectory()) {
      yield* walk(path);
    } else if (file.name.endsWith('.ts') && !file.name.endsWith('.d.ts')) {
      yield path;
    }
  }
}

async function fixImports() {
  for await (const file of walk(srcDir)) {
    let content = await readFile(file, 'utf8');
    content = content.replace(/from ['"]\.\.?\/[^'"]+['"]/g, (match) => {
      if (match.includes('.js')) return match;
      return match.replace(/['"]$/, '.js\'');
    });
    await writeFile(file, content);
  }

  for await (const file of walk(typesDir)) {
    let content = await readFile(file, 'utf8');
    content = content.replace(/from ['"]\.\.?\/[^'"]+['"]/g, (match) => {
      if (match.includes('.js')) return match;
      return match.replace(/['"]$/, '.js\'');
    });
    await writeFile(file, content);
  }
}

fixImports().catch(console.error);
