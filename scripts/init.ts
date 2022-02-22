import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { calculateFee, coins, GasPrice } from '@cosmjs/stargate';
import { toStars } from '../src/utils';

const config = require('./config');
const MINT_FEE = coins('100000000', 'ustars');

export declare type Expiration = {
  readonly at_time: string;
};

function isValidHttpUrl(uri: string) {
  let url;

  try {
    url = new URL(uri);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

function isValidIpfsUrl(uri: string) {
  let url;

  try {
    url = new URL(uri);
  } catch (_) {
    return false;
  }

  return url.protocol === 'ipfs:';
}

async function main() {
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

  if (!isValidIpfsUrl(config.baseTokenUri)) {
    throw new Error('Invalid base token URI');
  }

  if (config.numTokens > 10_000) {
    throw new Error('Too many tokens');
  }

  const whitelist =
    config.whitelist.length > 0
      ? (function (tmpWhitelist: Array<string> = config.whitelist) {
          tmpWhitelist.forEach(function (addr, index) {
            tmpWhitelist[index] = toStars(addr);
          });
          return tmpWhitelist;
        })()
      : null;

  const startTime: Expiration | null =
    config.startTime == ''
      ? null
      : {
          at_time:
            // time expressed in nanoseconds (1 millionth of a millisecond)
            (
              new Date(config.startTime).getTime() * 1_000_000
            ).toString(),
        };

  const whitelistEndTime: Expiration | null =
    config.whitelistEndTime == ''
      ? null
      : {
          // time expressed in nanoseconds (1 millionth of a millisecond)
          at_time: (
            new Date(config.whitelistEndTime).getTime() * 1_000_000
          ).toString(),
        };

  const instantiateFee = calculateFee(950_000, gasPrice);

  const msg = {
    base_token_uri: config.baseTokenUri,
    num_tokens: config.numTokens,
    sg721_code_id: config.sg721CodeId,
    sg721_instantiate_msg: {
      name: config.name,
      symbol: config.symbol,
      minter: config.account,
      config: {
        contract_uri: config.contractUri,
        creator: config.account,
        royalties: {
          payment_address: config.royaltyAddress,
          share: config.royaltyShare,
        },
      },
    },
    whitelist_addresses: whitelist,
    whitelist_expiration: whitelistEndTime,
    start_time: startTime,
    unit_price: {
      amount: (config.unitPrice * 1000000).toString(),
      denom: 'ustars',
    },
  };

  if (!msg.sg721_instantiate_msg.config.royalties) {
    console.log('Instantiating with royalties');
  } else {
    msg.sg721_instantiate_msg.config.royalties = undefined;
  }

  const result = await client.instantiate(
    config.account,
    config.minterCodeId,
    msg,
    config.name,
    instantiateFee,
    { funds: MINT_FEE }
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

await main();
