import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const dynamoDb = new DynamoDBClient({ region: "ap-south-1" });
const sqs = new SQSClient({ region: "ap-south-1" });

const SQS_QUEUE_URL = "https://sqs.ap-sputh-1.amazonaws.com/123456789012/EventNotificationQueue"; // Replace with your queue URL

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    
    // Store event in DynamoDB
    const putCommand = new PutItemCommand({
      TableName: "Events",
      Item: {
        eventId: { S: body.eventId },
        eventName: { S: body.eventName },
        eventDate: { S: body.eventDate },
        eventLocation: { S: body.eventLocation },
        eventDescription: { S: body.eventDescription },
      },
    });

    await dynamoDb.send(putCommand);

    // Send event details to SQS
    const sqsCommand = new SendMessageCommand({
      QueueUrl: SQS_QUEUE_URL,
      MessageBody: JSON.stringify({
        eventId: body.eventId,
        eventName: body.eventName,
        eventDate: body.eventDate,
        eventLocation: body.eventLocation,
        eventDescription: body.eventDescription,
      }),
    });

    await sqs.send(sqsCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Event created and sent to SQS!" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};