import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @ApiProperty({ example: 'john_doe' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @ApiProperty({ example: 'John' })
  firstName: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @IsString()
  @Length(8, 128)
  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({ example: 'password123' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password too weak. It must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;
}
