import { MsgExecuteContractEncodeObject, coins, toUtf8 } from 'cosmwasm';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { getClient } from '../src/client';
import { toStars } from '../src/utils';

const config = require('../config');

const SHUFFLE_FEE = coins('5000', 'ustars');

async function shuffle() {
  const client = await getClient();

  const starsRecipient = toStars(config.account);
  console.log('shuffle minter: ', starsRecipient);

  const msg = { shuffle: {} };
  console.log(JSON.stringify(msg, null, 2));

  const result = await client.execute(
    config.account,
    config.minter,
    msg,
    'auto',
    'shuffle',
    SHUFFLE_FEE
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

const args = process.argv.slice(2);
if (args.length == 0) {
  shuffle();
} else {
  console.log('Invalid arguments');
}
