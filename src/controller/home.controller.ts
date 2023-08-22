import { Body, Controller, Get, Inject } from '@midwayjs/decorator';

// import { KafkaService } from '../service/KafkaService';

@Controller('/')
export class HomeController {
  @Inject()
  // kafkaService: KafkaService;
  @Get('/')
  async home(@Body() req: any): Promise<string> {
    // const result = await this.kafkaService.send({
    //   topic: 'topic-test0',
    //   messages: [
    //     {
    //       value: JSON.stringify({ messageValue: 'ssssss' }),
    //     },
    //   ],
    // });
    // return result;
    return '';
  }
}
