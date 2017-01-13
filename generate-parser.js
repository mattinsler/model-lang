import fs from 'fs';
import peg from 'pegjs';
import language from './language';
import buildLanguage from './build-language';

const lang = buildLanguage(language);
fs.writeFileSync('parser.peg', lang);

const parser = peg.generate(lang, {
  cache: false,
  dependencies: {},
  exportVar: null,
  format: 'commonjs',
  optimize: 'speed',
  output: 'source',
  plugins: [],
  trace: false
});

fs.writeFileSync('parser.js', parser);
