// Simple upload 500 addresses and per address limit to whitelist-flexible using owner_nft_count.csv.
// Accepts cosmos, stars addresses.
// If you run into an error with `member_limit`, run `yarn whitelist --increase-member-limit`

import {
  ExecuteMsg,
  Member,
} from '@stargazezone/launchpad/src/WhitelistFlex.types';
// import { ExecuteMsg } from '@stargazezone/types/contracts/whitelist-flexible/execute_msg';
import { MsgExecuteContractEncodeObject } from 'cosmwasm';
import { toStars } from '../src/utils';
import inquirer from 'inquirer';
import { getClient } from '../src/client';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { toUtf8 } from '@cosmjs/encoding';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';
import { assertIsDeliverTxSuccess } from '@cosmjs/stargate';

const config = require('../config');
const MSG_ADD_ADDR_LIMIT = 500;

async function addFile() {
  const __dirname = process.cwd();
  const csvFilePath = path.resolve(__dirname, './owner_nft_count.csv');
  const headers = ['address', 'mint_count'];
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
  const wl_entries: Array<Member> = [];
  const validated_wl_entries: Array<Member> = [];
  const client = await getClient();
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
      console.log(wl_entries);

      wl_entries.forEach((wl_entry) => {
        validated_wl_entries.push({
          address: toStars(wl_entry.address),
          mint_count: wl_entry.mint_count,
        });
      });
    }
  );

  console.log(
    'Whitelist addresses validated and deduped. member number: ' +
      validated_wl_entries.length
  );

  const msg: ExecuteMsg = {
    add_members: { to_add: validated_wl_entries },
  };
  const executeContractMsg: MsgExecuteContractEncodeObject = {
    typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
    value: MsgExecuteContract.fromPartial({
      sender: config.account,
      contract: config.whitelistContract,
      msg: toUtf8(JSON.stringify(msg)),
      funds: [],
    }),
  };

  // Get confirmation before preceding
  console.log(
    'Please confirm the settings for adding whitelist file. THERE IS NO WAY TO UPDATE THIS ONCE IT IS ON CHAIN.'
  );
  console.log(JSON.stringify(msg, null, 2));
  const answer = await inquirer.prompt([
    {
      message: 'Ready to submit the transaction?',
      name: 'confirmation',
      type: 'confirm',
    },
  ]);
  if (!answer.confirmation) return;

  const result = await client.signAndBroadcast(
    config.account,
    [executeContractMsg],
    'auto',
    'batch add addrs to whitelist'
  );
  assertIsDeliverTxSuccess(result);

  console.log('Tx hash: ', result.transactionHash);
  let res = await client.queryContractSmart(config.whitelistContract, {
    members: { limit: 100 },
  });
  console.log('first 100 members:', res);
}

addFile();
