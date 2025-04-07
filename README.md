# COMP0067_2025_Team3

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Send Grid 
1. Create a SendGrid Account
    Go to https://sendgrid.com/ and sign up for a free account.

2. Authenticate a Sender Email
Before SendGrid will send emails from your app, you must verify a sender identity.
    In the SendGrid dashboard, go to Email API > Sender Authentication
    Under Single Sender Verification, click "Create a Sender"
    Fill out the form:
    From Name: (e.g. YourApp Support)
    From Email: your personal or test email (e.g. you@example.com)
    Reply-To Email: (can be the same as above)
    You'll receive a confirmation email — verify it.
Until domain authentication is set up (which we don't require for local dev), each teammate needs to use their own verified sender email.

3. Generate an API Key
    Navigate to Settings > API Keys
    Click "Create API Key"
    Give it a name (e.g., local-dev-key)
    Select Full Access or at least "Mail Send"
    Click Create & Copy the key

4. Add your key and sender email to a .env file
    In your project root, create a .env file (if it doesn't exist already), and add:
    SENDGRID_API_KEY=your-api-key-here
    SENDGRID_SENDER_EMAIL=your-verified-email@example.com

5. Restart your dev server
If it's already running, make sure to restart so the environment variables are loaded.
