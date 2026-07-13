# Layout Extension ESM and TypeScript Build/Test Feature

This feature modernises a Cytoscape layout extension so its source is written in TypeScript with ESM syntax, while publishing browser, CommonJS, ESM, and TypeScript entrypoints from one reproducible build pipeline.

The approach applies to Cytoscape extensions that wrap an algorithm supplied by another package.

## Goals

- Write extension source as strict TypeScript using native `import` and `export`.
- Publish readable and minified UMD and ESM bundles.
- Publish generated TypeScript declarations.
- Keep existing CommonJS, browser-global, and legacy artifact compatibility.
- Bundle the layout algorithm when consumers should not install it separately.
- Keep Cytoscape as a peer dependency.
- Test source behavior, built artifacts, and the consumer-facing type API.
- Ensure committed bundles and declarations match a clean build.

## Package Shape

Expose the package through:

```json
{
  "main": "dist/<extension>.js",
  "module": "dist/<extension>.mjs",
  "types": "index.d.ts",
  "exports": {
    ".": {
      "types": "./index.d.ts",
      "import": "./dist/<extension>.mjs",
      "require": "./dist/<extension>.js"
    },
    "./package.json": "./package.json"
  },
  "files": [
    "dist",
    "src",
    "test",
    "index.d.ts"
  ]
}
```

The artifacts should be:

- `dist/<extension>.js`: readable CommonJS-compatible UMD build
- `dist/<extension>.min.js`: minified UMD build
- `dist/<extension>.mjs`: readable ESM build
- `dist/<extension>.min.mjs`: minified ESM build
- A source map for every bundle
- `index.d.ts`: generated public declaration file

Do not set the package root to `"type": "module"` when the package exposes a CommonJS-compatible `.js` bundle. If Node imports TypeScript source directly in tests, add a nested `src/package.json` containing:

```json
{
  "type": "module"
}
```

This marks the TypeScript source as ESM without changing how `dist/*.js` is interpreted.

## Dependencies

Cytoscape belongs in `peerDependencies`:

```json
{
  "peerDependencies": {
    "cytoscape": "^3.x"
  }
}
```

It may also appear in `devDependencies` for compilation and testing.

When the layout algorithm is bundled into every distribution artifact, keep it in `devDependencies`, not `dependencies`. This prevents consumers from installing an unused duplicate copy.

## TypeScript Source Conversion

Rename source files from `.js` or `.mjs` to `.ts` and retain native ESM syntax:

```ts
import layout from './layout.ts';

export default function register(cytoscape?: typeof import('cytoscape')) {
  if (!cytoscape) return;

  cytoscape('layout', '<layout-name>', layout);
}
```

Recommended compiler settings:

```json
{
  "compilerOptions": {
    "target": "ES2019",
    "module": "Node16",
    "moduleResolution": "Node16",
    "lib": ["ES2019", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "allowImportingTsExtensions": true,
    "noEmit": true
  },
  "include": ["src/**/*.ts", "index.ts"]
}
```

The bundler, rather than `tsc`, should emit JavaScript. The primary TypeScript configuration only type-checks the source.

For Node 24-based extension development, use the current TypeScript 7 release with `module` and `moduleResolution` set to `Node16` or newer. Oxlint avoids coupling the compiler upgrade to typescript-eslint's supported TypeScript peer range.

### Runtime typing

Type the implementation using:

- `cytoscape.Core`
- `cytoscape.CollectionArgument`
- `cytoscape.NodeSingular`
- `cytoscape.EdgeSingular`
- `cytoscape.Position`
- Cytoscape bounding-box, animation, callback, and style types
- Graph, node-label, edge-label, and option types exported by the algorithm package
- Focused local types for layout instances, scratch data, control points, and normalised bounding boxes

Keep a function-style layout constructor when required by Cytoscape's extension registration behavior. Do not replace it with an ES class without verifying runtime compatibility.

Avoid broad `any` types. When upstream declarations are incomplete, isolate the mismatch behind a small typed adapter or an `unknown` cast. Configure the linter to reject new explicit `any` usage.

## Public TypeScript API

Keep the editable declaration source in a root `index.ts` and generate `index.d.ts` from it.

A separate declaration configuration can use:

```json
{
  "compilerOptions": {
    "target": "ES2019",
    "module": "Node16",
    "moduleResolution": "Node16",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "emitDeclarationOnly": true
  },
  "files": ["index.ts"]
}
```

