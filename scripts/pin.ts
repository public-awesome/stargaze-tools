// Pin IPFS CIDs
// This script pins IPFS CIDs of the metadata and image assets to a Pinata gateway
// Requires PINATA_API_KEY, PINATA_API_SECRET_KEY set in .env
// Pinning improves availability of the IPFS CID assets by avoiding CIDs getting garbage collected
// https://docs.ipfs.io/concepts/persistence/#pinning-in-context

require('dotenv').config();

import pinataSDK from '@pinata/sdk';

async function pin() {
  const pinata_key = process.env.PINATA_API_KEY;
  const pinata_secret_key = process.env.PINATA_API_SECRET_KEY;
  if (pinata_key == undefined) {
    throw new Error('PINATA_API_KEY required in .env');
  }
  if (pinata_secret_key == undefined) {
    throw new Error('PINATA_API_SECRET_KEY required in .env');
  }
  const pinata = pinataSDK(pinata_key, pinata_secret_key);
}

pin();
