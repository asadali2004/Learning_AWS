import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const sqs = new SQSClient({ region: 'ap-south-1' });

export const handler = async (event) => {
  const queueUrl = 'https://sqs.ap-south-1.amazonaws.com/474668420577/SuccessQueue'; // Update with your actual queue URL
  
  // Create the message body
  const messageBody = JSON.stringify({
    msg: 'Hello',  
  });

  try {
    // Prepare the parameters for sending the message
    const params = {
      QueueUrl: queueUrl,
      MessageBody: messageBody,
    };

    // Send the message to SQS
    const command = new SendMessageCommand(params);
    const result = await sqs.send(command);
    console.log('Message sent to SQS:', result);

    // Return a successful response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message sent to SQS', result }),
    };

  } catch (error) {
    console.error('Error sending message to SQS:', error);

    // Return a failure response
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send message to SQS', error: error.message }),
    };
  }
};