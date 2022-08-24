import { Inject, Provide } from '@midwayjs/decorator';
import { IUserOptions } from '../interface';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { User } from '../entity/User';
import { JwtService } from '@midwayjs/jwt';
import * as bcrypt from 'bcrypt';
import { CustomError } from '../error/CustomError';
import { Context } from '@midwayjs/koa';
import { SnowflakeIdGenerate } from './Snowflake';

@Provide()
export class UserService {
  @Inject()
  JwtService: JwtService;

  @InjectEntityModel(User)
  userModel;

  @Inject()
  ctx: Context;

  @Inject()
  idGenerate: SnowflakeIdGenerate;

  async register(user: { username: string; password: string }) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    return await this.userModel.save({
      id: this.idGenerate.generate().toString(),
      username: user.username,
      password: hash,
    });
  }

  async login({ username, password }: { username: string; password: string }) {
    const user = await this.userModel.findOne({
      where: { username: username },
    });
    if (!user) {
      throw new CustomError(username);
    }
    if (await bcrypt.compare(password, user.password)) {
      return {
        token: await this.JwtService.sign({ uid: user.id, username }),
      };
    } else {
      throw new CustomError(username);
    }
  }

  async saveUser(options: IUserOptions) {
    const user = new User();
    user.username = 'Me and Bears';
    user.password = 'I am near polar bears';
    // user.avatar = 'photo-with-bears.jpg';
    // user.nickName = '22';
    // const photoResult = await this.userModel.save(user);
    // console.log('photo id = ', photoResult.id);
    return {
      uid: options.uid,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
  }

  async getUserInfo() {
    const { uid } = this.ctx.state.user;
    return await this.userModel.findOneBy({ id: uid });
  }

  async getUser(options: IUserOptions) {
    const photoResult = await this.userModel.find({});
    return photoResult;
  }
}
