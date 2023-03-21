/**
 * Base class that you can extend when you build a sitespeed.io plugin.
 * Your class will be instantiated by sitespeed.io.
 *
 * https://www.sitespeed.io/documentation/sitespeed.io/plugins/#how-to-create-your-own-plugin
 */
export class SitespeedioPlugin {
  constructor(config) {
    if (this.constructor == SitespeedioPlugin) {
      throw new Error("Abstract plugin can't be instantiated.");
    }
    if (config.name.includes('.')) {
      throw new Error("sitespeed.io plugin names can't contain dots");
    }
    this.name = config.name;
    this.options = config.options;
    this.context = config.context;
    this.queue = config.queue;
    this.make = config.context.messageMaker(this.name).make;
    this.log = config.context.intel.getLogger(
      `sitespeed.io.plugin.${config.name}`
    );
  }

  /**
   * Log a message. Default log level is info.
   * @param {*} message
   * @param {*} level - trace|verbose|debug|info|warn|error|critical
   */
  log(message, level = 'info', ...args) {
    this.log[level](message, args);
  }

  /**
   * Get the log instance.
   */
  getLog() {
    return this.log;
  }

  /**
   * Get the filter registry so you can configure what metrics you want to send
   * to the TimeSeries database
   * @returns
   */
  getFilterRegistry() {
    return this.context.filterRegistry;
  }

  /**
   * Get the name of the plugin.
   * @returns
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

  /**
   * Gets the sitespeed.io context object.
   * @returns {Object} The sitespeed.io context object.
   */
  getContext() {
    return this.context;
  }

  /**
   * Gets the storage manager used to store data.
   * @returns {StorageManager} The storage manager used to store data.
   */
  getStorageManager() {
    return this.context.storageManager;
  }

  /**
   * Called when sitespeed.io starts up. Override this method to perform any setup tasks.
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
   * Called when sitespeed.io shuts down. Override this method to perform any cleanup tasks.
   */
  async close() {}

  /**
   * Sends a message on the message queue.
   * @param {} type
   * @param {*} data
   * @param {*} extras
   */
  async sendMessage(type, data, extras) {
    return this.queue.postMessage(this.make(type, data, extras));
  }
}
