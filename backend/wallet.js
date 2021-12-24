const axios = require('axios');
const liquid = require('liquidjs-lib');
const {
  fetchAndUnblindUtxos,
  walletFromAddresses,
  greedyCoinSelector,
  psetToUnsignedHex,
  craftMultipleRecipientsPset,
  PrivateKey,
  IdentityType
} = require('ldk');



async function createTx(addressInfo, { to, amount, asset }, explorerUrl) {
  const senderWallet = await walletFromAddresses(
    [addressInfo],
    explorerUrl,
    'testnet'
  );
  const utxos = await fetchAndUnblindUtxos([addressInfo], explorerUrl);

  // create a tx using wallet
  const tx = senderWallet.createTx();

  const recipients = [
    {
      asset: asset,
      value: amount,
      address: to,
    },
  ];

  const unsignedTxBase64 = craftMultipleRecipientsPset({
    unspents: utxos,
    coinSelector: greedyCoinSelector(),
    changeAddressByAsset: (_) => addressInfo.confidentialAddress,
    recipients,
    psetBase64: tx,
    addFee: true,
  });

  return unsignedTxBase64;
}

// blind 
async function blindTx(unsignedTxBase64, to, privateKey) {
  const addressInfo = await privateKey.getNextAddress();

  const outputsToBlind = new Array();
  const outputsPubKeys = new Map();
  const ptx = liquid.Transaction.fromHex(psetToUnsignedHex(unsignedTxBase64));
  ptx.outs.forEach((out, index) => {
    if (out.script.length === 0) return;



    const ownScript = liquid.address.toOutputScript(addressInfo.confidentialAddress);
    // look for blinding pub key
    if (out.script.equals(ownScript)) {
      const pubKey = liquid.ECPair.fromPrivateKey(Buffer.from(addressInfo.blindingPrivateKey, "hex")).publicKey;
      outputsPubKeys.set(index, pubKey)
    } else {
      // get blind pub key
      const toBlindPubKey = liquid.address.fromConfidential(to).blindingKey;
      outputsPubKeys.set(index, toBlindPubKey)
    }

    // add index
    outputsToBlind.push(index);
  })


  const blindedTxBase64 = await privateKey.blindPset(unsignedTxBase64, outputsToBlind, outputsPubKeys)

  return blindedTxBase64;
}


async function signTx(blindedTxBase64, privateKey) {
  // sign his inputs with identity interface
  const signedTxBase64 = await privateKey.signPset(blindedTxBase64);

  const decodedTx = liquid.Psbt.fromBase64(signedTxBase64);

  // Alice should validate all singature and finalize the transaction
  decodedTx.validateSignaturesOfAllInputs();
  // finalize all inputs
  decodedTx.finalizeAllInputs();
  // Get the tx in hex format ready to be broadcasted
  const hex = decodedTx.extractTransaction().toHex();

  return hex;
}


async function broadcastTx(hex, explorerUrl) {
  //Now we can broadcast with the Esplora API
  const txid = (await axios.post(`${explorerUrl}/tx`, hex)).data;
  return txid;
}

async function walletFromKeys(signWif, blindWif) {
  const privateKey = new PrivateKey({
    type: IdentityType.PrivateKey,
    chain: "testnet",
    opts: {
      signingKeyWIF: signWif,
      blindingKeyWIF: blindWif,
    },
  });

  const addressInfo = await privateKey.getNextAddress();

  return { privateKey, addressInfo };
}


module.exports = {
  walletFromKeys,
  createTx,
  blindTx,
  signTx,
  broadcastTx,
}