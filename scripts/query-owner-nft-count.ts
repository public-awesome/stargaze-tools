// start with snapshot.csv
// output address and nft count to owner_nft_count.csv
// burned nfts count gets added towards config.account address

import { toStars } from '../src/utils';
import * as fs from 'fs';
import { appendFileSync } from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

const config = require('../config');
const SNAPSHOT = 'snapshot.csv';

class TokenInfo {
  owner: string;
  tokenId: string;
  constructor(tokenId = '', owner = '') {
    this.owner = owner;
    this.tokenId = tokenId;
  }
}

class OwnerNftCount {
  address: string;
  count: number;
  constructor(address = '', count = 0) {
    this.address = address;
    this.count = count;
  }

  saveAsCSV() {
    const csv = `${this.address},${this.count}\n`;
    try {
      appendFileSync('./owner_nft_count.csv', csv);
    } catch (err) {
      console.error(err);
    }
  }
}

async function queryNftCount() {
  const account = toStars(config.account);

  const __dirname = process.cwd();
  const csvFilePath = path.resolve(__dirname, './' + SNAPSHOT);
  const headers = ['tokenId', 'owner'];
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
  const owners = new Map();

  await parse(
    fileContent,
    {
      delimiter: ',',
      columns: headers,
    },
    async (error, fileContents: TokenInfo[]) => {
      if (error) {
        throw error;
      }
      fileContents.map((row) => {
        if (row.owner == 'burned') {
          row.owner = account;
        }
        if (owners.has(row.owner)) {
          owners.set(row.owner, owners.get(row.owner) + 1);
        } else {
          owners.set(row.owner, 1);
        }
      });
      owners.forEach((count, addr) => {
        const row = new OwnerNftCount(addr, count);
        row.saveAsCSV();
      });
    }
  );
}

queryNftCount();
