import { Controller, Get, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('HERO_SERVICE')
    private readonly kafka: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafka.subscribeToResponseOf(`say.hello`);
    await this.kafka.connect();
  }

  omModuleDestroy() {
    this.kafka.close();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  getTest() {
    console.log('say.hello');
    try {
      const result = this.kafka.send('say.hello', 'Working app service').subscribe();
      return 'success';
    } catch (error) {
      return error;
    }
  }
}
