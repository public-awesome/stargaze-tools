// Add members with mint_count to whitelist-flexible using owner_nft_count.csv.
// Accepts cosmos, stars addresses.
// If you run into an error with `member_limit`, run `yarn whitelist --increase-member-limit`

import {
  ExecuteMsg,
  Member,
} from '@stargazezone/launchpad/src/WhitelistFlex.types';
import { MsgExecuteContractEncodeObject } from 'cosmwasm';
import { toStars } from '../src/utils';
import { getClient } from '../src/client';
import { toUtf8 } from '@cosmjs/encoding';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';
import { assertIsDeliverTxSuccess } from '@cosmjs/stargate';

const config = require('../config');

async function addFile() {
  const __dirname = process.cwd();
  const csvFilePath = path.resolve(__dirname, './owner_nft_count.csv');
  const headers = ['address', 'mint_count'];
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
  const wl_entries: Array<Member> = [];
  const validated_wl_entries: Array<Member> = [];
  const client = await getClient();
  const account = toStars(config.account);
  const whitelistContract = toStars(config.whitelistContract);
  if (!config.minter) {
    throw Error(
      '"minter" must be set to a minter contract address in config.js'
    );
  }
  await parse(
    fileContent,
    {
      delimiter: ',',
      columns: headers,
    },
    async (error, fileContents: Member[]) => {
      if (error) {
        throw error;
      }
      fileContents.map((row) =>
        wl_entries.push({ address: row.address, mint_count: row.mint_count })
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

      let count = 1;
      let addMembers: Array<Member> = [];

      // make msg to add members
      const msg = {
        add_members: {
          to_add: [validated_wl_entries[0]],
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

      addMembers = [];

      //   for (const idx in validated_wl_entries) {
      //     addMembers.push({
      //       address: validated_wl_entries[idx].address,
      //       mint_count: validated_wl_entries[idx].mint_count,
      //     });
      //     // console.log(validated_wl_entries[idx]);
      //     // if (count % 50 == 0) {
      //     const msg: ExecuteMsg = {
      //       add_members: { to_add: addMembers },
      //     };
      //     console.log(JSON.stringify(msg, null, 2));
      //   }
    }
  );
}

addFile();
