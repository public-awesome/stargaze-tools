import { MsgExecuteContractEncodeObject, coins, toUtf8 } from 'cosmwasm';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { getClient } from '../src/client';
import { toStars } from '../src/utils';

const config = require('../config');

async function shuffle() {
  const client = await getClient();
  //   const client = await CosmWasmClient.connect(config.rpcEndpoint);

  const shuffler = toStars(config.account);
  const minter = toStars(config.minter);
  console.log('shuffler address: ', shuffler);

  const shuffleFee = coins((500 * 1000000).toString(), 'ustars');
  const msg = { shuffle: {} };
  console.log(JSON.stringify(msg, null, 2));

  const response = await client.queryContractSmart(minter, {
    mintable_num_tokens: {},
  });
  console.log('mintable num tokens: ', response);

  const result = await client.execute(
    shuffler,
    minter,
    msg,
    'auto',
    'shuffle',
    shuffleFee
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

shuffle();
