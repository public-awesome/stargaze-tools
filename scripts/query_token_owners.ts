import { CosmWasmClient } from 'cosmwasm';
import { toStars } from '../src/utils';
var fetchUrl = require('fetch').fetchUrl;

const config = require('../config');

async function queryInfo() {
  const client = await CosmWasmClient.connect(config.rpcEndpoint);
  const sg721 =
    'stars1fx74nkqkw2748av8j7ew7r3xt9cgjqduwn8m0ur5lhe49uhlsasszc5fhr';

  let tokens = [
    'arcpool',
    'art',
    'badkids',
    'badkidz',
    'blockchain',
    'cory',
    'cosmos',
    'cosmwasm',
    'dao',
    'foundation',
    'graphein',
    'humanalgorithm',
    'ibc',
    'ibc-nft',
    'intern',
    'jerry',
    'jhernandez',
    'joe',
    'john',
    'josef',
    'justin',
    'kain',
    'korea',
    'larry',
    'launchpad',
    'luke',
    'mac',
    'marketplace',
    'mouse',
    'names',
    'nft',
    'nik',
    'nosnode',
    'nostradamus',
    'penso',
    'public-awesome',
    'publicawesome',
    'ruwan',
    'sex',
    'shane',
    'shanev',
    'ssr',
    'star',
    'stargaze',
    'stargaze-foundation',
    'stargaze-zone',
    'stargazefoundation',
    'stargazezone',
    'stars',
    'starty',
    'sunnysidereaper',
    'thespaceapesociety',
    'token',
    'web3',
    'whitemarlin',
    'whitemarlin4',
    'whitemarlinstaking',
  ];
  for (let id of tokens) {
    let token_msg = '{"all_nft_info": { "token_id": "' + id + '" }}';
    let encodedString = Buffer.from(token_msg).toString('base64');
    await fetchUrl(
      'https://rest.stargaze-apis.com/cosmwasm/wasm/v1/contract/stars1fx74nkqkw2748av8j7ew7r3xt9cgjqduwn8m0ur5lhe49uhlsasszc5fhr/smart/' +
        encodedString,
      function (error: any, meta: any, body: { toString: () => any }) {
        console.log(JSON.parse(body.toString())['data']['access']['owner']);
      }
    );
  }
}
queryInfo();
