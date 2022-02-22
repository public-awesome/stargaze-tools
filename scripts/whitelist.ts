import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { calculateFee, GasPrice } from '@cosmjs/stargate';
import { toStars, isValidHttpUrl } from '../src/utils';

const config = require('./config');
const gasPrice = GasPrice.fromString('0ustars');
const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
  prefix: 'stars',
});
if (!isValidHttpUrl(config.rpcEndpoint)) {
  throw new Error('Invalid RPC endpoint');
}
const client = await SigningCosmWasmClient.connectWithSigner(
  config.rpcEndpoint,
  wallet
);

async function main() {
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

await main();
