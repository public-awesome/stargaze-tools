import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { calculateFee, GasPrice } from '@cosmjs/stargate';

const config = require('./config');
const { toStars } = require('./src/utils');

const gasPrice = GasPrice.fromString('0ustars');

const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
  prefix: 'stars',
});
const client = await SigningCosmWasmClient.connectWithSigner(
  config.rpcEndpoint,
  wallet
);

async function init() {
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

  const msg = {
    members: whitelist,
    end_time: config.endTime,
  };

  const result = await client.instantiate(
    config.account,
    config.whitelistCodeId,
    msg,
    'whitelist',
    instantiateFee
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
    config.minter,
    {
      update_whitelist: {
        add_addresses: addAddresses,
        remove_addresses: [],
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

  let res = await client.queryContractSmart(config.whitelist, {
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