The public declaration should:

- Export the registration function as `cytoscape.Ext`.
- Preserve the CommonJS-compatible `export =` shape.
- Expose a namespace containing layout-specific types.
- Define option literals rather than general strings where values are known.
- Use Cytoscape callback and element types.
- Extend Cytoscape's common layout interfaces.
- Type extension-specific style configuration with `cytoscape.Css` types where possible.

Example structure:

```ts
import cytoscape = require('cytoscape');

declare const extension: cytoscape.Ext;
export = extension;

declare namespace extension {
  type RankDirection = 'TB' | 'BT' | 'LR' | 'RL';

  interface LayoutOptions
    extends cytoscape.BaseLayoutOptions,
      cytoscape.AnimatedLayoutOptions,
      cytoscape.LayoutDimensionOptions {
    name: '<layout-name>';
    rankDir?: RankDirection;
    transform?: (
      node: cytoscape.NodeSingular,
      position: cytoscape.Position
    ) => cytoscape.Position;
  }
}
```

Cytoscape's general `LayoutOptions` is a non-mergeable type alias. Do not attempt to redeclare it. Instead, augment mergeable interfaces with narrow overloads:

```ts
declare module 'cytoscape' {
  interface CoreLayout {
    layout(options: extension.LayoutOptions): cytoscape.Layouts;
    makeLayout(options: extension.LayoutOptions): cytoscape.Layouts;
    createLayout(options: extension.LayoutOptions): cytoscape.Layouts;
  }

  interface CollectionLayout {
    layout(options: extension.LayoutOptions): cytoscape.Layouts;
    makeLayout(options: extension.LayoutOptions): cytoscape.Layouts;
    createLayout(options: extension.LayoutOptions): cytoscape.Layouts;
  }
}
```

This lets consumers write:

```ts
cy.layout({
  name: '<layout-name>',
  rankDir: 'LR'
});
```

without manually casting or annotating the options.

## Build Pipeline

Rollup or Rolldown may build every artifact from `src/index.ts`. Rolldown is convenient because it handles TypeScript, Node resolution, and CommonJS interoperability without separate plugins.

Recommended shared settings:

- Input: `src/index.ts`
- Browser platform
- ES2015 distribution target
- Source maps enabled
- Package name/version/license banner
- Algorithm dependency bundled
- Cytoscape excluded unless the source imports it at runtime

Recommended outputs:

```js
[
  { format: 'umd', file: 'dist/<extension>.js' },
  { format: 'umd', file: 'dist/<extension>.min.js', minify: true },
  { format: 'es', file: 'dist/<extension>.mjs' },
  { format: 'es', file: 'dist/<extension>.min.mjs', minify: true }
]
```

When using Rollup rather than Rolldown, typical plugins are:

- `@rollup/plugin-node-resolve`
- `@rollup/plugin-commonjs`
- A TypeScript or Babel transform
- `@rollup/plugin-terser`

Do not mark the algorithm dependency as external when the published extension is supposed to be self-contained.

## Compatibility Artifacts

If the package previously exposed a root browser file, preserve it:

```text
<extension>.js -> dist/<extension>.js
```

Demo or pages-directory symlinks should point directly to the readable UMD build rather than chaining through another symlink.

Demos should load only Cytoscape and the extension browser artifact. Remove separate script tags for an algorithm that is now bundled.

## Scripts

A canonical script arrangement is:

```json
{
  "scripts": {
    "lint": "oxlint src",
    "copyright": "node uplic.mjs",
    "check": "tsc --noEmit -p tsconfig.json",
    "build:types": "tsc -p tsconfig.types.json",
    "build:js": "rolldown -c rolldown.config.mjs",
    "build": "npm run build:js && npm run build:types",
    "build:release": "npm run copyright && npm run build",
    "watch": "rolldown -c rolldown.config.mjs --watch",
    "test:types": "tsc --noEmit -p test/types/tsconfig.json",
    "test:node": "node --test test/*.test.mjs",
    "verify:generated": "git diff --exit-code -- dist index.d.ts",
    "test": "npm run check && npm run lint && npm run build && npm run test:types && npm run test:node && npm run verify:generated"
  }
}
```

