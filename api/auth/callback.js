import { google } from 'googleapis';

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.redirect(302, '/index.html?error=access_denied');
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

    // حفظ التوكن مؤقتاً في الكوكيز أو تمريره للواجهة
    // حالياً سنوجه المستخدم لصفحة app.html مع الإيميل
    return res.redirect(302, `/app.html?email=${encodeURIComponent(userEmail)}`);
  } catch (err) {
    console.error('Callback failure:', err);
    return res.status(500).json({
      error: 'Callback failed',
      message: err.message
    });
  }
}
