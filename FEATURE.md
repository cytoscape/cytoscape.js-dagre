# Layout Extension Build And Test Feature

This feature modernises a Cytoscape layout extension package so it can publish
browser, CommonJS, ESM, TypeScript, and testable source entrypoints from one
build pipeline.

The same approach can be applied to other Cytoscape layout extensions that wrap
an algorithm implementation supplied by another package.

## Goals

- Use Rollup as the build pipeline for extension distribution files.
- Publish both UMD and ESM builds.
- Publish minified variants of both build formats.
- Bundle the layout algorithm implementation into the distributed extension
  builds when consumers should not install or load it separately.
- Write source files as ESM using `.mjs` extensions.
- Keep Cytoscape as a peer dependency.
- Keep bundled algorithm packages as development dependencies.
- Add TypeScript declarations for extension consumers.
- Add Mocha tests for package metadata, built artifacts, and source-level layout
  behaviour.

## Package Shape

The package should expose the extension in multiple formats:

- `main`: CommonJS-compatible UMD build, e.g. `dist/<extension>.js`
- `module`: ESM build, e.g. `dist/<extension>.mjs`
- `types`: TypeScript declaration file, e.g. `index.d.ts`
- `exports`: conditional package exports for `types`, `import`, and `require`

The layout algorithm library should be moved from `dependencies` to
`devDependencies` if it is bundled into the generated files. This keeps runtime
installation simpler for consumers while preserving reproducible builds.

Cytoscape should remain in `peerDependencies`, because the extension registers
itself against the consumer's Cytoscape instance.

## Build Pipeline

Rollup can build all distribution formats from the same ESM source entrypoint.
Source files should use native `import` and `export` syntax and `.mjs`
extensions, e.g. `src/index.mjs`.

Recommended outputs:

- `dist/<extension>.js`: readable UMD build
- `dist/<extension>.min.js`: minified UMD build
- `dist/<extension>.mjs`: readable ESM build
- `dist/<extension>.min.mjs`: minified ESM build
- source maps for each output

If the package previously published or documented a root-level browser artifact,
preserve that path as a symlink to the readable UMD build, e.g.
`<extension>.js -> dist/<extension>.js`.  If a demo or generated pages directory
uses a symlink for the same browser artifact, point it directly at the UMD build
under `dist/` rather than chaining through the root compatibility symlink.

Recommended Rollup plugins:

- `@rollup/plugin-node-resolve` to include dependencies from `node_modules`
- `@rollup/plugin-commonjs` for CommonJS algorithm packages
- `@rollup/plugin-babel` if the source already uses Babel
- `@rollup/plugin-terser` for minified outputs

Avoid marking the algorithm package as external if the published extension is
expected to be self-contained. Do keep Cytoscape external unless the extension
source directly imports Cytoscape, which most Cytoscape layout extensions do not
need to do.

The release build script should run both the regular build target and the
minified build target, e.g. `run-s build build:min ...`, so release workflows
exercise both commands explicitly.

## TypeScript Declarations

The declaration file should type the extension registration function and expose
layout-specific options.

Useful declaration patterns:

- Export the extension as `cytoscape.Ext`.
- Add a namespace for layout-specific option types.
- Extend Cytoscape's mergeable layout option interfaces rather than attempting
  to redeclare non-mergeable type aliases.
- Include algorithm options as a flexible record, because layout engines often
  support many string-keyed options.

For example, a declaration can define:

- `<LayoutName>LayoutOptions`
- `<LayoutName>AlgorithmOptions`
- `<LayoutName>Algorithm`

The layout options should include common Cytoscape layout fields such as:

- `name`
- `fit`
- `padding`
- `animate`
- `animationDuration`
- `animationEasing`
- `transform`
- `ready`
- `stop`

Then add extension-specific fields such as:

- options passed through to the underlying algorithm
- per-node or per-edge option callbacks
- priority or filtering callbacks

## Tests

Use Mocha for a small but useful ESM test suite.  Test files should use `.mjs`
extensions and native `import` syntax.  Keep tests that inspect generated
package artifacts separate from tests that import and exercise the source
directly.  Give the files descriptive names, for example:

- `test/build-artifacts.test.mjs`
- `test/source-layout.test.mjs`

Package and artifact tests should verify:

- `main`, `module`, `types`, and `exports` point at the intended files.
- Bundled algorithm packages are in `devDependencies`, not `dependencies`.
- Legacy browser artifact symlinks, if present, point at the readable UMD file
  under `dist/`.
- UMD builds can be loaded with CommonJS.
- ESM builds can be loaded with dynamic `import()`.
- Minified builds load successfully.
- Built files do not contain external imports or requires for the bundled
  algorithm package.
- Built files contain a recognizable marker from the bundled algorithm package,
  chosen for the package under test.

Source-level layout tests should import directly from the ESM source entrypoint,
such as `src/index.mjs`, register the extension with Cytoscape, and run
Cytoscape headlessly.

Useful sanity checks:

- A simple graph receives finite, non-zero node positions after layout.
- Directional or ordering options produce the expected relative node ordering.
- The Cytoscape `transform` option is applied to final node positions.
- Option callbacks, such as per-node or per-edge callbacks, are called the
  expected number of times.
- Parent/compound graph cases keep children positioned relative to parents.
- Edge cases with disconnected components complete without throwing.

Keep these tests deterministic. Prefer simple algorithms or deterministic
algorithm options where possible. Avoid overly precise coordinate assertions
unless the wrapped algorithm is guaranteed to return stable exact values across
versions.

## Continuous Integration

Add a GitHub Actions workflow for the Mocha test suite, e.g.
`.github/workflows/mocha.yml`.  The workflow should run on pull requests and
pushes, install dependencies with `npm ci`, and run `npm test` so CI covers the
build step and the Mocha tests in the same way as local verification.

## Demo Updates

If the demo previously loaded the algorithm package separately, remove that
extra script tag or import. The demo should load the extension's direct browser
artifact filename, e.g. `<extension>.js`, plus Cytoscape itself. The direct
browser artifact may be a symlink to the readable UMD build under `dist/`, but
demo HTML should not reference `dist/` directly.

This catches accidental regressions where the extension build silently depends on
a global algorithm object.

## Verification

Run:

```sh
npm test
npm run lint
npm pack --dry-run
```

The package dry run should include:

- all distribution files
- source maps
- TypeScript declarations
- source files
- tests, if the package intentionally publishes them

If the local npm cache has permission problems, use a temporary writable cache:

```sh
npm --cache /tmp/<package>-npm-cache pack --dry-run
```
