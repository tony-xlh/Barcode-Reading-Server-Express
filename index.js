const express = require('express');
const dbrCPP = require("barcode4nodejs");
dbrCPP.initLicense("t0074oQAAABz1tASEoWT4IIp00emVmVI9CDkIbZtyKBCrSbAZcltlVnqIuM6/r5afZwkP60uzSrBlN5kTWD1Y2IIawWEUYSDZAwjyIxQ=");
let DBR = require("dynamsoft-node-barcode");
// Please visit https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&package=js&utm_source=github to get a trial license
DBR.BarcodeReader.productKeys = 't0068NQAAAGNOq7dzkQC15+OOZbnTQto7+fNg4iMscqwrJ4Qio9JK1O4pr4daM9VTPAy5ydEvjHGhoU6EMvOU3t6R/eGof8M=';

let reader = null;
(async()=>{
    reader = await DBR.BarcodeReader.createInstance();
})();

const app = express();
app.use(express.static('public'))
app.use(express.json({ limit: "200mb" }));
const port = 3000;

app.post('/readBarcodes', async (req, res) => {
  let response;
  if (req.body["SDK"] === "DBRCPP") {
    console.log("Use C++");
    response = await decodeWithDBRCPP(req.body["base64"]);
  }else{
    console.log("Use WASM");
    response = await decodeWithDBRWASM(req.body["base64"]);
  }
  
  res.json(response);
})

async function decodeWithDBRCPP(base64){
  const startTime = (new Date()).getTime();
  const results = await dbrCPP.decodeBase64Async(base64, dbrCPP.formats.OneD | dbrCPP.formats.PDF417 | dbrCPP.formats.QRCode | dbrCPP.formats.DataMatrix | dbrCPP.formats.Aztec, "");
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
  return response;
}

async function decodeWithDBRWASM(base64){
  const startTime = (new Date()).getTime();
  const results = await reader.decode("data:image/png;base64,"+base64);
  const elapsedTime = (new Date()).getTime() - startTime;
  const response = {};
  response.results = [];
  for (let index = 0; index < results.length; index++) {
    const result = results[index];
    response.results.push({
      barcodeText: result.barcodeText,
      barcodeFormat: result.barcodeFormat,
      x1: result.localizationResult.x1,
      x2: result.localizationResult.x2,
      x3: result.localizationResult.x3,
      x4: result.localizationResult.x4,
      y1: result.localizationResult.y1,
      y2: result.localizationResult.y2,
      y3: result.localizationResult.y3,
      y4: result.localizationResult.y4
    })
  }
  response.elapsedTime = elapsedTime;
  return response;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})