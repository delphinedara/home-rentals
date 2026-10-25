const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;
const distPath = path.join(__dirname, 'dist', 'home-rentals');

// Basic security headers for a static application.
app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Serve compiled Angular assets.
app.use(express.static(distPath));

// Support Angular client-side routes such as /homes.
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Home Rentals running at http://localhost:${port}`);
});
