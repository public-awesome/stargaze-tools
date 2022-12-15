// query all accounts in accounts.csv
// output bad accounts to console

import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'csv-parse';
var fetchUrl = require('fetch').fetchUrl;

const config = require('../config');

async function queryAccounts() {
  // open accounts.csv
  interface Account {
    address: string;
  }
  const __dirname = process.cwd();
  const csvFilePath = path.resolve(__dirname, './accounts.csv');
  const headers = ['address'];
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
  const addrs: Array<string> = [];

  // for each account in accounts.csv query the account balance
  await parse(
    fileContent,
    {
      delimiter: ',',
      columns: headers,
    },
    async (error, fileContents: Account[]) => {
      if (error) {
        throw error;
      }
      fileContents.map((row) => addrs.push(row.address));

      addrs.forEach((addr) => {
        fetchUrl(
          'https://rest.elgafar-1.stargaze-apis.com/cosmos/bank/v1beta1/balances/' +
            addr +
            '/by_denom?denom=ustars',
          function (error: any, meta: any, body: { toString: () => any }) {
            if (JSON.parse(body.toString())['message'] != undefined) {
              console.log(addr + JSON.parse(body.toString())['message']);
            }
          }
        );
      });
    }
  );
}
queryAccounts();
