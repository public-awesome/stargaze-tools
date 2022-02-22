// add and remove must be comma delimited strings
//-----------------------------------------------

import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { calculateFee, coins, GasPrice } from '@cosmjs/stargate';
import { toStars } from '../src/utils';

const config = require('./config');

async function updateWhitelist(add: string, remove: string) {
  const addAddresses = add == '' ? null : add.split(',');
  const removeAddresses = remove == '' ? null : remove.split(',');
  if (addAddresses != null) {
    addAddresses.forEach(function (addr, index) {
      addAddresses[index] = toStars(addr);
    });
    console.log('add addresses: ', addAddresses.join(','));
  }
  if (removeAddresses != null) {
    removeAddresses.forEach(function (addr, index) {
      removeAddresses[index] = toStars(addr);
    });
    console.log('remove addresses: ', removeAddresses.join(','));
  }

  const gasPrice = GasPrice.fromString('0stars');
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
    prefix: 'stars',
  });
  const client = await SigningCosmWasmClient.connectWithSigner(
    config.rpcEndpoint,
    wallet
  );
  const executeFee = calculateFee(600_000, gasPrice);
  const result = await client.execute(
    config.account,
    config.minter,
    {
      update_whitelist: {
        add_addresses: addAddresses,
        remove_addresses: removeAddresses,
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

  let res = await client.queryContractSmart(config.minter, {
    whitelist_addresses: {},
  });
  console.log(res);
}

const args = process.argv.slice(6);
if (args.length == 0) {
  console.log('Invalid arguments. did you mean --add or --remove');
} else if (args.length == 2 && args[0] == '--add') {
  await updateWhitelist(args[1], '');
} else if (args.length == 2 && args[0] == '--remove') {
  await updateWhitelist('', args[1]);
} else {
  console.log('Invalid arguments');
}
