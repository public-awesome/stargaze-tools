import { NFTStorage } from 'nft.storage';
// import { URL, URLSearchParams } from 'url';
// import fetch from 'node-fetch';

// Load config
const config = require('../config');
const https = require('https');

// Configure NFT.storage
const token = config.nftStorageApiKey;
const client = new NFTStorage({ token });

// Delete all files from NFT.storage
export async function nftStorageClean() {
  const listUrl = new URL(``, client.endpoint);
  listUrl.search = new URLSearchParams([['limit', '1000']]).toString();

  https
    .get(
      listUrl.toString(),
      { headers: NFTStorage.auth(token) },
      (res: any) => {
        console.log(res);
        let data: any[] = [];
        const headerDate =
          res.headers && res.headers.date
            ? res.headers.date
            : 'no response date';
        console.log('Status Code:', res.statusCode);
        console.log('Date in Response header:', headerDate);

        res.on('data', (chunk: any) => {
          data.push(chunk);
        });

        res.on('end', async () => {
          console.log('Response ended: ');
          const files = JSON.parse(Buffer.concat(data).toString());
          const total = files.value.length;
          let fileIndex = 1;
          for (let f of files.value) {
            console.log(`Deleting ${fileIndex}/${total} : ${f.cid}`);
            await client.delete(f.cid);
            fileIndex++;
          }
        });
      }
    )
    .on('error', (err: any) => {
      console.log('Error: ', err.message);
    });
}

nftStorageClean();
