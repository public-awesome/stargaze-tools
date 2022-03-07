import {
  SigningCosmWasmClient,
  MsgExecuteContractEncodeObject,
} from '@cosmjs/cosmwasm-stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { calculateFee, coins, GasPrice } from '@cosmjs/stargate';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { toUtf8 } from '@cosmjs/encoding';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

const config = require('./config');
const { toStars } = require('./src/utils');
const WHITELIST_CREATION_FEE = coins('100000000', 'ustars');
const MSG_ADD_ADDR_LIMIT = 500;

const gasPrice = GasPrice.fromString('0ustars');
const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
  prefix: 'stars',
});
const client = await SigningCosmWasmClient.connectWithSigner(
  config.rpcEndpoint,
  wallet
);

async function addFile() {
  type Whitelist = {
    address: string;
  };
  const __dirname = process.cwd();
  const csvFilePath = path.resolve(__dirname, './whitelist_addresses.csv');
  const headers = ['address'];
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
  let addrs: Array<string> = [];
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
          'Too many whitelist addrs added in a transaction. Max 1000 at a time.'
        );
      }
      console.log(
        'Whitelist addresses validated and deduped. member number: ' +
          uniqueValidatedAddrs.length
      );
      const chunkedAddrs = await splitAddrs(
        uniqueValidatedAddrs,
        MSG_ADD_ADDR_LIMIT
      );

      let executeContractMsgs: Array<MsgExecuteContractEncodeObject> = [];
      chunkedAddrs.forEach((addrs: Array<string>) => {
        const addAddrsMsg = { update_members: { add: addrs, remove: [] } };
        const executeContractMsg: MsgExecuteContractEncodeObject = {
          typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
          value: MsgExecuteContract.fromPartial({
            sender: config.account,
            contract: config.whitelistContract,
            msg: toUtf8(JSON.stringify(addAddrsMsg)),
            funds: [...[]],
          }),
        };
        executeContractMsgs.push(executeContractMsg);
      });
      const result = await client.signAndBroadcast(
        config.account,
        executeContractMsgs,
        calculateFee(2_000_000 * executeContractMsgs.length, gasPrice),
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

async function splitAddrs(addrs: Array<string>, size: number) {
  let newArr: Array<Array<string>> = [];
  for (let i = 0; i < addrs.length; i += size) {
    const sliceAddrs = addrs.slice(i, i + size);
    newArr.push(sliceAddrs);
  }
  return newArr;
}

addFile();
