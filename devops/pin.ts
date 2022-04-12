// Pin IPFS CIDs
// This script pins IPFS CIDs of the metadata and image assets to a Pinata gateway
// Requires PINATA_API_KEY, PINATA_API_SECRET_KEY set in .env
// Pinning improves availability of the IPFS CID assets by avoiding CIDs getting garbage collected
// https://docs.ipfs.io/concepts/persistence/#pinning-in-context

// Ex: yarn pin bafybeihnixau3xfnw6cd7z4to7csixa3twogfktorm3nqxrpewcztyarpq,bafybeia43tr7rabffi65vogxfr75wyyi73ynyt6mah7f42hkpxkpvok45u

require('dotenv').config();

import pinataSDK from '@pinata/sdk';

async function pin(cids: string) {
  const pinata_key = process.env.PINATA_API_KEY;
  const pinata_secret_key = process.env.PINATA_API_SECRET_KEY;
  if (pinata_key == undefined) {
    throw new Error('PINATA_API_KEY required in .env');
  }
  if (pinata_secret_key == undefined) {
    throw new Error('PINATA_API_SECRET_KEY required in .env');
  }
  if (cids == undefined || cids.length == 0) {
    throw new Error('No CIDs. Pass CIDs to pin.');
  } else {
    console.log('cids: ', cids);
  }
  const pinata = pinataSDK(pinata_key, pinata_secret_key);

  pinata
    .testAuthentication()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
      throw new Error('pinata authentication failed');
    });

  // pin hashes
  const cids_hashes: string[] = cids.split(',');
  console.log(cids_hashes);
  for (let idx in cids_hashes) {
    pinata
      .pinByHash(
        cids_hashes[idx],
        // empty options
        {}
      )
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
  }
}

const args = process.argv.slice(2);
if (args.length == 1) {
  pin(args[0]);
} else {
  console.log('Invalid arguments');
}
