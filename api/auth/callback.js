import { google } from 'googleapis';

export default async function handler(req, res) {
  const { code } = req.query;

  // إذا المستخدم ألغى الدخول أو ما رجع كود
  if (!code) {
    return res.redirect('/index.html?error=access_denied');
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // استبدال الكود بـ Tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // معرفة إيميل المستخدم المسجل
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const userEmail = userInfo.data.email;

    // توجيهه مباشرة لصفحة التقديم مع تمرير الإيميل
    return res.redirect(`/app.html?email=${encodeURIComponent(userEmail)}`);
  } catch (error) {
    console.error('Callback error:', error);
    return res.redirect('/index.html?error=auth_failed');
  }
}