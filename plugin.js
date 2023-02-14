/**
 * Base class that you can extend when you build a sitespeed.io plugin.
 * Your class will be instantiated by sitespeed.io.
 *
 * https://www.sitespeed.io/documentation/sitespeed.io/plugins/#how-to-create-your-own-plugin
 */
export class Plugin {
  constructor(config) {
    if (this.constructor == Plugin) {
      throw new Error("Abstract plugin can't be instantiated.");
    }
    if (config.name.includes('.')) {
      throw new Error("sitespeed.io plugin names can't contain dots");
    }
    this.name = config.name;
    this.options = config.options;
    this.context = config.context;
    this.queue = config.queue;
    this.make = config.context.make;
    this.make = config.context.messageMaker(this.name).make;
  }

  /**
   * Get the name of the plugin
   * @returns name of the plugin
   */
  getName() {
    return this.name;
  }

  /**
   * Get the sitespeed.io start options
   * @returns sitespeed.io options
   */
  getOptions() {
    return this.options;
  }

  getContext() {
    return this.context;
  }

  /**
   * Get the queue used for sending messages.
   * @returns
   */
  getQueue() {
    return this.queue;
  }

  getStorageManager() {
    return this.context.storageManager;
  }

  /**
   * When sitespeed.io starts up, it calls every configured plugin using the
   * open function.
   */
  async open() {}

  /**
   * Sitespeed.io and plugins talk to each other using the messages in the
   * message queue.
   *
   * @param {*} message
   */
  // eslint-disable-next-line no-unused-vars
  async processMessage(message) {
    throw new Error("Method 'processMessage()' must be implemented.");
  }

  /**
   * When sitespeed.io closes down, it calls every configured plugins close methos.
   */
  async close() {}

  /**
   * Send a message on the queue.
   * @param {} type
   * @param {*} data
   * @param {*} extras
   */
  async sendMessage(type, data, extras) {
    return this.queue.postMessage(this.make(type, data, extras));
  }
}
