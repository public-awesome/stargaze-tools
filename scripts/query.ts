import { CosmWasmClient } from 'cosmwasm';
import { toStars } from '../src/utils';

const config = require('../config');

async function queryInfo() {
  const client = await CosmWasmClient.connect(config.rpcEndpoint);
  const account = toStars(config.account);
  const minter = toStars(config.minter);
  const sg721 = toStars(config.sg721);

  const balance = await client.getBalance(account, 'ustars');
  console.log('account balance:', balance);

  const configResponse = await client.queryContractSmart(minter, {
    config: {},
  });
  console.log('minter configResponse: ', configResponse);

  const numTokens = await client.queryContractSmart(sg721, { num_tokens: {} });
  console.log('num tokens:', numTokens);

  const collectionInfo = await client.queryContractSmart(sg721, {
    collection_info: {},
  });
  console.log('collection info:', collectionInfo);

  if (config.whitelistContract) {
    const whitelistConfig = await client.queryContractSmart(
      config.whitelistContract,
      {
        config: {},
      }
    );
    console.log('whitelist config:', whitelistConfig);

    const whitelistMembers = await client.queryContractSmart(config.whitelist, {
      members: { limit: 5000 },
    });
    console.log('whitelist members:', whitelistMembers);
  }

  const nfts = await client.queryContractSmart(sg721, {
    tokens: { owner: account, limit: 30 },
  });
  console.log(nfts);
}
queryInfo();
