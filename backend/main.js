const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const application = require('./app');

const PORT = process.env.PORT || 8000;
const EXPLORER_URL = process.env.EXPLORER_URL || "https://blockstream.info/liquidtestnet/api";
const BLIND_WIF = process.env.BLIND_WIF;
const SIGN_WIF = process.env.SIGN_WIF;


const app = express();

// parse application/json
app.use(bodyParser.json());
app.use(cors());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/address', async function (req, res) {
  try {
    const addressInfo = await application.getAddressInfo(SIGN_WIF, BLIND_WIF);
    return res.status(200).json({ address: addressInfo.confidentialAddress });
  } catch (e) {
    console.error(e.message || JSON.stringify(e));
    return res.status(500).send('Internal error');
  }
});

app.post('/api/send', async function (req, res) {
  const { body } = req;

  if (!body.hasOwnProperty("to") || !body.hasOwnProperty("asset"))
    return res.status(400).send('bad params');

  const { to, asset } = body;

  try {
    const txid = await application.send(to, asset, SIGN_WIF, BLIND_WIF, EXPLORER_URL);
    return res.status(200).json({ txid });
  } catch (e) {
    console.error(e.message || JSON.stringify(e));
    return res.status(500).send('Internal error. Please try again');
  }
});

app.listen(PORT, function () {
  console.log('🚰 listening on :' + PORT)
});