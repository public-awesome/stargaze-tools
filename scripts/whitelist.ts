import {
  calculateFee,
  coins,
  GasPrice,
  DirectSecp256k1HdWallet,
  SigningCosmWasmClient,
} from 'cosmwasm';

const config = require('./config');
const { toStars } = require('./src/utils');
const WHITELIST_CREATION_FEE = coins('100000000', 'ustars');

const gasPrice = GasPrice.fromString('0ustars');
const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
  prefix: 'stars',
});
const client = await SigningCosmWasmClient.connectWithSigner(
  config.rpcEndpoint,
  wallet,
  { gasPrice }
);

export type Uint64 = string;
export type Timestamp = Uint64;

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

  // whitelist can start with empty values and added later
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

  // time expressed in nanoseconds (1 millionth of a millisecond)
  const whitelistStartTime: Timestamp = (
    new Date(config.whitelistStartTime).getTime() * 1_000_000
  ).toString();

  const whitelistEndTime: Timestamp = (
    new Date(config.whitelistEndTime).getTime() * 1_000_000
  ).toString();

  const msg = {
    members: whitelist,
    start_time: whitelistStartTime,
    end_time: whitelistEndTime,
    unit_price: {
      amount: (config.whitelistPrice * 1000000).toString(),
      denom: 'ustars',
    },
    per_address_limit: config.whitelistPerAddressLimit,
    member_limit: config.whitelistMemberLimit,
  };

  console.log('Instantiating whitelist...');

  const result = await client.instantiate(
    config.account,
    config.whitelistCodeId,
    msg,
    'whitelist',
    'auto',
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

  const result = await client.execute(
    config.account,
    config.whitelistContract,
    {
      add_members: {
        to_add: addAddresses,
      },
    },
    'auto',
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

async function showConfig() {
  let res = await client.queryContractSmart(config.whitelistContract, {
    config: {},
  });
  console.log(res);
}

const args = process.argv.slice(6);
// console.log(args);
if (args.length == 0) {
  await init();
} else if (args.length == 2 && args[0] == '--add') {
  await add(args[1]);
} else if (args.length == 1 && args[0] == '--show-config') {
  await showConfig();
} else {
  console.log('Invalid arguments');
}
