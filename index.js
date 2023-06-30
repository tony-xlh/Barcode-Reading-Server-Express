const express = require('express');
const app = express();
const port = 3000;

app.post('/readBarcodes', (req, res) => {
  console.log(req);
  res.send('Hello World!');
})

app.use(express.static('public'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})