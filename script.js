async function sendEmail() {
  const payload = {
    senderName: document.getElementById('name').value,       // اسم المتقدم
    senderEmail: document.getElementById('email').value,     // إيميل المتقدم الشخصي
    toEmail: document.getElementById('to').value,            // إيميل الشركة المستلمة
    subject: document.getElementById('subject').value,       // عنوان الرسالة
    message: document.getElementById('message').value        // نص الرسالة
  };

  try {
    const response = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.success) {
      alert('تم إرسال البريد بنجاح!');
    } else {
      alert('خطأ أثناء الإرسال: ' + result.error);
    }
  } catch (err) {
    alert('تعذر الاتصال بالخادم');
  }
}
