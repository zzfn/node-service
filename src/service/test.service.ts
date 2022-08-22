import { Provide } from '@midwayjs/decorator';
import { IUserOptions } from '../interface';
// import { Repository } from 'typeorm';
// import { InjectEntityModel } from '@midwayjs/typeorm';
import { User } from '../entity/User';

@Provide()
export class UserService {
  // @InjectEntityModel(User)
  // userModel: Repository<User>;
  userModel: 111;

  async saveUser(options: IUserOptions) {
    const user = new User();
    user.username = 'Me and Bears';
    user.password = 'I am near polar bears';
    user.avatar = 'photo-with-bears.jpg';
    user.nickName = '22';
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
    console.log(this.userModel, options);
    // const photoResult = await this.userModel.find({});
    return 'photoResult';
  }
}
