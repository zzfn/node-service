import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { User } from '../entity/User';
import { CacheManager } from '@midwayjs/cache';

@Provide()
export class AuthService {
  @InjectEntityModel(User)
  userModel;
  @Inject()
  cacheManager: CacheManager;

  async getRoleByUserId(id: string) {
    const result = await this.cacheManager.get(`roleAuth::${id}`);
    if (result) {
      return result;
    }
    const user = await this.userModel.findOneOrFail({
      where: {
        id: id,
      },
      relations: {
        role: {
          resource: true,
        },
      },
    });
    const roleAuth = user.role
      .map(item => item.resource)
      .flat()
      .filter(item => item.type === 'api')
      .map(item => item.code);
    await this.cacheManager.set(`roleAuth::${id}`, roleAuth);
    return roleAuth;
  }
}
