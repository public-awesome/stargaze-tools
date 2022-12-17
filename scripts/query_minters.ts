// query minters, return list of creators
import { toStars } from '../src/utils';
var fetchUrl = require('fetch').fetchUrl;

const config = require('../config');

async function queryMinters() {
  const minters: Array<string> = [];

  minters.forEach((minter) => {
    let minterAddr = toStars(minter);

    fetchUrl(
      'https://rest.stargaze-apis.com/cosmwasm/wasm/v1/contract/' + minterAddr,
      function (error: any, meta: any, body: { toString: () => any }) {
        const creator = JSON.parse(body.toString())['contract_info']['creator'];
        const admin = JSON.parse(body.toString())['contract_info']['admin'];
        console.log(creator);
        console.log(admin);
      }
    );
  });
}
queryMinters();
