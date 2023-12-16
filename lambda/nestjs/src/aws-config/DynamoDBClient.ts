import { DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const dynamoDBClient = (): DynamoDBDocumentClient => {
    const client = new DynamoDBClient({});
    return DynamoDBDocumentClient.from(client);
};