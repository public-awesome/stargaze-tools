import fs from "fs";
import os from "os";
import path from "path";
import pinataSDK from "@pinata/sdk";
import { checkFiles } from "../src/validation";

// Load config
const config = require("../config");

// Configure Pinata
const apiKey = config.pinataApiKey;
const secretKey = config.pinataSecretKey;
const pinata = pinataSDK(apiKey, secretKey);

export async function pinataUpload() {
  // Config
  console.log(
    "Deploying files to IPFS via Pinata using the following configuration:"
  );
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

pinataUpload();
