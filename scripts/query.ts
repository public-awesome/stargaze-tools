import { CosmWasmClient } from 'cosmwasm';

const config = require('../config');

async function queryInfo() {
  const client = await CosmWasmClient.connect(config.rpcEndpoint);
  const sg721 = config.sg721;

  const balance = await client.getBalance(config.account, 'ustars');
  console.log('account balance:', balance);

  const numTokens = await client.queryContractSmart(sg721, { num_tokens: {} });
  console.log('num tokens:', numTokens);

  const collectionInfo = await client.queryContractSmart(sg721, {
    collection_info: {},
  });
  console.log('collection info:', collectionInfo);

  const whitelistMembers = await client.queryContractSmart(
    config.whitelistContract,
    {
      members: { limit: 5000 },
    }
  );
  console.log('whitelist info:', whitelistMembers);
}
queryInfo();
