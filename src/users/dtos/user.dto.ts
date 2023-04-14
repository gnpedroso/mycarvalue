import { IsString, IsNumber } from "class-validator";
import { Expose, Exclude } from "class-transformer";

export class UserDto {
    @Expose()
    @IsNumber()
    id: number;
    
    @Expose()
    @IsString()
    email: string;
}