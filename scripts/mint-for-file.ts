// Airdrop specific NFTs to recipient addresses using snapshot.csv

// Requires snapshot.csv with "token_id" and "address" columns
// Requires account have all the token-ids or it will error out
// Best used with vending-snapshot.ts to generate snapshot.csv
// Cycles through token ids and addresses to construct an array of messages to be broadcast

// Accepts cosmos, stars addresses.

import {
  calculateFee,
  coin,
  GasPrice,
  MsgExecuteContractEncodeObject,
} from 'cosmwasm';
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
const AIRDROP_FEE = [coin('0', 'ustars')];

async function batch_mint_for() {
  interface AirdropData {
    token_id: number;
    address: string;
  }
  const __dirname = process.cwd();
  const csvFilePath = path.resolve(__dirname, './snapshot.csv');
  const headers = ['token_id', 'address'];
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
  const tokens: Array<number> = [];
  const addrs: Array<string> = [];
  const executeContractMsgs: Array<MsgExecuteContractEncodeObject> = [];
  const client = await getClient();
  if (!config.minter) {
    throw Error(
      '"minter" must be set to a minter contract address in config.js'
    );
  }
  const funds: never[] = [];
  parse(
    fileContent,
    {
      delimiter: ',',
      columns: headers,
    },
    async (error, fileContents: AirdropData[]) => {
      if (error) {
        throw error;
      }
      fileContents.map((row) => tokens.push(row.token_id));
      fileContents.map((row) => addrs.push(row.address));
      console.log(tokens);
      console.log(addrs);

      if (tokens.length > MSG_AIRDROP_LIMIT) {
        throw Error(
          'Airdrop limit is 500. Please reduce the number of rows in snapshot.csv'
        );
      }
      const validatedAddrs: Array<string> = [];
      addrs.forEach((addr) => {
        validatedAddrs.push(toStars(addr));
      });

      for (const idx in addrs) {
        console.log(
          'mint for token id',
          tokens[idx],
          'to recipient address: ',
          addrs[idx]
        );
        const msg = {
          mint_for: { token_id: Number(tokens[idx]), recipient: addrs[idx] },
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
        // handle 0ustars airdrop fee
        if (AIRDROP_FEE[0].amount !== '0') {
          executeContractMsg.value.funds = AIRDROP_FEE;
        }
        executeContractMsgs.push(executeContractMsg);
      }

      // Get confirmation before preceding
      console.log(
        'WARNING: Batch mint_for is not reversible. Please confirm the settings to mint_for specific tokens to addresses. THERE IS NO WAY TO UNDO THIS ONCE IT IS ON CHAIN.'
      );
      console.log(JSON.stringify(executeContractMsgs, null, 2));
      const answer = await inquirer.prompt([
        {
          message: 'Ready to submit the transaction?',
          name: 'confirmation',
          type: 'confirm',
        },
      ]);
      if (!answer.confirmation) return;

      const gasPrice = GasPrice.fromString('0ustars');
      const executeFee = calculateFee(50_000_000, gasPrice);
      const result = await client.signAndBroadcast(
        config.account,
        executeContractMsgs,
        executeFee,
        'batch mint_for'
      );

      assertIsDeliverTxSuccess(result);
      console.log('Tx hash: ', result.transactionHash);
    }
  );
}

batch_mint_for();
