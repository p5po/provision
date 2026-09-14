import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return res.status(500).json({
        error: 'Missing environment variables',
        details: {
          hasClientId: Boolean(clientId),
          hasSecret: Boolean(clientSecret),
          hasRedirectUri: Boolean(redirectUri)
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
      scope: scopes,
    });

    return res.redirect(302, url);
  } catch (err) {
    console.error('Auth handler failure:', err);
    return res.status(500).json({
      error: 'Auth generation crashed',
      message: err.message,
      stack: err.stack
    });
  }
}    res.writeHead(302, { Location: url });
    return res.end();
  } catch (err) {
    console.error('Google Auth Error:', err);
    return res.status(500).json({ error: err.message });
  }
};    return res.redirect(302, url);
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(500).json({ error: err.message });
  }
}
