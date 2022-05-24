// Sweeps the floor of a nft collection
// Buying the cheapest nfts regardless of attributes
// Queries AsksSortedByPrice for N nft's and returns total price
// --execute tries to purchase N nft's all-or-none
import { toStars } from '../src/utils';
const config = require('../config');
import { getClient } from '../src/client';

const MAX_SWEEP_COUNT = 10;

async function prepFloorSweep(numTokens: number) {
  if (numTokens > MAX_SWEEP_COUNT) {
    throw new Error('Too many tokens to sweep');
  }

  // query AsksSortedByPrice for numTokens nft's and return total price
  const sg721Addr = toStars(config.sg721);
  const account = toStars(config.account);
  const client = await getClient();
  const marketplaceAddr = toStars(config.marketplace);
  const configResponse = await client.queryContractSmart(marketplaceAddr, {
    asks_sorted_by_price: { collection: sg721Addr },
  });
  let floorSweepPrice = BigInt(0);
  let asks = configResponse.asks;
  for (let i = 0; i < numTokens; i++) {
    if (asks[i] == undefined) {
      console.log('not enough asks in collection', i + 1);
      break;
    }
    console.log('ask', i, asks[i].price);
    //stackoverflow.com/questions/14667713/how-to-convert-a-string-to-number-in-typescript
    floorSweepPrice += BigInt(asks[i].price);
  }
  console.log('floorSweepPrice', floorSweepPrice);

  const balance = await client.getBalance(account, 'ustars');
  https: if (+balance.amount < floorSweepPrice) {
    throw new Error(
      'Not enough balance to sweep ' + balance.amount + ' ' + floorSweepPrice
    );
  }
}

async function runFloorSweep(numTokens: number) {}

const args = process.argv.slice(2);
if (args.length == 1) {
  prepFloorSweep(parseInt(args[0]));
} else if (args.length == 2 && args[1] == '--execute') {
  runFloorSweep(parseInt(args[0]));
} else {
  console.log('Invalid arguments');
}
