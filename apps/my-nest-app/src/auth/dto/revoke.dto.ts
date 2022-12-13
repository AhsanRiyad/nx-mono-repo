import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class RevokeDto {
 
  @ApiProperty()
  @IsNotEmpty()
  username: string;

}
