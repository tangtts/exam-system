import { Controller, Get, Inject } from '@nestjs/common';
import { ExamService } from './exam.service';
import { MessagePattern } from '@nestjs/microservices';
import { RedisService } from '@app/redis';

@Controller()
export class ExamController {
  @Inject(RedisService)
  redisService: RedisService;
  constructor(private readonly examService: ExamService) { }

  @MessagePattern('sum')
  sum(numArr: Array<number>): number {
    return numArr.reduce((total, item) => total + item, 0);
  }

  @Get()
  async getHello() {
    const keys = await this.redisService.keys('*');
    return this.examService.getHello() + keys;
  }
}
