import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({ region: 'ap-south-1' });  // Adjust region accordingly

const SENDER = 'lakshmikant.lpu@gmail.com';  // Replace with your verified SES email

export const handler = async (event) => {
  const recipientEmail = event.recipient_email;  // Pass recipient_email is passed in the event
  const SUBJECT = 'Welcome to the Event!';
  const BODY_TEXT = 'Welcome to the event!\n\nWe are excited to have you join us. Stay tuned for more details.';
  const BODY_HTML = `
    <html>
      <head></head>
      <body>
        <h1>Welcome to the Event!</h1>
        <p>We are excited to have you join us.</p>
        <p>Stay tuned for more details.</p>
      </body>
    </html>
  `;

  const params = {
    Source: SENDER,
    Destination: {
      ToAddresses: [recipientEmail],
    },
    Message: {
      Subject: {
        Data: SUBJECT,
      },
      Body: {
        Text: {
          Data: BODY_TEXT,
        },
        Html: {
          Data: BODY_HTML,
        },
      },
    },
  };

  try {
    // Send the email via SES
    const sendEmailCommand = new SendEmailCommand(params);
    const response = await sesClient.send(sendEmailCommand);
    console.log(`Email sent! Message ID: ${response.MessageId}`);

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Email sent successfully to ${recipientEmail}`,
        messageId: response.MessageId,
      }),
    };
  } catch (error) {
    console.error('Error sending email:', error);

    // Return error response
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};