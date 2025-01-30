import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sqs = new SQSClient({ region: "us-east-1" });
const ses = new SESClient({ region: "us-east-1" });

const SQS_QUEUE_URL = "https://sqs.ap-south-1.amazonaws.com/123456789012/EventNotificationQueue"; // Replace with your queue URL

export const handler = async () => {
  try {
    const receiveParams = {
      QueueUrl: SQS_QUEUE_URL,
      MaxNumberOfMessages: 5, // Process up to 5 messages at a time
      WaitTimeSeconds: 5,
    };

    const response = await sqs.send(new ReceiveMessageCommand(receiveParams));

    if (!response.Messages) {
      console.log("No messages in queue");
      return;
    }

    for (const message of response.Messages) {
      const eventDetails = JSON.parse(message.Body);

      // Send email using SES
      const emailParams = {
        Source: "your-email@example.com",
        Destination: { ToAddresses: ["recipient@example.com"] },
        Message: {
          Subject: { Data: "New Event Created: " + eventDetails.eventName },
          Body: {
            Text: { Data: `Event Details:\n\nName: ${eventDetails.eventName}\nDate: ${eventDetails.eventDate}\nLocation: ${eventDetails.eventLocation}\nDescription: ${eventDetails.eventDescription}` },
          },
        },
      };

      await ses.send(new SendEmailCommand(emailParams));

      // Delete the message after processing
      const deleteParams = {
        QueueUrl: SQS_QUEUE_URL,
        ReceiptHandle: message.ReceiptHandle,
      };

      await sqs.send(new DeleteMessageCommand(deleteParams));
    }
  } catch (error) {
    console.error("Error processing SQS messages:", error);
  }
};
