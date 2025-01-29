import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

// Initialize DynamoDB client
const dynamoDb = new DynamoDBClient({ region: "ap-south-1" });

export const handler = async () => {
  try {
    // Define the scan parameters
    const params = {
      TableName: "Events", // Replace with your DynamoDB table name
    };

    // Execute the scan command
    const command = new ScanCommand(params);
    const response = await dynamoDb.send(command);

    // Return the list of events
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
       },
      body: JSON.stringify({
        message: "Events retrieved successfully",
        events: response.Items,
      }),
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Failed to retrieve events", error }),
    };
  }
};