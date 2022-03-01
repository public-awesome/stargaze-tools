import fs from 'fs';
import mime from 'mime';
import { NFTStorage, Blob, File } from 'nft.storage';
import os from 'os';
import path from 'path';
import { checkFiles } from '../src/validation';

// Load config
const config = require('../config');

// Configure NFT.storage
const token = config.nftStorageApiKey;
const client = new NFTStorage({ token });

export async function nftStorageUpload() {
  // Config
  console.log(
    'Deploying files to IPFS via NFT.storage using the following configuration:'
  );
  console.log(config);

  // Upload collection showcase image + metadata

  const content = await fs.promises.readFile(config.image);
  const type = mime.getType(config.image);
  const imageType = path.extname(config.image);

  const contractMetadata = await client.store({
    name: config.name,
    description: config.description,
    image: new File([content], path.basename(config.image), { type } as any),
  });

  // Set contract uri
  let contractUri = contractMetadata.url;
  console.log(`Contract: ${contractUri}`);

  const imagesBasePath = path.join(__dirname, '../images');
  const metadataBasePath = path.join(__dirname, '../metadata');

  // Get list of images and metadata
  const images = fs.readdirSync(imagesBasePath);
  const metadata = fs.readdirSync(metadataBasePath);

  // Validate the files
  checkFiles(images, metadata);

  // Map path to file objects
  const imageFiles = images.map((i) => {
    const imagePath = `${imagesBasePath}/${i}`;
    const readableFile = fs.readFileSync(imagePath);
    const type = mime.getType(imagePath);
    return new File([readableFile], path.basename(imagePath), { type } as any);
  });

  const imagesCid = await client.storeDirectory(imageFiles);

  console.log(`Image Uploading Finished. Images cid: ${imagesCid}`);

  // Update the metadata
  const metaTmpPath = path.join(os.tmpdir(), 'metadata');
  const tmpFolder = fs.mkdtempSync(metaTmpPath);
  //   const updatedMetadata2 = fs.readdirSync(metaTmpPath);
  // Write new metadata
  metadata.map((file) => {
    // Match up the meta files with the images
    const index = parseInt(file);
    let metaFile = fs.readFileSync(`${metadataBasePath}/${file}`, 'utf8');
    // Read JSON file
    let metadata = JSON.parse(metaFile);

    // Set image to upload image IPFS hash
    metadata.image = `ipfs://${imagesCid}/${index}${imageType}]}`;
    console.log(JSON.stringify(metadata));
    fs.writeFileSync(`${tmpFolder}/${index}`, JSON.stringify(metadata));
  });

  // Map the new meta files
  const updatedMetadata = fs.readdirSync(tmpFolder);
  const metadataFiles = updatedMetadata.map((i) => {
    const metaPath = `${tmpFolder}/${i}`;
    const readableFile = fs.readFileSync(metaPath);
    const type = mime.getType(metaPath);
    return new File([readableFile], path.basename(metaPath), {
      type,
    } as any);
  });

  // Upload
  const metaCid = await client.storeDirectory(metadataFiles);
  console.log(`Metadata uploading finished. Metadata cid: ${metaCid}`);

  const baseTokenUri = `ipfs://${metaCid}`;
  const imagesUri = `ipfs://${imagesCid}`;

  return {
    baseTokenUri,
    contractUri,
    imagesUri,
  };
}

nftStorageUpload();
