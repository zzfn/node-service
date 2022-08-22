import { ApiProperty } from "@midwayjs/swagger";

export class LoginVo {
  @ApiProperty({ example: 'test', description: 'The name of the Catname'})
  username: string;

  @ApiProperty({ example: 'test', description: 'The name of the Catage'})
  password: string;
}
