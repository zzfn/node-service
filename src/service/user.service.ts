import { Provide } from '@midwayjs/decorator';
import { IUserOptions } from '../interface';
import { Repository } from 'typeorm';
import { InjectEntityModel } from '@midwayjs/typeorm';
import {User} from "../entity/user";

@Provide()
export class UserService {

  @InjectEntityModel(User)
  userModel: Repository<User>;

  async saveUser(options: IUserOptions) {
    let user = new User();
    user.username = 'Me and Bears';
    user.password = 'I am near polar bears';
    user.avatar = 'photo-with-bears.jpg';
    user.nickname = '22';
    user.isPublished = true;
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
    debugger
    console.log(this.userModel,options)
    // const photoResult = await this.userModel.find({});
    return 'photoResult'
  }
}
