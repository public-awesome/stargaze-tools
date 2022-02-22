import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { calculateFee, coins, GasPrice } from '@cosmjs/stargate';
import { toStars, isValidHttpUrl } from '../src/utils';

const config = require('./config');
const NEW_COLLECTION_FEE = coins('1000000000', 'ustars');
const gasPrice = GasPrice.fromString('0ustars');
const executeFee = calculateFee(300_000, gasPrice);

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

function isValidIpfsUrl(uri: string) {
  let url;

  try {
    url = new URL(uri);
  } catch (_) {
    return false;
  }

  return url.protocol === 'ipfs:';
}

async function init() {
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
    { funds: NEW_COLLECTION_FEE }
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

async function setWhitelist(whitelist: string) {
  console.log('Setting whitelist contract: ', whitelist);

  const msg = { set_whitelist: { whitelist } };
  console.log(msg);

  const result = await client.execute(
    config.account,
    config.minter,
    msg,
    executeFee,
    'set whitelist'
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
  await init();
} else if (args.length == 2 && args[0] == '--whitelist') {
  await setWhitelist(args[1]);
} else {
  console.log('Invalid arguments');
}
