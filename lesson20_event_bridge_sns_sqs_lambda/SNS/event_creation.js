import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const dynamoDb = new DynamoDBClient({ region: "ap-south-1" });
const sqs = new SQSClient({ region: "ap-south-1" });
const sns = new SNSClient({ region: "ap-south-1" });

const SQS_QUEUE_URL = "https://sqs.ap-south-1.amazonaws.com/474668420577/MyQueue";
const SNS_TOPIC_ARN = "arn:aws:sns:ap-south-1:474668420577:MySNS";

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

    // Send event details to SQS for processing
    const sqsCommand = new SendMessageCommand({
      QueueUrl: SQS_QUEUE_URL,
      MessageBody: JSON.stringify(body),
    });

    await sqs.send(sqsCommand);

    // Publish event notification to SNS
    const snsCommand = new PublishCommand({
      TopicArn: SNS_TOPIC_ARN,
      Subject: "New Event Created: " + body.eventName,
      Message: `Event Details:
      - Name: ${body.eventName}
      - Date: ${body.eventDate}
      - Location: ${body.eventLocation}
      - Description: ${body.eventDescription}`,
    });

    await sns.send(snsCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Event created, pushed to SQS, and SNS notification sent!" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
