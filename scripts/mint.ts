import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { calculateFee, coins, GasPrice } from '@cosmjs/stargate';
const { toStars } = require('./src/utils');

const config = require('./config');
const gasPrice = GasPrice.fromString('0ustars');
const executeFee = calculateFee(300_000, gasPrice);

const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
  prefix: 'stars',
});
const client = await SigningCosmWasmClient.connectWithSigner(
  config.rpcEndpoint,
  wallet
);

async function mintTo(recipient: string) {
  const starsRecipient = toStars(recipient);
  console.log('Minting to: ', starsRecipient);

  const msg = { mint_to: { recipient: starsRecipient } };
  console.log(msg);

  const result = await client.execute(
    config.account,
    config.minter,
    msg,
    executeFee,
    'mint to'
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

async function mintFor(tokenId: string, recipient: string) {
  const starsRecipient = toStars(recipient);
  console.log('Minting token ' + tokenId + ' for', starsRecipient);

  const msg = {
    mint_for: { token_id: Number(tokenId), recipient: starsRecipient },
  };
  console.log(msg);

  const result = await client.execute(
    config.account,
    config.minter,
    msg,
    executeFee,
    'mint for'
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

const args = process.argv.slice(6);
// console.log(args);
if (args.length == 0) {
  console.log('No arguments provided, need --to or --for');
} else if (args.length == 2 && args[0] == '--to') {
  await mintTo(args[1]);
} else if (args.length == 3 && args[0] == '--for') {
  await mintFor(args[1], args[2]);
} else {
  console.log('Invalid arguments');
}
