import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer';

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

app.post('/generate-certificate', async (req, res) => {
  try {
    const { eventTitle, memberName, date } = req.body;
    const html = `
      <html>
        <head>
          <meta charset='utf-8' />
          <style>
            body{ background:#000; color:#fff; font-family: Arial, sans-serif;}
            .cert{ border: 6px solid #00D1FF; padding: 60px; border-radius: 12px; text-align: center; }
            h1 { font-size: 28px; }
            h2 { font-size: 22px; margin-top: 20px; }
            .meta { margin-top: 20px; font-size: 14px; color: #dbeefd; }
          </style>
        </head>
        <body>
          <div class='cert'>
            <h1>Certificate of Participation</h1>
            <h2>${eventTitle}</h2>
            <div class='meta'>Presented to</div>
            <h2 style='margin-top: 20px;'>${memberName}</h2>
            <div class='meta'>Date: ${date}</div>
          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdfBuffer.length });
    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation failed:', err);
    res.status(500).json({ error: 'PDF generation failed', details: String(err) });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Certificate server running on port ${port}`);
});
