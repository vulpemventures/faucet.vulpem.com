const liquid = require('liquidjs-lib');
const { send } = require("./transaction");


const AMOUNT_PER_ASSET = {
  '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49': 100000, 
  'f3d1ec678811398cd2ae277cbe3849c6f6dbd72c74bc542f7c4b11ff0e820958': 50000000, 
  'ac3e0ff248c5051ffd61e00155b7122e5ebc04fd397a0ecbdd4f4e4a56232926': 50000000
};

module.exports.handler = async (event, context) => {
  if (!event.hasOwnProperty('body')) 
    throw new Error('missing body');

  const body = JSON.parse(event.body);
  if (!body.hasOwnProperty("to") || !body.hasOwnProperty("asset"))
    throw new Error('bad params');

  const { asset, to } = body;

  const ASSETS = Object.keys(AMOUNT_PER_ASSET);
  if (!ASSETS.includes(asset))
    throw new Error('asset not supported, must be one of ' + ASSETS);


  try {
    liquid.address.toOutputScript(to)
  } catch(e) {
    throw new Error('invalid address');
  }

  try {
    console.info(`Sending ${asset} to ${to}`);
    
    const txid = await send(to, AMOUNT_PER_ASSET[asset], asset);

    const response = {
      "statusCode": 200,
      "body": JSON.stringify({ txid }),
      "isBase64Encoded": false
  };

    return response;
  } catch(e) {
    throw new Error('Internal error. Please try again')
  }
};