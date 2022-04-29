import { MsgExecuteContractEncodeObject, coins, toUtf8 } from 'cosmwasm';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { getClient } from '../src/client';
import { toStars } from '../src/utils';

const config = require('../config');

async function burn_token(token: string) {
  const client = await getClient();

  console.log('SG721: ', config.sg721);
  console.log('Burning Token: ', token);

  const msg = { burn: { token_id: token } };
  console.log(JSON.stringify(msg, null, 2));

  const result = await client.execute(
    config.account,
    config.sg721,
    msg,
    'auto',
    'burn'
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

const args = process.argv.slice(2);
if (args.length == 0) {
  console.log('No arguments provided, need token to burn');
} else if (args.length == 1) {
  burn_token(args[0]);
}  else {
  console.log('Invalid arguments');
}
