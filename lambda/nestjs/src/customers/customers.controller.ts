import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Res, HttpStatus } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Response } from 'express';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto, @Res() response: Response) {
    this.customersService.create(createCustomerDto);

    // Assuming newCustomer has an id or some identifier
    response
      .status(HttpStatus.CREATED)
      .header('Location', `/customers/${createCustomerDto.id}`)
      .send();

  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
