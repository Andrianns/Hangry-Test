function generateEmailTemplate(message) {
  let htmlContent;

  if (message.type === 'email') {
    // HTML for dormant users
    htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 8px; max-width: 600px; margin: 0 auto; padding: 20px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #0056b3; text-align: center;">Hello, ${message.name}!</h1>
            <p style="font-size: 16px; text-align: center;">We noticed you haven't been active on our platform for the last 90 days.</p>
            <p style="font-size: 16px; text-align: center;">We’d love to see you back! Check out the latest features and updates we've made just for you.</p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://your-platform.com" style="text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px; font-size: 16px;">Return Now</a>
            </div>
            <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">Thank you for being part of our community!</p>
          </div>
        </div>
      `;
  } else if (message.type === 'birthday_email') {
    // HTML for birthday users
    htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 8px; max-width: 600px; margin: 0 auto; padding: 20px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #ff5722; text-align: center;">Happy Birthday, ${message.name}!</h1>
            <p style="font-size: 16px; text-align: center;">We hope you have a day filled with laughter, love, and amazing memories.</p>
            <p style="font-size: 16px; text-align: center;">Thank you for being a valued member of our community. Here's to another year of greatness!</p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://your-platform.com" style="text-decoration: none; color: white; background-color: #ff5722; padding: 10px 20px; border-radius: 5px; font-size: 16px;">Celebrate With Us</a>
            </div>
            <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">Best wishes, Your Team</p>
          </div>
        </div>
      `;
  }

  return htmlContent;
}

module.exports = { generateEmailTemplate };
