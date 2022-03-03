import {
  SigningCosmWasmClient,
  MsgExecuteContractEncodeObject,
} from '@cosmjs/cosmwasm-stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { calculateFee, coins, GasPrice } from '@cosmjs/stargate';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { toUtf8 } from '@cosmjs/encoding';

const csv = require('csv-parser');
const fs = require('fs');
const config = require('./config');
const { toStars } = require('./src/utils');
const WHITELIST_CREATION_FEE = coins('100000000', 'ustars');
const MSG_ADD_ADDR_LIMIT = 50;

const gasPrice = GasPrice.fromString('0ustars');
const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
  prefix: 'stars',
});
const client = await SigningCosmWasmClient.connectWithSigner(
  config.rpcEndpoint,
  wallet
);
export declare type Expiration = {
  readonly at_time: string;
};

async function init() {
  if (!config.whitelistStartTime || config.whitelistStartTime == '') {
    throw new Error('invalid whitelistStartTime');
  }
  if (!config.whitelistEndTime || config.whitelistEndTime == '') {
    throw new Error('invalid whitelistEndTime');
  }
  if (
    !config.whitelistPerAddressLimit ||
    config.whitelistPerAddressLimit <= 0
  ) {
    throw new Error('invalid whitelistPerAddressLimit in config.js');
  }

  // Whitelist can start with empty values and added later
  let whitelist = config.whitelist || [];
  whitelist =
    whitelist.length > 0
      ? (function (tmpWhitelist: Array<string> = config.whitelist) {
          tmpWhitelist.forEach(function (addr, index) {
            tmpWhitelist[index] = toStars(addr);
          });
          return tmpWhitelist;
        })()
      : [];

  const instantiateFee = calculateFee(950_000, gasPrice);

  const whitelistStartTime: Expiration = {
    at_time:
      // Time expressed in nanoseconds (1 millionth of a millisecond)
      (new Date(config.whitelistStartTime).getTime() * 1_000_000).toString(),
  };
  //   console.log('whitelist start time: ' + whitelistStartTime?.at_time);
  const whitelistEndTime: Expiration = {
    at_time:
      // Time expressed in nanoseconds (1 millionth of a millisecond)
      (new Date(config.whitelistEndTime).getTime() * 1_000_000).toString(),
  };

  const msg = {
    members: whitelist,
    start_time: whitelistStartTime,
    end_time: whitelistEndTime,
    unit_price: {
      amount: (config.whitelistPrice * 1000000).toString(),
      denom: 'ustars',
    },
    per_address_limit: config.whitelistPerAddressLimit,
  };

  console.log('Instantiating whitelist...');

  const result = await client.instantiate(
    config.account,
    config.whitelistCodeId,
    msg,
    'whitelist',
    instantiateFee,
    { funds: WHITELIST_CREATION_FEE }
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

async function add(add: string) {
  const addAddresses = add == '' ? null : add.split(',');
  if (addAddresses != null) {
    addAddresses.forEach(function (addr, index) {
      addAddresses[index] = toStars(addr);
    });
    console.log('add addresses: ', addAddresses.join(','));
  }

  const executeFee = calculateFee(600_000, gasPrice);
  const result = await client.execute(
    config.account,
    config.whitelistContract,
    {
      update_members: {
        add: addAddresses,
        remove: [],
      },
    },
    executeFee,
    'update whitelist'
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );

  let res = await client.queryContractSmart(config.whitelistContract, {
    members: {},
  });
  console.log(res);
}

async function addFile() {
  // Open addresses.csv, import list of addresses
  const results: string[] = [];

  fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (data: string) => results.push(data))
    .on('end', () => {
      console.log(results);
    });

  //   const addrs: Array<string> = [
  //     'stars15prsrqly5clpx0pshr5mp8qsurnrczx8w4l9fm',
  //     'stars1qgvetk44zx8w5ww7vvug5zvp05ds93l82sr3lw',
  //     'stars1njygkj045y30mqe369hrheelfkcgzx06aw0xrp',
  //     'stars17f38ffw3jks2gyfz6ka46p390c9vk7d2tzvv7r',
  //   ];
  //   let validatedAddrs: Array<string> = [];
  //   addrs.forEach((addr) => {
  //     validatedAddrs.push(toStars(addr));
  //   });
  //   let uniqueValidatedAddrs = [...new Set(validatedAddrs)];
  //   if (uniqueValidatedAddrs.length > 1000) {
  //     throw new Error(
  //       'Too many whitelist addrs added in a transaction. Max 500.'
  //     );
  //   }
  //   console.log(
  //     'Whitelist addresses validated and deduped. member number: ' +
  //       uniqueValidatedAddrs.length
  //   );

  //   // Create msgs and batch MSG_ADD_ADDR_LIMIT msgs per tx
  //   const chunkedAddrs = await splitAddrs(
  //     uniqueValidatedAddrs,
  //     MSG_ADD_ADDR_LIMIT
  //   );
  //   let executeContractMsgs: Array<MsgExecuteContractEncodeObject> = [];
  //   chunkedAddrs.forEach((addrs: Array<string>) => {
  //     const addAddrsMsg = { update_members: { add: addrs, remove: [] } };
  //     const executeContractMsg: MsgExecuteContractEncodeObject = {
  //       typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
  //       value: MsgExecuteContract.fromPartial({
  //         sender: config.account,
  //         contract: config.whitelistContract,
  //         msg: toUtf8(JSON.stringify(addAddrsMsg)),
  //         funds: [...[]],
  //       }),
  //     };
  //     executeContractMsgs.push(executeContractMsg);
  //     });

  //   const result = await client.signAndBroadcast(
  //     config.account,
  //     executeContractMsgs,
  //     calculateFee(200_000 * executeContractMsgs.length, gasPrice),
  //     'batch add addrs to whitelist'
  //   );

  //   console.log('Tx hash: ', result.transactionHash);

  //   let res = await client.queryContractSmart(config.whitelistContract, {
  //     members: {},
  //   });
  //   console.log(res);
}

async function showConfig() {
  let res = await client.queryContractSmart(config.whitelistContract, {
    config: {},
  });
  console.log(res);
}

async function splitAddrs(addrs: Array<string>, size: number) {
  let newArr: Array<Array<string>> = [];
  for (let i = 0; i < addrs.length; i += size) {
    const sliceAddrs = addrs.slice(i, i + size);
    newArr.push(sliceAddrs);
  }
  return newArr;
}

const args = process.argv.slice(6);
// console.log(args);
if (args.length == 0) {
  await init();
} else if (args.length == 2 && args[0] == '--add') {
  await add(args[1]);
} else if (args.length == 1 && args[0] == '--add-file') {
  await addFile();
} else if (args.length == 1 && args[0] == '--show-config') {
  await showConfig();
} else {
  console.log('Invalid arguments');
}
