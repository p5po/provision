import { Resend } from 'resend';

const resend = new Resend('re_3Pd8MyuD_MVzryqVjXqZuCnc7qunvw2H7');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { senderName, senderEmail, toEmail, subject, message } = req.body;

    if (!senderEmail || !toEmail || !message) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    const data = await resend.emails.send({
      from: `${senderName || 'Job Applicant'} <onboarding@resend.dev>`,
      reply_to: senderEmail,
      to: [toEmail],
      subject: subject || 'New Application',
      html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Send error:', error);
    return res.status(500).json({ error: error.message });
  }
}
