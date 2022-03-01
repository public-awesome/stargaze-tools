import { getFilesFromPath } from 'files-from-path';
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

  const contractMetadata = await client.store({
    name: config.name,
    description: config.description,
    image: new File([content], path.basename(config.image), { type } as any),
  });

  // Set contract uri
  let contractUri = contractMetadata.url;

  const imagesBasePath = path.join(__dirname, '../images');
  const metadataBasePath = path.join(__dirname, '../metadata');

  // Get list of images and metadata
  const images = fs.readdirSync(imagesBasePath);
  const metadata = fs.readdirSync(metadataBasePath);

  // Validation
  checkFiles(images, metadata);

  // Upload images folder
  const imageFiles = await getFilesFromPath(imagesBasePath);
  const imagesBaseUri = await client.storeDirectory(imageFiles as any);

  // Create temp upload folder for metadata
  const tmpFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'galaxy'));

  // Update metadata with IPFS hashes
  metadata.map(async (file, index: number) => {
    // Read JSON file
    let metadata = JSON.parse(
      fs.readFileSync(`${metadataBasePath}/${file}`, 'utf8')
    );

    // Set image to upload image IPFS hash
    metadata.image = `ipfs://${imagesBaseUri}/images/${images[index]}`;

    // Write updated metadata to tmp folder
    // We add 1, because token IDs start at 1
    fs.writeFileSync(`${tmpFolder}/${index + 1}`, JSON.stringify(metadata));
  });

  // Upload tmpFolder
  const files = await getFilesFromPath(tmpFolder);
  const result = await client.storeDirectory(files as any);

  // Project will have been uploaded into a randomly name folder
  const projectPath = tmpFolder.split('/').pop();

  // Set base token uri
  const baseTokenUri = `ipfs://${result}/${projectPath}`;

  console.log('Set these fields in your config.js file: ');
  console.log('baseTokenUri: ', baseTokenUri);
  console.log('contractUri: ', contractUri);

  return {
    baseTokenUri,
    contractUri,
  };
}

nftStorageUpload();
