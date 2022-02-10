import fs from "fs";
import os from "os";
import path from "path";
import pinataSDK from "@pinata/sdk";

// Load config
const config = require("../config");

// Configure Pinata
const apiKey = config.pinataApiKey;
const secretKey = config.pinataSecretKey;
const pinata = pinataSDK(apiKey, secretKey);

export const checkFiles = (images: string[], metadata: string[]) => {
  // Check images length is equal to metadata length
  if (images.length !== metadata.length) {
    throw Error("Images files must have matching number of metadata files");
  }

  function parseFileName(path: string | null): string {
    // Check file name is not null
    if (!path) {
      throw Error("File cannot be null");
    }

    // Extract fileName from path
    const fileName = path.match(
      /([a-zA-Z0-9\s_\\.\-:])+(.png|.jpg|.gif|.json)$/i
    )![1];

    // Check that file name is an Integer
    if (isNaN(parseInt(fileName, 10))) {
      throw Error("Filenames must be numbers");
    }
    return fileName;
  }

  // Check each image is sequentially named with a number and has a matching metadata file
  for (let i = 0; i < images.length; i++) {
    // TODO update
    let image = parseFileName(images[i]);
    let json = parseFileName(metadata[i]);
    if (image !== json) {
      throw Error("Images must have matching JSON files");
    }
    if (i !== 0) {
      let previousImage = parseFileName(images[i - 1]);
      if (image < previousImage) {
        throw Error("Images must be sequential");
      }
    }
  }
};

export async function ipfsUpload() {
  // Config
  console.log("Deploying files to IPFS using the following configuration:");
  console.log(config);

  const imagesBasePath = path.join(__dirname, "../images");
  const metadataBasePath = path.join(__dirname, "../metadata");

  // Get list of images and metadata
  const images = fs.readdirSync(imagesBasePath);
  const metadata = fs.readdirSync(metadataBasePath);

  // Validation
  checkFiles(images, metadata);

  // Upload each image to IPFS and store hash in array
  const imagePromises = images.map(async (image) => {
    // Create readable stream
    const readableStreamForFile = fs.createReadStream(
      `${imagesBasePath}/${image}`
    );

    // Upload to IPFS
    return await pinata.pinFileToIPFS(readableStreamForFile);
  });

  // Wait for all images to be uploaded
  await Promise.all(imagePromises).then(async (images) => {
    // Create temp upload folder for metadata
    const tmpFolder = fs.mkdtempSync(path.join(os.tmpdir(), "galaxy"));

    // Update metadata with IPFS hashes
    metadata.map(async (file, index: number) => {
      // Read JSON file
      let metadata = JSON.parse(
        fs.readFileSync(`${metadataBasePath}/${file}`, "utf8")
      );

      // Set image to upload image IPFS hash
      metadata.image = `ipfs://${images[index].IpfsHash}`;

      // Write updated metadata to tmp folder
      fs.writeFileSync(`${tmpFolder}/${index}`, JSON.stringify(metadata));
    });

    // Upload tmpFolder
    const result = await pinata.pinFromFS(tmpFolder);

    // Set base token uri
    const baseTokenUri = `ipfs://${result.IpfsHash}`;

    console.log("base_token_uri: ", baseTokenUri);

    return {
      baseTokenUri,
    };
  });
}

ipfsUpload();
