import nodemailer from 'nodemailer';


const createTransporter = () => {
  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    throw new Error('Missing GMAIL_USER or GMAIL_APP_PASSWORD in .env file');
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('🔧 Creating Gmail transporter...');
    console.log('✅ Using environment variables for authentication');
    console.log(`📧 Email configured: ${GMAIL_USER}`);
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  return transporter;
};

export default createTransporter;