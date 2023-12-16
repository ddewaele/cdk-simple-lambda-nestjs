import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { dynamoDBClient } from '../aws-config/dynamoDBClient';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomersService {
  

  constructor(private configService: ConfigService) {}


  private tableName = this.configService.get<string>('TABLE_NAME')

  async create(createCustomerDto: CreateCustomerDto) {
    
    const params = {
      TableName: this.tableName,
      Item: createCustomerDto,
    };

    try {
      await dynamoDBClient().send(new PutCommand(params));
      return { message: 'Customer created successfully' };
    } catch (error) {
      console.log("Error occured ", error)
    }
  }

  async findAll() {
    const params = {
      TableName: this.tableName,
    };

    try {
      const data = await dynamoDBClient().send(new ScanCommand(params));
      return data.Items;
    } catch (error) {
      console.log("Error occured ", error)
    }
  }

  async findOne(id: number) {

    console.log("Found config ",this.configService.get<string>('TABLE_NAME'))
    const params = {
      TableName: this.tableName,
      Key: { id: id.toString() }, // DynamoDB expects the key as a string
    };

    try {
      const data = await dynamoDBClient().send(new GetCommand(params));
      if (data.Item) {
        return data.Item;
      } else {
        return { message: 'Customer not found' };
      }
    } catch (error) {
      console.log("Error occured ", error)
    }
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const params = {
      TableName: this.tableName,
      Item: updateCustomerDto,
    };

    try {
      await dynamoDBClient().send(new PutCommand(params));
      return { message: 'Customer created successfully' };
    } catch (error) {
      console.log("Error occured ", error)
    }
  }

  async remove(id: number) {
    const params = {
      TableName: this.tableName,
      Key: { id: id.toString() },
    };

    try {
      await dynamoDBClient().send(new DeleteCommand(params));
      return { message: 'Customer removed successfully' };
    } catch (error) {
      console.log("Error occured ", error)
    }
  }
}
