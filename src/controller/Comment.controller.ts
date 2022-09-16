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
import { AnonymousMiddleware } from '../middleware/anonymous.middleware';
import { ReplyService } from '../service/Reply.service';
import { Reply } from '../entity/Reply';

@Controller('/comment')
export class CommentController {
  @Inject()
  commentService: CommentService;
  @Inject()
  replyService: ReplyService;

  @Post('/save',{ middleware: [AnonymousMiddleware] })
  async save(@Body() comment: Comment): Promise<string> {
    return this.commentService.commentSave(comment);
  }

  @Post('/reply',{ middleware: [AnonymousMiddleware] })
  async reply(@Body() reply: Reply): Promise<string> {
    return this.replyService.replySave(reply);
  }

  @Get('/list', { middleware: [AnonymousMiddleware] })
  async list(@Query('id') id: string): Promise<any> {
    return this.commentService.list(id);
  }
}
