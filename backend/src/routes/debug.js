// backend/src/routes/debug.js
const express = require('express');
const router = express.Router();

router.post('/echo', (req, res) => {
  // echo back what Express parsed
  res.json({
    receivedBody: req.body,
    headers: req.headers
  });
});

module.exports = router;
