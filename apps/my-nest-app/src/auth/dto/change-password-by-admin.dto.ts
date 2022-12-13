import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  
  export class ChangePasswordByAdminDto {
    // @ApiProperty()
    // @IsEmail()
    // @IsNotEmpty()
    // email: string;

    @ApiProperty()
    @IsNotEmpty()
    username: string;
  
  }
  