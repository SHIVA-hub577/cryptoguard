import "dotenv/config";
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { User } from './models/User';
import { Session } from './models/Session';
import { Otp } from './models/Otp';
import { sendOtpEmail } from './email';

export const authRouter = Router();

// 1. Send OTP for signup
authRouter.post('/send-otp', async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if verified user exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ error: 'An account with this email already exists. Please sign in instead.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert OTP record
    await Otp.findOneAndUpdate(
      { email: cleanEmail },
      {
        email: cleanEmail,
        otp,
        name: name || cleanEmail.split('@')[0],
        hashedPassword,
        createdAt: new Date(),
        expiresAt,
      },
      { upsert: true, new: true }
    );

    // Send email
    await sendOtpEmail(cleanEmail, otp, name);
    console.log(`✉️ OTP sent to ${cleanEmail}`);

    res.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${cleanEmail}. Please check your inbox.`,
    });
  } catch (error: any) {
    console.error('❌ Error sending OTP:', error);
    res.status(500).json({ error: error.message || 'Failed to send verification email. Please try again.' });
  }
});

// 2. Verify OTP & Create Account + Database Session
authRouter.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and verification code are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    const otpRecord = await Otp.findOne({ email: cleanEmail });
    if (!otpRecord) {
      return res.status(400).json({ error: 'No active verification code found. Please request a new code.' });
    }

    if (new Date() > otpRecord.expiresAt) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
    }

    if (otpRecord.otp !== cleanOtp) {
      return res.status(400).json({ error: 'Invalid verification code. Please check and try again.' });
    }

    // Create or update verified user
    let user = await User.findOne({ email: cleanEmail });
    if (!user) {
      user = new User({
        email: cleanEmail,
        name: otpRecord.name || cleanEmail.split('@')[0],
        password: otpRecord.hashedPassword,
        isVerified: true,
      });
      await user.save();
    } else {
      user.isVerified = true;
      if (otpRecord.hashedPassword) user.password = otpRecord.hashedPassword;
      if (otpRecord.name) user.name = otpRecord.name;
      await user.save();
    }

    // Delete used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    // Create Database Session
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = new Session({
      userId: user._id,
      email: user.email,
      sessionToken,
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip || '',
      expiresAt,
    });
    await session.save();

    console.log(`✅ User registered and verified: ${user.email}, session created in MongoDB`);

    res.json({
      success: true,
      sessionToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error('❌ Error verifying OTP:', error);
    res.status(500).json({ error: error.message || 'Verification failed. Please try again.' });
  }
});

// 3. Login & Create Database Session
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email address before logging in.' });
    }

    // Create Database Session in MongoDB
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = new Session({
      userId: user._id,
      email: user.email,
      sessionToken,
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip || '',
      expiresAt,
    });
    await session.save();

    console.log(`✅ User logged in: ${user.email}, session stored in MongoDB`);

    res.json({
      success: true,
      sessionToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: error.message || 'Login failed. Please try again.' });
  }
});

// 4. Validate Session from Database
authRouter.get('/session', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : (req.query.token as string);

    if (!token) {
      return res.status(401).json({ valid: false, error: 'No session token provided.' });
    }

    const session = await Session.findOne({ sessionToken: token });
    if (!session) {
      return res.status(401).json({ valid: false, error: 'Session not found or expired in database.' });
    }

    if (new Date() > session.expiresAt) {
      await Session.deleteOne({ _id: session._id });
      return res.status(401).json({ valid: false, error: 'Session has expired.' });
    }

    const user = await User.findById(session.userId);
    if (!user) {
      return res.status(401).json({ valid: false, error: 'User associated with session not found.' });
    }

    res.json({
      valid: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error('❌ Session check error:', error);
    res.status(500).json({ valid: false, error: error.message || 'Failed to validate session.' });
  }
});

// 5. Logout & Destroy Session in Database
authRouter.post('/logout', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : req.body?.token;

    if (token) {
      await Session.deleteMany({ sessionToken: token });
      console.log('✅ Session removed from database on logout');
    }

    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error: any) {
    console.error('❌ Logout error:', error);
    res.status(500).json({ error: error.message || 'Logout failed.' });
  }
});
