import { test } from 'node:test';
import assert from 'node:assert/strict';

import { SitespeedioPlugin } from '../plugin.js';

function makeContext() {
  return {
    messageMaker(name) {
      return {
        make(type, data, extras) {
          return { type, data, extras, source: name };
        }
      };
    },
    getLogger(channel) {
      return { channel, info() {}, warn() {}, error() {} };
    },
    filterRegistry: { id: 'registry' },
    storageManager: { id: 'storage' }
  };
}

function makeQueue() {
  const posted = [];
  return {
    posted,
    postMessage(message) {
      posted.push(message);
      return message;
    }
  };
}

class TestPlugin extends SitespeedioPlugin {
  async processMessage() {}
}

class NoProcessPlugin extends SitespeedioPlugin {}

test('abstract base class cannot be instantiated directly', () => {
  assert.throws(
    () =>
      new SitespeedioPlugin({
        name: 'x',
        context: makeContext(),
        queue: makeQueue()
      }),
    /Abstract plugin can't be instantiated/
  );
});

test('rejects plugin names containing a dot', () => {
  assert.throws(
    () =>
      new TestPlugin({
        name: 'bad.name',
        context: makeContext(),
        queue: makeQueue()
      }),
    /can't contain dots/
  );
});

test('rejects config missing required fields', () => {
  assert.throws(() => new TestPlugin(), /requires a config object/);
  assert.throws(
    () => new TestPlugin({ context: makeContext() }),
    /requires a config object/
  );
  assert.throws(
    () => new TestPlugin({ name: 'p' }),
    /requires a config object/
  );
});

test('accepts config without a queue (queue is optional at construction)', () => {
  const plugin = new TestPlugin({ name: 'noqueue', context: makeContext() });
  assert.equal(plugin.getName(), 'noqueue');
  assert.equal(plugin.queue, undefined);
});

test('getters return the values passed in via config', () => {
  const context = makeContext();
  const queue = makeQueue();
  const options = { some: 'option' };
  const plugin = new TestPlugin({ name: 'myplugin', options, context, queue });

  assert.equal(plugin.getName(), 'myplugin');
  assert.equal(plugin.getOptions(), options);
  assert.equal(plugin.getContext(), context);
  assert.equal(plugin.getStorageManager(), context.storageManager);
  assert.equal(plugin.getFilterRegistry(), context.filterRegistry);
  assert.equal(plugin.getLog().channel, 'sitespeed.io.plugin.myplugin');
});

test('sendMessage posts a made message to the queue', async () => {
  const context = makeContext();
  const queue = makeQueue();
  const plugin = new TestPlugin({ name: 'myplugin', context, queue });

  await plugin.sendMessage('myplugin.data', { hello: 'world' }, { extra: 1 });

  assert.equal(queue.posted.length, 1);
  assert.deepEqual(queue.posted[0], {
    type: 'myplugin.data',
    data: { hello: 'world' },
    extras: { extra: 1 },
    source: 'myplugin'
  });
});

test('default processMessage throws when not overridden', async () => {
  const plugin = new NoProcessPlugin({
    name: 'noproc',
    context: makeContext(),
    queue: makeQueue()
  });
  await assert.rejects(
    () => plugin.processMessage({ type: 'anything' }),
    /must be implemented/
  );
});

test('default open and close resolve without error', async () => {
  const plugin = new TestPlugin({
    name: 'myplugin',
    context: makeContext(),
    queue: makeQueue()
  });
  await plugin.open();
  await plugin.close();
});
