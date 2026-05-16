# CHANGELOG - sitespeed.io/plugin  (we use [semantic versioning](https://semver.org))

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