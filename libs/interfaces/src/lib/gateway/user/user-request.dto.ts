import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  roles: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
