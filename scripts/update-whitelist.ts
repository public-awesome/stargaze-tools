// add and remove must be comma delimited strings
//-----------------------------------------------

import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { calculateFee, coins, GasPrice } from '@cosmjs/stargate';

const config = require('./config');

async function updateWhitelist(add: string, remove: string) {
  const add_addresses = add == '' ? null : add.split(',');
  const remove_addresses = remove == '' ? null : remove.split(',');
  if (add_addresses != null) {
    console.log('add addresses: ', add_addresses.join(','));
  }
  if (remove_addresses != null) {
    console.log('remove addresses: ', remove_addresses.join(','));
  }

  const gasPrice = GasPrice.fromString('0stars');
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    config.mnemonic,
    {
      prefix: 'stars',
    },
  );
  const client = await SigningCosmWasmClient.connectWithSigner(
    config.rpcEndpoint,
    wallet,
  );
  const executeFee = calculateFee(300_000, gasPrice);
  const result = await client.execute(
    config.account,
    config.minter,
    {
      update_whitelist: {
        add_addresses: add_addresses,
        remove_addresses: remove_addresses,
      },
    },
    executeFee,
    'update whitelist',
  );
  const wasmEvent = result.logs[0].events.find(
    (e) => e.type === 'wasm',
  );
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent,
  );

  let res = await client.queryContractSmart(config.minter, {
    whitelist_addresses: {},
  });
  console.log(res);
}

// yarn run add-whitelist ['stars10w5eulj60qp3cfqa0hkmke78qdy2feq6x9xdmd'] ['stars1c0d5qjavfkd7y4rcs9wa3s8w8l6e2dt58elscj']

const args = process.argv.slice(6);
console.log(args);
if (args.length == 0) {
  console.log(
    'Invalid arguments. did you mean --add, --remove, or --update ?',
  );
} else if (args.length == 2 && args[0] == '--add') {
  await updateWhitelist(args[1], '');
} else if (args.length == 2 && args[0] == '--remove') {
  await updateWhitelist('', args[1]);
} else if (args.length == 3 && args[0] == '--update') {
  await updateWhitelist(args[1], args[2]);
} else {
  console.log('Invalid arguments');
}
