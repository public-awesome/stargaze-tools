import { CosmWasmClient } from 'cosmwasm';
import { toStars } from '../src/utils';

const config = require('../config');

async function queryMinters() {
  const client = await CosmWasmClient.connect(config.rpcEndpoint);
  const minterCodeId = config.minterCodeId;
  const contracts = await client.getContracts(minterCodeId);

  console.log('minter contract addrs: ', contracts.join(','));
}
queryMinters();
