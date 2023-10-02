import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import * as SlackHook from 'winston-slack-webhook-transport';

@Module({
  imports: [
    ConfigModule,
    WinstonModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const transports: winston.transport[] = [
          new winston.transports.Console({
            level: 'debug',
          }),
          new SlackHook({
            webhookUrl: configService.get('slack.webhook_url'),
            formatter: (info) => {
              return {
                blocks: [
                  {
                    type: 'section',
                    text: {
                      type: 'mrkdwn',
                      text: `message: ${info.message}`,
                    },
                  },
                  {
                    type: 'section',
                    text: {
                      type: 'mrkdwn',
                      text: `context: ${info.context}`,
                    },
                  },
                  {
                    type: 'section',
                    text: {
                      type: 'mrkdwn',
                      text: `stack: ${info?.stack}`,
                    },
                  },
                  {
                    type: 'divider',
                  },
                ],
              };
            },
            level: 'error',
            emitAxiosErrors: false,
            // silent: process.env.NODE_ENV === 'development',
          }),
        ];
        return {
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('WoobuntuFinance', {
              colors: true,
              prettyPrint: true,
            }),
          ),
          transports,
          exitOnError: false,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class LogModule {}
