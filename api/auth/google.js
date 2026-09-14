export default async function handler(req, res) {
  try {
    let google;
    try {
      const gModule = await import('googleapis');
      google = gModule.google;
    } catch (importErr) {
      return res.status(500).json({
        error: 'googleapis package is not installed',
        details: importErr.message
      });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return res.status(500).json({
        error: 'Environment variables missing',
        check: {
          has_id: !!clientId,
          has_secret: !!clientSecret,
          has_redirect: !!redirectUri
        }
      });
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    const scopes = [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/userinfo.email'
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes
    });

    return res.redirect(302, url);
  } catch (err) {
    return res.status(500).json({
      error: 'Runtime exception',
      message: err.message
    });
  }
}
