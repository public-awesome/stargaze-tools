import { InstantiateMsg } from '@stargazezone/types/contracts/minter/instantiate_msg';
import { Timestamp } from '@stargazezone/types/contracts/minter/shared-types';
import { coins } from 'cosmwasm';
import inquirer from 'inquirer';
import { getClient } from '../src/client';
import { isValidHttpUrl } from '../src/utils';
import { toStars } from '../src/utils';

const config = require('../config');

const NEW_COLLECTION_FEE = coins('1000000000', 'ustars');

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

  if (!isValidIpfsUrl(config.image) && !isValidHttpUrl(config.image)) {
    throw new Error('Image link is not valid. Must be IPFS or http(s)');
  }

  if (config.numTokens > 10_000) {
    throw new Error('Too many tokens');
  }

  if (!config.perAddressLimit || config.perAddressLimit === 0) {
    throw new Error('perAddressLimit must be defined and greater than 0');
  }

  const client = await getClient();

  // time expressed in nanoseconds (1 millionth of a millisecond)
  const startTime: Timestamp = (
    new Date(config.startTime).getTime() * 1_000_000
  ).toString();

  const tempMsg: InstantiateMsg = {
    base_token_uri: config.baseTokenUri,
    num_tokens: config.numTokens,
    sg721_code_id: config.sg721CodeId,
    sg721_instantiate_msg: {
      name: config.name,
      symbol: config.symbol,
      minter: config.account,
      collection_info: {
        creator: config.account,
        description: config.description,
        image: config.image,
        external_link: config.external_link,
        royalty_info: {
          payment_address: config.royaltyPaymentAddress,
          share: config.royaltyShare,
        },
      },
    },
    per_address_limit: config.perAddressLimit,
    whitelist: config.whitelistContract,
    start_time: startTime,
    unit_price: {
      amount: (config.unitPrice * 1000000).toString(),
      denom: 'ustars',
    },
  };

  if (
    tempMsg.sg721_instantiate_msg.collection_info?.royalty_info
      ?.payment_address === undefined &&
    tempMsg.sg721_instantiate_msg.collection_info?.royalty_info?.share ===
      undefined
  ) {
    tempMsg.sg721_instantiate_msg.collection_info.royalty_info = null;
  }
  const msg = clean(tempMsg);

  // Get confirmation before preceding
  console.log(
    'Please confirm the settings for your minter and collection. THERE IS NO WAY TO UPDATE THIS ONCE IT IS ON CHAIN.'
  );
  console.log(JSON.stringify(msg, null, 2));
  const answer = await inquirer.prompt([
    {
      message: 'Ready to submit the transaction?',
      name: 'confirmation',
      type: 'confirm',
    },
  ]);
  if (!answer.confirmation) return;

  const result = await client.instantiate(
    config.account,
    config.minterCodeId,
    msg,
    config.name,
    'auto',
    { funds: NEW_COLLECTION_FEE, admin: config.account }
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

async function setWhitelist(whitelist: string) {
  const client = await getClient();
  const account = toStars(config.account);
  const minter = toStars(config.minter);
  const whitelistContract = toStars(whitelist);

  if (!minter) {
    throw Error(
      '"minter" must be set to a minter contract address in config.js'
    );
  }

  console.log('Minter contract: ', config.minter);
  console.log('Setting whitelist contract: ', whitelistContract);

  const msg = { set_whitelist: { whitelistContract } };
  console.log(msg);
  const answer = await inquirer.prompt([
    {
      message: 'Ready to submit the transaction?',
      name: 'confirmation',
      type: 'confirm',
    },
  ]);
  if (!answer.confirmation) return;

  const result = await client.execute(
    account,
    minter,
    msg,
    'auto',
    'set whitelist'
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

// Takes config.minter address and config.startTime
// and tries to update existing minter start time.
// Can not change if public mint already started.
async function updateStartTime() {
  const client = await getClient();
  const account = toStars(config.account);
  const minter = toStars(config.minter);

  const answer = await inquirer.prompt([
    {
      message:
        'Are you sure your want to change public mint start time to ' +
        config.startTime +
        ' ?',
      name: 'confirmation',
      type: 'confirm',
    },
  ]);
  if (!answer.confirmation) return;

  // time expressed in nanoseconds (1 millionth of a millisecond)
  const publicStartTime: Timestamp = (
    new Date(config.startTime).getTime() * 1_000_000
  ).toString();

  const result = await client.execute(
    account,
    minter,
    { update_start_time: publicStartTime },
    'auto',
    'update public mint start time'
  );

  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

const args = process.argv.slice(2);
if (args.length == 0) {
  init();
} else if (args.length == 2 && args[0] == '--whitelist') {
  setWhitelist(args[1]);
} else if (args.length == 1 && args[0] == '--update-start-time') {
  updateStartTime();
} else {
  console.log('Invalid arguments');
}
