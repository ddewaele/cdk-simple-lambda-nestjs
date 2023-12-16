import { IsOptional, IsString, IsNumber, IsNotEmpty, isEmail, IsEmail, ValidateIf, IsEnum } from 'class-validator';

export enum CustomerType {
    SIMPLE = 'SIMPLE',
    SPECIAL = 'SPECIAL',
}

export class CreateCustomerDto {

    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    notes: string;

    @IsEnum(CustomerType)
    @IsNotEmpty()
    customerType: CustomerType;

    @IsString()
    @ValidateIf(o => o.customerType === CustomerType.SPECIAL)
    @IsNotEmpty()
    specialCode: string;

}
