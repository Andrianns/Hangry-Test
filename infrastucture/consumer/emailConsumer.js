const RabbitMQ = require('../../infrastucture/message/rabbitmq');

const nodemailer = require('nodemailer');

async function sendEmail(to, subject, htmlContent) {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail.javascript.info',
    port: process.env.SMTP_PORT || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER || 'test@openjavascript.info',
      pass: process.env.SMTP_PASS || 'NodeMailer123!',
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'CRM <test@openjavascript.info>',
    to,
    subject,
    html: htmlContent,
  };

  // Send email
  await transporter.sendMail(mailOptions);
}

async function startEmailConsumer() {
  await RabbitMQ.consume('email_queue', async (message) => {
    console.log('[EmailConsumer] Processing email for:', message.email);

    try {
      // Example HTML content
      const htmlContent = `
        <h1>Hello, ${message.name}!</h1>
        <p>We noticed you haven't been active in 90 days.</p>
        <p>Come back to explore more!</p>
        
      `;

      // Send the email
      await sendEmail(message.email, 'We Miss You!', htmlContent);

      console.log(
        `[EmailConsumer] Email sent to ${message.email} (${message.name})`
      );
    } catch (err) {
      console.error(
        `[EmailConsumer] Failed to send email to ${message.email}:`,
        err.message
      );
    }
  });
}

module.exports = { start: startEmailConsumer };
