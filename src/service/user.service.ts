import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { User } from '../entity/User';
import { JwtService } from '@midwayjs/jwt';
import * as bcrypt from 'bcrypt';
import { CustomError } from '../error/CustomError';
import { Context } from '@midwayjs/koa';
import { SnowflakeIdGenerate } from './Snowflake';
import { BaseService } from './BaseService';
import { Repository } from 'typeorm';

@Provide()
export class UserService extends BaseService<User> {
  @InjectEntityModel(User)
  model: Repository<User>;

  getModel(): Repository<User> {
    return this.model;
  }

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
      id: this.idGenerate.nextId().toString(),
      isAdmin: false,
      nickname: user.username,
      username: user.username,
      password: hash,
    });
  }

  async login({ username, password }: { username: string; password: string }) {
    const user = await this.userModel.findOne({
      where: { username: username },
    });
    if (!user) {
      throw new CustomError('账号或密码错误');
    }
    if (await bcrypt.compare(password, user.password)) {
      return {
        token: await this.JwtService.sign({
          uid: user.id,
          username,
          isAdmin: user.isAdmin,
        }),
      };
    } else {
      throw new CustomError('账号或密码错误');
    }
  }

  async infoById(id: string) {
    return await this.userModel.findOne({
      where: { id },
      relations: { role: true },
    });
  }

  async updateRole(userRole: {
    userId: string;
    roleId: string;
    isAdd: boolean;
  }) {
    if (userRole.isAdd) {
      return this.userModel
        .createQueryBuilder()
        .relation(User, 'role')
        .of(userRole.userId)
        .add(userRole.roleId);
    } else {
      return this.userModel
        .createQueryBuilder()
        .relation(User, 'role')
        .of(userRole.userId)
        .remove(userRole.roleId);
    }
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
  }

  async getUserInfo() {
    const { uid } = this.ctx.state.user;
    return await this.userModel.findOneBy({ id: uid });
  }
}
