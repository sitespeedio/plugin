# @sitespeed.io/plugin

Base class for [sitespeed.io](https://www.sitespeed.io/) plugins. Extend it,
implement `processMessage`, and sitespeed.io will instantiate and drive your
plugin through the message queue.

See the [plugin documentation](https://www.sitespeed.io/documentation/sitespeed.io/plugins/#how-to-create-your-own-plugin)
for the full plugin lifecycle.

## Install

```bash
npm install @sitespeed.io/plugin
```

## Usage

sitespeed.io instantiates your plugin with the **positional** arguments
`new MyPlugin(options, context, queue)`. Your constructor must accept them in
that order and forward them to `super` as a config object. The other lifecycle
methods are called with their own positional arguments (shown below).

```js
import { SitespeedioPlugin } from '@sitespeed.io/plugin';

export default class MyPlugin extends SitespeedioPlugin {
  // Optional: limit how many messages this plugin processes in parallel.
  // concurrency = 1;

  constructor(options, context, queue) {
    super({ name: 'myplugin', options, context, queue });
  }

  // Called once on startup. (context, options) are the same as the constructor's.
  async open(context, options) {
    // optional: setup on startup
  }

  // Called for every message on the queue. `queue` is the same as `this.queue`.
  async processMessage(message, queue) {
    if (message.type === 'url') {
      this.log.info('Got a URL: %s', message.url);
      await this.sendMessage('myplugin.data', { hello: 'world' });
    }
  }

  // Called once on shutdown.
  async close(options, errors) {
    // optional: cleanup on shutdown
  }
}
```

## Lifecycle messages

While a run is in flight, sitespeed.io posts a few framework-level messages on
the queue. Handle them in `processMessage` to hook into the run:

| `message.type`                | When                                                 |
| ----------------------------- | ---------------------------------------------------- |
| `sitespeedio.setup`           | Plugins announce themselves / register filters       |
| `sitespeedio.summarize`       | All analysis is done — time to summarize             |
| `sitespeedio.prepareToRender` | About to render output                               |
| `sitespeedio.render`          | Write final output to storage                        |

Other plugins emit their own message types (for example `browsertime.pageSummary`,
`browsertime.har`, `pagexray.run`, …). See the
[plugin documentation](https://www.sitespeed.io/documentation/sitespeed.io/plugins/#how-to-create-your-own-plugin)
for the full list.

## API

- `this.name` / `getName()` — plugin name
- `this.options` / `getOptions()` — sitespeed.io start options
- `this.context` / `getContext()` — sitespeed.io context
- `this.queue` — the message queue
- `this.log` / `getLog()` — logger (call levels directly: `this.log.info(...)`)
- `getStorageManager()` — storage manager for writing files
- `getFilterRegistry()` — filter registry for TimeSeries metrics
- `sendMessage(type, data, extras)` — post a message on the queue
- `concurrency` — optional class field; limits parallel `processMessage` calls
- `open(context, options)` / `close(options, errors)` — lifecycle hooks (override as needed)
- `processMessage(message, queue)` — **must be implemented** by your subclass

## License

MIT
