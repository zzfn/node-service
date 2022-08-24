import {Inject, Controller, Get} from '@midwayjs/decorator';
import {JwtService} from '@midwayjs/jwt';
import {Context} from '@midwayjs/koa';
import {MenuService} from "../service/Menu.service";
import {SnowflakeIdGenerate} from "../service/Snowflake";
import {Role} from "../entity/Role";
import {User} from "../entity/User";
import {InjectEntityModel} from "@midwayjs/typeorm";
import { Resource } from '../entity/Resource';

@Controller('/menu')
export class APIController {
  @Inject()
  JwtService: JwtService;

  @Inject()
  menuService: MenuService;

  @InjectEntityModel(User)
  userModel;
  @InjectEntityModel(Role)
  profileModel;
  @InjectEntityModel(Resource)
  resourceModel;
  @Inject()
  ctx: Context;
  @Inject()
  generateID: SnowflakeIdGenerate

  @Get('/list')
  async getUserState() {
    return this.userModel.find({
      select: {
      },
      relations: {
        role: {
          resource:true
        },
      },
    })
  }
}
