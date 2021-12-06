const axios = require('axios');
const liquid = require('liquidjs-lib');
const {
  fetchAndUnblindUtxos,
  walletFromAddresses,
  greedyCoinSelector,
  psetToUnsignedHex,
  craftMultipleRecipientsPset,
  IdentityType,
  PrivateKey
} = require('ldk');

// API
const APIURL = process.env.EXPLORER_URL;

const privateKey = new PrivateKey({
  type: IdentityType.PrivateKey,
  chain: "testnet",
  opts: {
    signingKeyWIF: process.env.SIGN_WIF,
    blindingKeyWIF: process.env.BLIND_WIF,
  },
});


async function send(to, amount, assetToBeSent) {
  try {
    const addressInfo = await privateKey.getNextAddress();
    const senderWallet = await walletFromAddresses(
      [addressInfo],
      APIURL,
      'testnet'
    );

    console.log(`address ${addressInfo.confidentialAddress}`);
    console.log(``);
    const utxos = await fetchAndUnblindUtxos([addressInfo], APIURL);

    // create a tx using wallet
    const tx = senderWallet.createTx();

    const recipients = [
      {
        asset: assetToBeSent,
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


    // blind 
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
    // sign his inputs with identity interface
    const signedTxBase64 = await privateKey.signPset(blindedTxBase64);

    const decodedTx = liquid.Psbt.fromBase64(signedTxBase64);

    // Alice should validate all singature and finalize the transaction
    decodedTx.validateSignaturesOfAllInputs();
    // finalize all inputs
    decodedTx.finalizeAllInputs();
    // Get the tx in hex format ready to be broadcasted
    const hex = decodedTx.extractTransaction().toHex();

    //Now we can broadcast with the Esplora API
    const txid = (await axios.post(`${APIURL}/tx`, hex)).data;
    return txid;
  } catch (e) {
    throw e;
  }
}




module.exports = {
  send
}