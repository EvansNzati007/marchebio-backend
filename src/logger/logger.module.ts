import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

export const LOGGER_CONFIG = 'LOGGER';
@Global()
@Module({
  providers: [
    LoggerService,
    {
      provide: LOGGER_CONFIG,
      useExisting: LoggerService,
    },
  ],
  exports: [LOGGER_CONFIG],
})
export class LoggerModule {}
