import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
} from '@midwayjs/decorator';
import { CommentService } from '../service/Comment.service';
import { Comment } from '../entity/Comment';

@Controller('/comment')
export class CommentController {
  @Inject()
  commentService: CommentService;

  @Post('/save')
  async save(@Body() comment: Comment): Promise<string> {
    return this.commentService.commentSave(comment);
  }

  @Get('/list')
  async list(@Query('id') id: string): Promise<any> {
    return this.commentService.list(id);
  }
}
