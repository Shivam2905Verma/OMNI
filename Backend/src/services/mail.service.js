const { google } = require('googleapis');

/**
 * Configure OAuth2 client
 * These values should be in your Render Environment Variables
 */
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'https://developers.google.com/oauthplayground' // Ensure this matches your Google Cloud Console redirect URI
);

oAuth2Client.setCredentials({ 
  refresh_token: process.env.REFRESH_TOKEN 
});

const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

const sendEmail = async (to, subject, html) => {
  try {
    // 1. Create the MIME message
    // Note: Gmail API expects a specific string format before encoding
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `From: OMNI <${process.env.EMAIL_USER}>`,
      `To: ${to}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      html,
    ];
    const message = messageParts.join('\n');

    // 2. Base64URL encode the message
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // 3. Send using Gmail API
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log("Sending OTP to:", to);
    console.log("Verification Email sent. ID:", result.data.id);
    return result.data;
    
  } catch (error) {
    // If the error is 'invalid_grant', your refresh token might be expired or revoked
    console.error("Error sending Verification email:", error.response ? error.response.data : error);
    throw error;
  }
};

module.exports = { sendEmail };