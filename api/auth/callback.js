const { google } = require('googleapis');

module.exports = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    res.writeHead(302, { Location: '/index.html?error=access_denied' });
    return res.end();
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const userEmail = userInfo.data.email;

    res.writeHead(302, { Location: `/app.html?email=${encodeURIComponent(userEmail)}` });
    return res.end();
  } catch (err) {
    console.error('Callback error:', err);
    res.writeHead(302, { Location: '/index.html?error=auth_failed' });
    return res.end();
  }
};
