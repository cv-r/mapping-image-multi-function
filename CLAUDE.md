# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A browser-only TypeScript library that converts image URLs to Base64 and/or compresses existing Base64 images, using the Canvas API. Published as `mapping-image-multi-function` on npm. Zero runtime dependencies.

## Commands

```bash
npm run build    # tsup — outputs ESM + CJS + .d.ts into dist/
npm run dev      # tsup --watch
npx tsc --noEmit # type-check only
```

## Architecture

- **`src/index.ts`** — `ChangeImage` class with interfaces (`ChangeImageConfig`, `ImageToBase64Params`, `PhotoCompressParams`). Named export `{ ChangeImage }` + default export.
  - `constructor(config)` — stores `width`, `height`, `callback`, `quality`, `type` as private fields for use as fallback defaults.
  - `imageUrlToBase64(params)` — loads image via `new Image()` (crossOrigin anonymous), draws onto canvas, calls `canvas.toDataURL()`. If `decompression` is true, chains into `photoCompress`. Has `onerror` handler.
  - `photoCompress(params)` — loads base64 image, re-draws at specified dimensions/quality via canvas. Has `onerror` handler.
  - `quality` uses `??` (nullish coalescing) so `0` is not treated as falsy.

- **`index.html`** — Demo page with two sections: (1) URL→Base64, (2) compression with quality slider. Imports from `./dist/index.js`.

- **`tsup.config.ts`** — Build config: entry `src/index.ts`, formats `['esm', 'cjs']`, `dts: true`, `clean: true`.

- **`dist/`** — Build output (gitignored). `index.js` (ESM), `index.cjs` (CJS), `index.d.ts` + `index.d.cts` (types).

Canvas API is required at runtime — this is not a Node.js module.
