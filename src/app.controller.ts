import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { AppService } from './app.service';
import { lastValueFrom } from 'rxjs';
import * as amqp from 'amqplib';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('notificacion')
  async enviarNotificacion(@Body() data: any) {
    const amqpUrl = 'amqps://tbvqnboe:2We4NDH_v8JhKtmj8edqWm7KDfqTFbcu@fuji.lmq.cloudamqp.com/tbvqnboe';
    const queue = 'notificaciones';
    try {
      const conn = await amqp.connect(amqpUrl);
      const channel = await conn.createChannel();
      await channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
      await channel.close();
      await conn.close();
      return { mensaje: 'Notificación enviada a RabbitMQ' };
    } catch (error: any) {
      console.error('Error al enviar a RabbitMQ:', error.message);
      throw new HttpException(
        error.message || 'Error enviando notificación',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
