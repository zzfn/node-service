import { Aspect, IMethodAspect, JoinPoint } from '@midwayjs/decorator';
import { HomeController } from '../controller/home.controller';

@Aspect(HomeController)
export class ReportInfo implements IMethodAspect {
  async before(point: JoinPoint) {
    console.log('before home router run');
  }
}
