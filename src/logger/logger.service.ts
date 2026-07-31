import { Injectable, Logger } from '@nestjs/common';
import { ILogger } from './logger.interface';

@Injectable()
export class LoggerService implements ILogger {
  private logger = new Logger(LoggerService.name);

  log(message: string) {
    this.logger.log(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }
}
