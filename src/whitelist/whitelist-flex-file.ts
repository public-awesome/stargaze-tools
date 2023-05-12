// Add members with mint_count to whitelist-flexible using owner_nft_count.csv.
// Accepts cosmos, stars addresses.
// If you run into an error with `member_limit`, run `yarn whitelist --increase-member-limit`

import { toStars } from '../helpers/utils';
import { getClient } from '../helpers/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

const config = require('../../config');

async function addFile() {
  const __dirname = process.cwd();
  const csvFilePath = path.resolve(__dirname, './owner_nft_count.csv');
  const headers = ['address', 'mint_count'];
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
  const wl_entries: any[] = [];
  const validated_wl_entries: any[] = [];
  const client = await getClient();
  const account = toStars(config.account);
  const whitelistContract = toStars(config.whitelistContract);
  if (!config.minter) {
    throw Error(
      '"minter" must be set to a minter contract address in config.js'
    );
  }
  parse(
    fileContent,
    {
      delimiter: ',',
      columns: headers,
    },
    async (error, fileContents: any[]) => {
      if (error) {
        throw error;
      }
      fileContents.map((row) =>
        wl_entries.push({
          address: row.address,
          mint_count: parseInt(row.mint_count),
        })
      );

      wl_entries.forEach((wl_entry) => {
        validated_wl_entries.push({
          address: toStars(wl_entry.address),
          mint_count: wl_entry.mint_count,
        });
      });

      console.log(
        'Whitelist addresses validated. member number: ' +
          validated_wl_entries.length
      );
      let addrs: Array<string> = [];
      validated_wl_entries.map((member) => {
        addrs.push(member.address);
      });
      if (validated_wl_entries.length != [...new Set(addrs)].length) {
        throw Error('Duplicate addresses in whitelist file');
      }

      let count = 0;
      let addMembers: any[] = [];

      for (const idx in validated_wl_entries) {
        count += 1;
        addMembers.push({
          address: validated_wl_entries[idx].address,
          mint_count: parseInt(validated_wl_entries[idx].mint_count),
        });
        if (count % 50 == 0) {
          const msg = {
            add_members: {
              to_add: addMembers,
            },
          };
          console.log(JSON.stringify(msg, null, 2));
          const result = await client.execute(
            account,
            whitelistContract,
            msg,
            'auto',
            'update whitelist'
          );
          const wasmEvent = result.logs[0].events.find(
            (e) => e.type === 'wasm'
          );
          console.info(
            'The `wasm` event emitted by the contract execution:',
            wasmEvent
          );
          count = 0;
          addMembers = [];
        }
      }
      if (count > 0) {
        const msg = {
          add_members: {
            to_add: addMembers,
          },
        };
        console.log(JSON.stringify(msg, null, 2));
        const result = await client.execute(
          account,
          whitelistContract,
          msg,
          'auto',
          'update whitelist'
        );
        const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
        console.info(
          'The `wasm` event emitted by the contract execution:',
          wasmEvent
        );
      }
    }
  );
}

addFile();
