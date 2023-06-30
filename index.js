const express = require('express');
const dbr = require("barcode4nodejs");
dbr.initLicense("DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==");

const app = express();
app.use(express.static('public'))
app.use(express.json({ limit: "200mb" }));
const port = 3000;

app.post('/readBarcodes', async (req, res) => {
  const startTime = (new Date()).getTime();
  const results = await dbr.decodeBase64Async(req.body["base64"], dbr.formats.OneD | dbr.formats.PDF417 | dbr.formats.QRCode | dbr.formats.DataMatrix | dbr.formats.Aztec, "");
  const elapsedTime = (new Date()).getTime() - startTime;
  const response = {};
  response.results = [];
  for (let index = 0; index < results.length; index++) {
    const result = results[index];
    response.results.push({
      barcodeText: result.value,
      barcodeFormat: result.format,
      x1: result.x1,
      x2: result.x2,
      x3: result.x3,
      x4: result.x4,
      y1: result.y1,
      y2: result.y2,
      y3: result.y3,
      y4: result.y4
    })
  }
  response.elapsedTime = elapsedTime;
  res.json(response);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})