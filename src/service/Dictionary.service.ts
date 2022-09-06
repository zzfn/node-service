import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Dictionary } from '../entity/Dictionary';

@Provide()
export class DictionaryService {
  @InjectEntityModel(Dictionary)
  dictionaryModel;

  async list(id: string) {
    return await this.dictionaryModel.findOneBy({ id });
  }
}
