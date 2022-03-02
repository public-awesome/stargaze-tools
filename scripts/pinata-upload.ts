import fs from 'fs';
import os from 'os';
import path from 'path';
import pinataSDK from '@pinata/sdk';
import { naturalCompare } from '../src/sort';
import { checkFiles } from '../src/validation';

// Load config
const config = require('../config');

// Configure Pinata
const apiKey = config.pinataApiKey;
const secretKey = config.pinataSecretKey;
const pinata = pinataSDK(apiKey, secretKey);

export async function pinataUpload() {
  // Config
  console.log(
    'Deploying files to IPFS via Pinata using the following configuration:'
  );
  console.log(config);

  const imagesBasePath = path.join(__dirname, '../images');
  const metadataBasePath = path.join(__dirname, '../metadata');

  // Get list of images and metadata
  const images = fs.readdirSync(imagesBasePath);
  const metadata = fs.readdirSync(metadataBasePath);

  // Sort files (need to be in natural order)
  images.sort(naturalCompare);
  metadata.sort(naturalCompare);

  // Validation
  checkFiles(images, metadata);

  // Upload images folder
  const imagesBaseUri = await pinata.pinFromFS(imagesBasePath);

  // Create temp upload folder for metadata
  const tmpFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'galaxy'));

  // Update metadata with IPFS hashes
  metadata.map(async (file, index: number) => {
    // Read JSON file
    let metadata = JSON.parse(
      fs.readFileSync(`${metadataBasePath}/${file}`, 'utf8')
    );

    // Set image to upload image IPFS hash
    metadata.image = `ipfs://${imagesBaseUri.IpfsHash}/${images[index]}`;

    // Write updated metadata to tmp folder
    // We add 1, because token IDs start at 1
    fs.writeFileSync(`${tmpFolder}/${index + 1}`, JSON.stringify(metadata));
  });

  // Upload tmpFolder
  const result = await pinata.pinFromFS(tmpFolder);

  // Set base token uri
  const baseTokenUri = `ipfs://${result.IpfsHash}`;

  console.log('Set this field in your config.js file: ');
  console.log('baseTokenUri: ', baseTokenUri);

  return {
    baseTokenUri,
  };
}

pinataUpload();
