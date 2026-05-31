# CHANGELOG - sitespeed.io/plugin  (we use [semantic versioning](https://semver.org))

## 1.0.3 - UNRELEASED
### Fixed
* Aligned the base class JSDoc and README with how sitespeed.io actually drives
  plugins. The class advertised `open()`, `close()` and
  `processMessage(message)` with no parameters, but the framework has long
  called them with positional arguments — `open(context, options)`,
  `close(options, errors)` and `processMessage(message, queue)`. The README
  likewise didn't mention the positional constructor contract
  `new MyPlugin(options, context, queue)`, the optional `concurrency` class
  field that the queue handler reads, or the framework-level lifecycle
  messages (`sitespeedio.setup` / `summarize` / `prepareToRender` / `render`).
  All are now documented; no runtime behaviour change.
* Added JSDoc typedefs (`Logger`, `MessageMaker`, `QueueMessage`,
  `SitespeedioContext`) so editors with JSDoc support can autocomplete
  `context.storageManager`, `message.runIndex` and the rest, instead of
  forcing plugin authors to read sitespeed.io's source to discover the shape.

### Tech
* New `compat-sitespeed-io` job: installs the current branch into a fresh
  `sitespeed.io@main` checkout and runs its lint + unit suite (with browser
  driver downloads skipped). Catches base-class signature breakage across the
  ~25 built-in plugins.
* New `smoke-sitespeed-io` job: invokes `bin/sitespeed.js` against
  `https://www.sitespeed.io/` with a real Chrome and verifies an HTML report
  is written, exercising the full plugin lifecycle including the
  `sitespeedio.render` message.

## 1.0.2 - 2026-05-16
### Fixed
* Relaxed the config validation introduced in 1.0.1 so that `queue` is no
  longer required at construction time. Existing plugins like `pagexray`
  call `super({ name, options, context })` without a `queue`, which broke
  in 1.0.1 with `SitespeedioPlugin requires a config object with name,
  context and queue`. The constructor now only requires `name` and
  `context`; `queue` is consumed later by `sendMessage()` and may be set
  by the framework after construction.

## 1.0.1 - 2025-05-16
### Fixed
* Removed an unreachable `log()` wrapper method on the base class. The
  constructor's `this.log` assignment had always shadowed it, so calling
  `plugin.log(...)` invoked the logger object directly. Behavior is
  unchanged; the dead method is gone.
* Validate the constructor's `config` argument up front and throw a clear
  error when `name`, `context` or `queue` is missing, instead of letting
  a confusing `Cannot read properties of undefined` escape later.
* Use `===` for the abstract-class guard.
* Fixed a malformed `@param {}` JSDoc tag on `sendMessage`.
* README with install, example and API reference.
* `engines` field (`node >= 20`).
* `test/plugin.test.js` covering the public surface (run with `npm test`,
  uses the built-in `node:test` runner — no test deps).
* GitHub Actions workflow that runs lint and tests on Node 20/22/24.
* Bumped dev tooling: `eslint` 8 → 10, `prettier` 2 → 3,
  `eslint-plugin-unicorn` 45 → 64, `eslint-config-prettier` 8 → 10,
  `eslint-plugin-prettier` 4 → 5.
* Migrated `.eslintrc.json` to flat config (`eslint.config.mjs`).

## 1.0.0 - 2025-01-06
### Breaking
* Replaced the use of intel, instead use sitespeed.io/log.