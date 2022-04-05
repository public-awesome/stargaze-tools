// Simple upload 500 addresses to airdrop using airdrop_addresses.csv.
// Accepts cosmos, stars addresses.
// this does a series of mint_to tx

import { ExecuteMsg } from '@stargazezone/types/contracts/minter/execute_msg';
import { coin, MsgExecuteContractEncodeObject } from 'cosmwasm';
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
const MSG_AIRDROP_LIMIT = 500;

async function addFile() {
  interface Airdrop {
    address: string;
  }
  const __dirname = process.cwd();
  const csvFilePath = path.resolve(__dirname, './airdrop_addresses.csv');
  const headers = ['address'];
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
  const addrs: Array<string> = [];
  const executeContractMsgs: Array<MsgExecuteContractEncodeObject> = [];
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
    async (error, fileContents: Airdrop[]) => {
      if (error) {
        throw error;
      }
      fileContents.map((row) => addrs.push(row.address));
      console.log(addrs);

      const validatedAddrs: Array<string> = [];
      addrs.forEach((addr) => {
        validatedAddrs.push(toStars(addr));
      });
      let uniqueValidatedAddrs = [...new Set(validatedAddrs)].sort();
      if (uniqueValidatedAddrs.length > MSG_AIRDROP_LIMIT) {
        throw new Error(
          'Too many addrs added in a transaction. Max ' +
            MSG_AIRDROP_LIMIT +
            ' at a time.'
        );
      }
      console.log(
        'Airdrop addresses validated and deduped. count: ' +
          uniqueValidatedAddrs.length
      );

      const msg: ExecuteMsg = {
        // TODO iterate through addrs
        mint_to: { recipient: uniqueValidatedAddrs[0] },
      };
      const executeContractMsg: MsgExecuteContractEncodeObject = {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: config.account,
          contract: config.minter,
          msg: toUtf8(JSON.stringify(msg)),
          funds: [],
        }),
      };

      executeContractMsgs.push(executeContractMsg);

      // Get confirmation before preceding
      console.log(
        'Please confirm the settings for airdropping to addresses. THERE IS NO WAY TO UNDO THIS ONCE IT IS ON CHAIN.'
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
        executeContractMsgs,
        'auto',
        'batch mint_to'
      );
      assertIsDeliverTxSuccess(result);

      console.log('Tx hash: ', result.transactionHash);
      let res = await client.queryContractSmart(config.minter, {
        mintable_num_tokens: {},
      });
      console.log('mintable num tokens:', res);
    }
  );
}

addFile();
