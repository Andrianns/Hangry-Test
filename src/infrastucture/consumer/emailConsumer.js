const RabbitMQ = require('../message/rabbitmq');
const { generateEmailTemplate } = require('../../utils/email');
const nodemailer = require('nodemailer');

async function sendEmail(to, subject, htmlContent) {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
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
      const htmlContent = generateEmailTemplate(message);
      // Send the email
      await sendEmail(message.email, 'Special Message for You!', htmlContent);

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
