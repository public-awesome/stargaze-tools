import { CosmWasmClient } from 'cosmwasm';
import { toStars } from '../src/utils';

const config = require('../config');

async function queryInfo() {
  const client = await CosmWasmClient.connect(config.rpcEndpoint);
  const account = toStars(config.account);
  const minter = toStars(config.minter);

  const balance = await client.getBalance(account, 'ustars');
  console.log('account balance:', balance);

  const configResponse = await client.queryContractSmart(minter, {
    config: {},
  });
  console.log('minter configResponse: ', configResponse);

  const sg721 = configResponse.sg721_address;
  const whitelistContract = configResponse.whitelist;

  const numTokens = await client.queryContractSmart(sg721, { num_tokens: {} });
  console.log('num tokens:', numTokens);

  const collectionInfo = await client.queryContractSmart(sg721, {
    collection_info: {},
  });
  console.log('collection info:', collectionInfo);

  if (whitelistContract) {
    const whitelistConfig = await client.queryContractSmart(whitelistContract, {
      config: {},
    });
    console.log('whitelist config:', whitelistConfig);

    const whitelistMembers = await client.queryContractSmart(
      whitelistContract,
      {
        members: { limit: 5000 },
      }
    );
    console.log('whitelist members:', whitelistMembers);
  }

  // query owned tokens
  //   const nfts = await client.queryContractSmart(sg721, {
  //     tokens: { owner: account, limit: 30 },
  //   });

  // query all tokens
  const nfts = await client.queryContractSmart(sg721, {
    all_tokens: { limit: 30 },
  });
  for (let id of nfts.tokens) {
    console.log('token_id ', id);
    const tokenInfo = await client.queryContractSmart(sg721, {
      all_nft_info: { token_id: id },
    });
    console.log('tokenInfo:', tokenInfo);
  }
}
queryInfo();