Use Oxlint with a checked-in `.oxlintrc.json`. Enable its TypeScript rules, including `typescript/no-explicit-any`, so linting does not constrain the supported TypeScript compiler version through typescript-eslint peer dependencies.

Use a small dependency-free `uplic.mjs`, following the approach in the main Cytoscape repository, to regenerate the standard MIT license with `new Date().getFullYear()`. Avoid obsolete license-updater packages with large, unmaintained dependency trees.

If readable and minified builds use separate commands, ensure the release workflow invokes both.

`verify:generated` assumes generated artifacts are committed. In CI it detects source changes that were not accompanied by rebuilt bundles or declarations.

## Consumer Type Tests

Add compile-only fixtures for both module systems:

```text
test/types/esm.mts
test/types/commonjs.cts
test/types/tsconfig.json
```

Use the package's own name so TypeScript resolves its published `exports` and `types` metadata.

Test:

- ESM default import
- CommonJS `import = require`
- `cytoscape.use(extension)`
- Exported layout option types
- Direct `cy.layout()` calls
- Collection layout calls
- Contextual callback parameter inference
- Expected errors for invalid literal option values

Use `@ts-expect-error` for intentional negative cases so the test fails if an invalid value becomes accepted.

## Runtime and Artifact Tests

Use Node's built-in test runner and strict assertion library, keeping generated-artifact tests separate from source-level layout tests:

- `test/build-artifacts.test.mjs`
- `test/source-layout.test.mjs`

### Artifact coverage

Verify:

- `main`, `module`, `types`, and conditional exports
- Cytoscape peer dependency
- Bundled algorithm in `devDependencies`
- CommonJS loading of readable and minified UMD builds
- Dynamic import of readable and minified ESM builds
- Source maps for every build
- No external algorithm import or `require()` remains
- A recognisable algorithm marker exists in each bundle
- Legacy symlinks point to the intended UMD file

### Source behavior coverage

Import `src/index.ts`, register it with Cytoscape, and test headlessly.

Cover:

- Simple graph positions
- Directional options
- Transform callbacks
- Per-node or per-edge option callbacks
- Sorting callbacks
- Compound nodes and parent-edge filtering
- Disconnected components
- Both bounding-box forms
- Algorithm-specific control points or styles
- Degenerate or missing optional algorithm output where applicable

Prefer relative ordering and finite-position assertions over exact coordinates.

When enabling Cytoscape styles in headless tests, destroy the Cytoscape instance after the test so style-related handles do not keep the Node test process running.

## Continuous Integration

The GitHub Actions workflow should:

1. Check out the repository.
2. Configure the Node version from `.nvmrc`.
3. Run `npm ci`.
4. Run the canonical `npm test`.

Avoid separately repeating lint and type-check commands when `npm test` already includes them.

## Migration Sequence

1. Establish the desired package exports and compatibility artifacts.
2. Move bundled algorithm packages to `devDependencies`.
3. Rename source files to `.ts` and convert imports/exports to ESM.
4. Add strict compiler and declaration-generation configurations.
5. Type public options and the registration function.
6. Type runtime Cytoscape and algorithm boundaries.
7. Configure UMD and ESM builds from the TypeScript entrypoint.
8. Add artifact, runtime, and consumer type tests.
9. Regenerate and commit `dist/` and `index.d.ts`.
10. Consolidate CI around `npm test`.
11. Update demos, build documentation, and publishing instructions.
12. Inspect the final npm package contents.

## Verification

Run from a clean checkout:

```sh
npm ci
npm test
npm pack --dry-run
git status --short
```

The final status must remain clean after `npm test`.

The package dry run should contain:

- All four distribution bundles
- All four source maps
- Generated declarations
- Source files
- Consumer type fixtures and runtime tests, when intentionally published

If the npm cache is not writable:

```sh
npm --cache /tmp/<package>-npm-cache pack --dry-run
```

## Acceptance Criteria

- TypeScript source passes strict checking without broad `any` usage.
- ESM and CommonJS consumers can register the extension.
- Direct Cytoscape layout calls receive layout-specific type checking.
- Browser-global UMD usage remains compatible.
- The algorithm is bundled and is not installed as a runtime dependency.
- All readable and minified artifacts load successfully.
- Runtime, artifact, and consumer type tests pass.
- Repeated builds produce identical generated files.
- CI uses the same canonical test command as local development.
- A clean build leaves `dist/` and `index.d.ts` unchanged.
