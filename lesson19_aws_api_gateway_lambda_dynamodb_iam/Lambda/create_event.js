import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

// Initialize DynamoDB client
const dynamoDb = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  const tableName = "Events";

  try {
    // Parse and validate input
    const { eventId, eventName, eventDate, eventLocation, eventDescription } = JSON.parse(event.body || "{}");

    if (!eventId || !eventName || !eventDate || !eventLocation || !eventDescription) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields." }),
      };
    }

    // Prepare the DynamoDB item
    const item = {
      eventId: { S: eventId },
      eventName: { S: eventName },
      eventDate: { S: eventDate },
      eventLocation: { S: eventLocation },
      eventDescription: { S: eventDescription },
    };

    // Create the PutItemCommand
    const command = new PutItemCommand({
      TableName: tableName,
      Item: item,
    });

    // Execute the command
    await dynamoDb.send(command);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Event created successfully!",
        event: {
          eventId,
          eventName,
          eventDate,
          eventLocation,
          eventDescription,
        },
      }),
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to create event.", error: error.message }),
    };
  }
};

