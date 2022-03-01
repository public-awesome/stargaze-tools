import fs from 'fs';
import os from 'os';
import path from 'path';
import pinataSDK from '@pinata/sdk';
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

  // Upload collection showcase image + metadata
  const readableStreamForFile = fs.createReadStream(config.image);
  const collectionResult = await pinata.pinFileToIPFS(readableStreamForFile);

  // Create collection metadata
  // https://docs.opensea.io/docs/contract-level-metadata
  const collectionMetadata = {
    name: config.name,
    description: config.description,
    image: `ipfs://${collectionResult.IpfsHash}`,
  };

  // Upload collection metadata to IPFS
  const collectionInfo = await pinata.pinJSONToIPFS(collectionMetadata);

  const imagesBasePath = path.join(__dirname, '../images');
  const metadataBasePath = path.join(__dirname, '../metadata');

  // Get list of images and metadata
  const images = fs.readdirSync(imagesBasePath);
  const metadata = fs.readdirSync(metadataBasePath);

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

  // Set contract uri
  const contractUri = `ipfs://${collectionInfo.IpfsHash}`;

  console.log('Set these fields in your config.js file: ');
  console.log('baseTokenUri: ', baseTokenUri);
  console.log('contractUri: ', contractUri);

  return {
    baseTokenUri,
    contractUri,
  };
}

pinataUpload();
