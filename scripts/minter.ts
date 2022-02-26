import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { calculateFee, coins, GasPrice } from '@cosmjs/stargate';

const config = require('./config');
const { isValidHttpUrl } = require('./src/utils');

const NEW_COLLECTION_FEE = coins('1000000000', 'ustars');
const gasPrice = GasPrice.fromString('0ustars');
const executeFee = calculateFee(300_000, gasPrice);

export declare type Expiration = {
  readonly at_time: string;
};

if (!isValidHttpUrl(config.rpcEndpoint)) {
  throw new Error('Invalid RPC endpoint');
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

function clean(obj: any) {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
}

async function init() {
  if (!isValidIpfsUrl(config.baseTokenUri)) {
    throw new Error('Invalid base token URI');
  }

  if (config.numTokens > 10_000) {
    throw new Error('Too many tokens');
  }

  if (!isValidIpfsUrl(config.contractUri)) {
    throw new Error('ContractUri is required');
  }

  const startTime: Expiration | null =
    config.startTime == ''
      ? null
      : {
          at_time:
            // time expressed in nanoseconds (1 millionth of a millisecond)
            (new Date(config.startTime).getTime() * 1_000_000).toString(),
        };

  const instantiateFee = calculateFee(950_000, gasPrice);

  const tempMsg = {
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
          payment_address: config.royaltyPaymentAddress,
          share: config.royaltyShare,
        },
      },
    },
    whitelist: config.whitelistContract,
    start_time: startTime,
    unit_price: {
      amount: (config.unitPrice * 1000000).toString(),
      denom: 'ustars',
    },
  };

  if (
    tempMsg.sg721_instantiate_msg.config.royalties.payment_address ===
      undefined &&
    tempMsg.sg721_instantiate_msg.config.royalties.share === undefined
  ) {
    tempMsg.sg721_instantiate_msg.config.royalties = null;
  }
  const msg = clean(tempMsg);

  // Check if Mnemonic is in config
  if (config.mnemonic && config.mnemonic !== '' && config.mnemonic !== null) {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
      prefix: 'stars',
    });

    const client = await SigningCosmWasmClient.connectWithSigner(
      config.rpcEndpoint,
      wallet
    );

    console.log(JSON.stringify(msg, null, 2));

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
  } else {
    console.log(JSON.stringify(msg, null, 2));
  }
}

async function setWhitelist(whitelist: string) {
  // Check if Mnemonic is in config
  if (config.mnemonic && config.mnemonic !== '' && config.mnemonic !== null) {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
      prefix: 'stars',
    });

    const client = await SigningCosmWasmClient.connectWithSigner(
      config.rpcEndpoint,
      wallet
    );

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
  } else {
    throw Error('This feature requires setting a Mnemonic in config.js');
  }
}

const args = process.argv.slice(6);
if (args.length == 0) {
  await init();
} else if (args.length == 2 && args[0] == '--whitelist') {
  await setWhitelist(args[1]);
} else {
  console.log('Invalid arguments');
}
