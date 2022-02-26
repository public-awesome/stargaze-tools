import pinataSDK from '@pinata/sdk';

// Load config
const config = require('../config');

// Configure Pinata
const apiKey = config.pinataApiKey;
const secretKey = config.pinataSecretKey;
const pinata = pinataSDK(apiKey, secretKey);

export async function pinataClean() {
  const allPins = await pinata.pinList({ status: 'pinned', pageLimit: 1000 });
  let index = 1;
  for (let pin of allPins.rows) {
    // Upload to IPFS
    console.log(pin);
    await pinata.unpin(pin.ipfs_pin_hash);
    console.log(
      `Removed pin ${index}/${allPins.rows.length} : ${pin.ipfs_pin_hash}`
    );
    index++;
  }
}

pinataClean();
