import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const dynamoDb = new DynamoDBClient({ region: "ap-south-1" });
const ses = new SESClient({ region: "ap-south-1" });

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
    
    // Send email notification
    const emailParams = {
      Source: "lakshmikant.lpu@gmail.com", // Must be a verified SES email
      Destination: {
        ToAddresses: ["test@gmail.com"], // Change to recipient's email
      },
      Message: {
        Subject: { Data: "New Event Created" },
        Body: {
          Text: { Data: `An event has been created: ${body.eventName} on ${body.eventDate} at ${body.eventLocation}` },
        },
      },
    };

    await ses.send(new SendEmailCommand(emailParams));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Event created and email sent!" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};