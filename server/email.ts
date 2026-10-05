import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export function getEmailTransporter() {
  const user = (process.env.GOOGLE_USER || process.env.GOOGLEUSER || '').trim();
  const rawPass = process.env.GMAIL_APP_PASSWORD || '';
  const pass = rawPass.replace(/\s+/g, '');

  if (!user || !pass) {
    console.warn('⚠️ Google Mail credentials missing in .env (GOOGLE_USER / GMAIL_APP_PASSWORD)');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
}

export async function sendOtpEmail(toEmail: string, otp: string, name?: string): Promise<boolean> {
  const transporter = getEmailTransporter();
  if (!transporter) {
    throw new Error('Email service not configured. Check GOOGLE_USER and GMAIL_APP_PASSWORD in .env');
  }

  const fromEmail = (process.env.GOOGLE_USER || process.env.GOOGLEUSER || '').trim();
  const userName = name || 'Crypto Trader';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CryptoGuard Account Verification</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #020617; color: #F1F5F9; }
    .container { max-width: 560px; margin: 30px auto; background-color: #0A1628; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%); padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0; color: rgba(255,255,255,0.9); font-size: 14px; }
    .content { padding: 32px 28px; }
    .greeting { font-size: 16px; color: #F1F5F9; margin-bottom: 16px; }
    .instructions { font-size: 14px; color: #94A3B8; line-height: 1.6; margin-bottom: 24px; }
    .otp-box { background-color: #020617; border: 1px solid #7C3AED; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #A78BFA; }
    .expiry { font-size: 12px; color: #F59E0B; margin-top: 8px; font-weight: 600; }
    .security-note { background-color: rgba(255, 255, 255, 0.03); border-left: 3px solid #06B6D4; padding: 12px 16px; border-radius: 4px; font-size: 12px; color: #94A3B8; margin-top: 24px; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #475569; border-top: 1px solid rgba(255,255,255,0.06); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛡️ CryptoGuard</h1>
      <p>AI-Powered Crypto Risk Intelligence</p>
    </div>
    <div class="content">
      <div class="greeting">Hello ${userName},</div>
      <p class="instructions">
        Thank you for creating an account with CryptoGuard. To complete your registration and secure your profile, please use the 6-digit verification code below:
      </p>

      <div class="otp-box">
        <div class="otp-code">${otp}</div>
        <div class="expiry">⏱️ Code expires in 10 minutes</div>
      </div>

      <div class="security-note">
        <strong>Security Notice:</strong> If you did not request this verification code, please ignore this email. Never share your OTP with anyone. CryptoGuard administrators will never ask for your code.
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} CryptoGuard Platform. All rights reserved.
    </div>
  </div>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"CryptoGuard Security" <${fromEmail}>`,
    to: toEmail,
    subject: `🔐 Your CryptoGuard Verification Code: ${otp}`,
    text: `Your CryptoGuard verification code is: ${otp}. It expires in 10 minutes. Never share this code.`,
    html: htmlContent,
  });

  return true;
}
