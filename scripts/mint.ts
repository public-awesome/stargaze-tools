import { MsgExecuteContractEncodeObject, coins, toUtf8 } from 'cosmwasm';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { getClient } from '../src/client';
import { toStars } from '../src/utils';

const config = require('../config');

async function test_whitelist() {
  const client = await getClient();

  const starsRecipient = toStars(config.account);
  console.log('whitelist mint: ', starsRecipient);

  const mintFee = coins((config.whitelistPrice * 1000000).toString(), 'ustars');
  const msg = { mint: {} };
  console.log(JSON.stringify(msg, null, 2));

  const result = await client.execute(
    config.account,
    config.minter,
    msg,
    'auto',
    'mint',
    mintFee
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

async function mintTo(recipient: string) {
  const client = await getClient();

  const starsRecipient = toStars(recipient);
  console.log('Minter contract: ', config.minter);
  console.log('Minting to: ', starsRecipient);

  const msg = { mint_to: { recipient: starsRecipient } };
  console.log(JSON.stringify(msg, null, 2));

  const result = await client.execute(
    config.account,
    config.minter,
    msg,
    'auto',
    'mint to'
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

async function batchMint(recipient: string, num: number) {
  const client = await getClient();

  const starsRecipient = toStars(recipient);
  console.log('Minter contract: ', config.minter);
  console.log('Minting ' + num + ' tokens to:', starsRecipient);

  const msg = { mint_to: { recipient: starsRecipient } };

  const executeContractMsg: MsgExecuteContractEncodeObject = {
    typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
    value: MsgExecuteContract.fromPartial({
      sender: config.account,
      contract: config.minter,
      msg: toUtf8(JSON.stringify(msg)),
      funds: [...[]],
    }),
  };

  const result = await client.signAndBroadcast(
    config.account,
    Array(num).fill(executeContractMsg),
    'auto',
    'batch mint'
  );

  console.log('Tx hash: ', result.transactionHash);
}

async function mintFor(tokenId: string, recipient: string) {
  const client = await getClient();

  const starsRecipient = toStars(recipient);
  console.log('Minter contract: ', config.minter);
  console.log('Minting token ' + tokenId + ' for', starsRecipient);

  const msg = {
    mint_for: { token_id: Number(tokenId), recipient: starsRecipient },
  };
  console.log(JSON.stringify(msg, null, 2));

  const result = await client.execute(
    config.account,
    config.minter,
    msg,
    'auto',
    'mint for'
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

async function mintForRange(tokenIdRange: string, recipient: string) {
  const starsRecipient = toStars(recipient);

  // Parse string from "1,10" -> "1" and "10"
  const [start, end] = tokenIdRange.split(',').map(Number);

  const client = await getClient();
  const configResponse = await client.queryContractSmart(config.minter, { config: {} });

  // Verify proper range
  if (isNaN(start) || isNaN(end) || start > end) throw new Error("Invalid range");
  if (start < 1) throw new Error("Start ID out of bounds");
  if (end > configResponse.num_tokens) throw new Error("End ID out of bounds");

  console.log('Minting tokens', start + '-' + end, 'for', starsRecipient);

  // Loop through range and generate contract messages.
  let msgArray = new Array();
  for (let i = start; i <= end; i++) {
    let msg = {
      mint_for: { token_id: i, recipient: starsRecipient },
    };
    let executeContractMsg: MsgExecuteContractEncodeObject = {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: config.account,
        contract: config.minter,
        msg: toUtf8(JSON.stringify(msg)),
        funds: [],
      }),
    };
    msgArray.push(executeContractMsg);
  }

  // Execute all messages.
  const result = await client.signAndBroadcast(
    config.account,
    msgArray,
    'auto',
    'batch mint for'
  );
  console.log('Tx hash: ', result.transactionHash);
}

const args = process.argv.slice(2);
if (args.length == 0) {
  console.log('No arguments provided, need --to or --for');
} else if (args.length == 1 && args[0] == '--test-whitelist') {
  test_whitelist();
} else if (args.length == 2 && args[0] == '--to') {
  mintTo(args[1]);
} else if (args.length == 4 && args[0] == '--to') {
  if (args[2] == '--batch') {
    batchMint(args[1], +args[3]);
  } else {
    console.log('Invalid arguments');
  }
} else if (args.length == 3 && args[0] == '--for') {
  mintFor(args[1], args[2]);
} else if (args.length == 3 && args[0] == '--range') {
  mintForRange(args[1], args[2]);
} else {
  console.log('Invalid arguments');
}
