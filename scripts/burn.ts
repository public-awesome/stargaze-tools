import { getClient } from '../src/client';
import { toStars } from '../src/utils';
import inquirer from 'inquirer';

const config = require('../config');

async function burn_token(tokenId: string) {
  const client = await getClient();
  const account = toStars(config.account);
  const minter = toStars(config.minter);
  const configResponse = await client.queryContractSmart(minter, {
    config: {},
  });
  const sg721 = configResponse.sg721_address;

  const msg = { burn: { token_id: tokenId } };
  console.log(JSON.stringify(msg, null, 2));
  console.log(
    'Please confirm burning token id',
    tokenId,
    'for sg721 collection address',
    sg721,
    '. THERE IS NO WAY TO REVERSE THIS ONCE IT IS ON CHAIN.'
  );
  const answer = await inquirer.prompt([
    {
      message: 'Ready to permanently burn token?',
      name: 'confirmation',
      type: 'confirm',
    },
  ]);
  if (!answer.confirmation) return;

  const result = await client.execute(account, sg721, msg, 'auto', 'burn');
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

const args = process.argv.slice(2);
if (args.length == 0) {
  console.log('No arguments provided, need token id');
} else if (args.length == 1) {
  burn_token(args[0]);
} else {
  console.log('Invalid arguments');
}
