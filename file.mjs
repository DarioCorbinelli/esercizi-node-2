import * as fs from "node:fs/promises"

class Logger {
  constructor(logStorage) {
    this.logStorage = logStorage;
  }

  async info(message) {
    await this.logStorage.write(`[INFO] ${message}\n`);
  }

  async error(message) {
    await this.logStorage.write(`[ERROR] ${message}\n`);
  }

  async replay() {
    console.log(await this.logStorage.read());
  }
}

class LogStorageFSAdapter {
  constructor(filepath) {
    this.filepath = filepath;
  }

  async write(mess) {
    await this.appendFile(mess)
  }

  async read(mess) {
    await this.readFile(mess)
  }

  async appendFile(message) {
    try {
      await fs.appendFile(this.filepath, `[INFO] ${message}\n`);
    } catch (error) {
      console.error(error);
    }
  }

  async readFile() {
    try {
      return await fs.readFile(this.filepath, { encoding: "utf-8" });
    } catch (error) {
      console.error(error);
    }
  }
}

const fsStorage = new LogStorageFSAdapter("output.log");

const logger = new Logger(fsStorage);

logger.info("Some information");

logger.error("A bit of an issue");

logger.error("A catastrophic error!");

logger.info("The best information");

logger.replay();