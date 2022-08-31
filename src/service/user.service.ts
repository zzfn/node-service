import { Inject, Provide } from '@midwayjs/decorator';
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
    const count = await this.userModel.countBy({ username: user.username });
    if (count) {
      throw new CustomError('账号已存在');
    }
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

  async list() {
    return {
      records: await this.userModel.find({}),
      total: await this.userModel.count(),
    };
  }

  async infoById(id: string) {
    const result = await this.userModel.findOne({
      where: { id },
      relations: { role: true },
    });
    if (result.role) {
      Reflect.set(
        result,
        'role',
        result.role.map(role => role.id)
      );
    }
    return result;
  }

  async update(user: User) {
    await this.userModel.save(user);
    const res = await this.userModel
      .createQueryBuilder()
      .relation(User, 'role')
      .of({ id: user.id })
      .loadMany();
    await Promise.all(
      res.map(item =>
        this.userModel
          .createQueryBuilder()
          .relation(User, 'role')
          .of(user.id)
          .remove(item.id)
      )
    );
    console.log(111, user, user.role);
    await Promise.all(
      user.role.map(item =>
        this.userModel
          .createQueryBuilder()
          .relation(User, 'role')
          .of(user.id)
          .add(item)
      )
    );
  }

  async getUserInfo() {
    const { uid } = this.ctx.state.user;
    return await this.userModel.findOneBy({ id: uid });
  }
}
