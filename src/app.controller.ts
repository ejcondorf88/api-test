import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AppService } from './app.service';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly httpService: HttpService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('notificacion')
  async enviarNotificacion(@Body() data: any) {
    try {
      await lastValueFrom(this.httpService.post('http://localhost:8001/notifiaciotn', data));
      return { mensaje: 'Notificación enviada' };
    } catch (error: any) {
      throw new HttpException(
        error.response?.data || 'Error enviando notificación',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
