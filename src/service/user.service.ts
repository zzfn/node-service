import { Inject, Provide } from '@midwayjs/decorator';
import { IUserOptions } from '../interface';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { User } from '../entity/User';
import { JwtService } from '@midwayjs/jwt';
import * as bcrypt from 'bcrypt';
import { CustomError } from '../error/CustomError';
import {snowflakeIdv1} from "../util/Snowflake";

@Provide()
export class UserService {
  @Inject()
  JwtService: JwtService;

  @InjectEntityModel(User)
  userModel;

  async register(user: { username: string; password: string }) {
    let gen1 = new snowflakeIdv1({ workerId: 1,seqBitLength:19})
    let id1 = gen1.NextId()

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    return await this.userModel.save({
      id: id1.toString(),
      username: user.username,
      password: hash,
    });
  }

  async login({ username, password }: { username: string; password: string }) {
    const user = await this.userModel.findOne({
      where: { username: username },
    });
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
    user.avatar = 'photo-with-bears.jpg';
    user.nickname = '22';
    // const photoResult = await this.userModel.save(user);
    // console.log('photo id = ', photoResult.id);
    return {
      uid: options.uid,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
  }

  async getUser(options: IUserOptions) {
    const photoResult = await this.userModel.find({});
    return photoResult;
  }
}
