import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { calculateFee, coins, GasPrice } from '@cosmjs/stargate';

const config = require('./config');

async function main(numMints: string) {
  const gasPrice = GasPrice.fromString('0ustars');
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
    prefix: 'stars',
  });
  const client = await SigningCosmWasmClient.connectWithSigner(
    config.rpcEndpoint,
    wallet
  );
  const executeFee = calculateFee(900_000, gasPrice);
  const result = await client.execute(
    config.account,
    config.minter,
    { batch_mint: { num_mints: Number(numMints) } },
    executeFee,
    'batch mint',
    coins('100000000', 'ustars')
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}
const args = process.argv.slice(6);
await main(args[0]);
