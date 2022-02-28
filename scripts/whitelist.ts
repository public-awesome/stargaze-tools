import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { calculateFee, coins, GasPrice } from '@cosmjs/stargate';

const config = require('./config');
const { toStars } = require('./src/utils');
const WHITELIST_CREATION_FEE = coins('100000000', 'ustars');

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
  const whitelist =
    config.whitelist.length > 0
      ? (function (tmpWhitelist: Array<string> = config.whitelist) {
          tmpWhitelist.forEach(function (addr, index) {
            tmpWhitelist[index] = toStars(addr);
          });
          return tmpWhitelist;
        })()
      : null;

  const instantiateFee = calculateFee(950_000, gasPrice);

  const whitelistStartTime: Expiration = {
    at_time:
      // time expressed in nanoseconds (1 millionth of a millisecond)
      (new Date(config.whitelistStartTime).getTime() * 1_000_000).toString(),
  };
  //   console.log('whitelist start time: ' + whitelistStartTime?.at_time);
  const whitelistEndTime: Expiration = {
    at_time:
      // time expressed in nanoseconds (1 millionth of a millisecond)
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

const args = process.argv.slice(6);
// console.log(args);
if (args.length == 0) {
  await init();
} else if (args.length == 2 && args[0] == '--add') {
  await add(args[1]);
} else {
  console.log('Invalid arguments');
}
