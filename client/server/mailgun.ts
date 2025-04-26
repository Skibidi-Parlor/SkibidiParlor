import axios from 'axios';
import dotenv from "dotenv";


async function sendEmail(to: string, subject: string, text: string, token: number) {

  const apiKey = process.env.MAILGUN_API_KEY || '';

  const domain = process.env.MAILGUN_DOMAIN || '';
  console.log(apiKey);
  console.log(domain);
  const mailgunUrl = `https://api.mailgun.net/v3/${domain}/messages`;

  const auth = {
    username: 'api', // Always 'api'
    password: apiKey,
  };

  const html = `
  <body style="font-family: Arial, sans-serif; color: #01426A; background-color: #f4f4f4; padding: 20px; margin: 0;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); text-align: center;">
          
          <h2 style="color: #00843D;">Reset Your Password</h2>

          <p style="font-size: 16px; line-height: 1.6;">
              Here is your reset token: ${token}
          </p>

          <p style="font-size: 14px; color: #777; margin-top: 10px;">
              Token will expire in 5 minutes
          </p>
      </div>
  </body>
`

  const data = new URLSearchParams();
  data.append('from', 'BroncoHacks2025 <postmaster@send.broncohacksportal.org>');
  data.append('to', to);
  data.append('subject', subject);
  data.append('text', text);
  data.append('html', html);

  try {
    const response = await axios.post(mailgunUrl, data, {
      auth: auth,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    console.log('Email sent:', response.data);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export default sendEmail;
// sendEmail("nguy3nju5t1n@gmail.com", "Skibidi Mailgun Test3", "Your Reset Token", 69420);


