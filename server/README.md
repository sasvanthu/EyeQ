# EyeQ Certificate Generator (Express + Puppeteer)

This small server generates printable PDF certificates using Puppeteer. It's designed to be run locally during development or deployed to a serverless platform that supports Puppeteer or headless Chromium.

Setup
1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

Usage
- Endpoint: POST `/generate-certificate`
- Body example (JSON):

```json
{
  "eventTitle": "Event #1",
  "memberName": "John Doe",
  "date": "2025-12-01"
}
```

The server returns a PDF stream ready to be downloaded. For production setups, you should set up authentication and secure file storage (S3) instead of returning raw PDF bytes.

Notes
- Puppeteer requires a Chromium-compatible environment. When deploying to some cloud providers, ensure Chromium is supported or use `puppeteer-core` with a compatible browser binary.
- You can extend the template, add logos, or watermarking.
