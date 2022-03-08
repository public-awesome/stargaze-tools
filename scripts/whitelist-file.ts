import { ExecuteMsg } from '@stargazezone/types/contracts/whitelist/execute_msg';
import {
  coins,
  DirectSecp256k1HdWallet,
  GasPrice,
  MsgExecuteContractEncodeObject,
  SigningCosmWasmClient,
} from 'cosmwasm';
import { toStars } from '../src/utils';
import inquirer from 'inquirer';
import { getClient } from '../src/client';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { toUtf8 } from '@cosmjs/encoding';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

const config = require('../config');
const WHITELIST_CREATION_FEE = coins('100000000', 'ustars');
const MSG_ADD_ADDR_LIMIT = 500;

const gasPrice = GasPrice.fromString('0ustars');

async function addFile() {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
    prefix: 'stars',
  });

  type Whitelist = {
    address: string;
  };
  const __dirname = process.cwd();
  const csvFilePath = path.resolve(__dirname, './whitelist_addresses.csv');
  const headers = ['address'];
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
  let addrs: Array<string> = [];
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
    async (error, fileContents: Whitelist[]) => {
      if (error) {
        console.error(error);
      }
      fileContents.map((fileContents) => addrs.push(fileContents.address));
      console.log(addrs);

      let validatedAddrs: Array<string> = [];
      addrs.forEach((addr) => {
        validatedAddrs.push(toStars(addr));
      });
      let uniqueValidatedAddrs = [...new Set(validatedAddrs)];
      if (uniqueValidatedAddrs.length > 500) {
        throw new Error(
          'Too many whitelist addrs added in a transaction. Max ' +
            MSG_ADD_ADDR_LIMIT +
            ' at a time.'
        );
      }
      console.log(
        'Whitelist addresses validated and deduped. member number: ' +
          uniqueValidatedAddrs.length
      );

      const msg: ExecuteMsg = {
        add_members: { to_add: uniqueValidatedAddrs },
      };
      const executeContractMsg: MsgExecuteContractEncodeObject = {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: config.account,
          contract: config.whitelistContract,
          msg: toUtf8(JSON.stringify(msg)),
          funds: [...[]],
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

      console.log('Tx hash: ', result.transactionHash);
      let res = await client.queryContractSmart(config.whitelistContract, {
        members: {},
      });
      console.log(res);
    }
  );
}

addFile();
