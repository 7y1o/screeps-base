const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    outfile: '../main.js',
    platform: 'node',
    keepNames: true,
    charset: 'utf8'
}).catch(() => process.exit(1));