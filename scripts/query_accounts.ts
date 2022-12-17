// query all accounts in accounts.csv
// output bad accounts to console

import { toStars } from '../src/utils';
var fetchUrl = require('fetch').fetchUrl;

const config = require('../config');

async function queryAccounts() {
  const addrs: Array<string> = [];

  // parse to stars address
  // check balance
  // check delegation balance
  // output bad accounts to console
  addrs.forEach((address) => {
    let addr = toStars(address);
    fetchUrl(
      'https://rest.stargaze-apis.com/cosmos/staking/v1beta1/delegations/' +
        addr,
      function (error: any, meta: any, body: { toString: () => any }) {
        let delegations = 0;
        JSON.parse(body.toString())['delegation_responses'].forEach(
          (json: { [x: string]: { [x: string]: { [x: string]: any } } }) => {
            // console.log(json['balance']['amount']);
            delegations += Number(json['balance']['amount']);
          }
        );

        if (delegations < 50000000) {
          console.log(addr + ': ' + delegations);
        }
      }
    );
  });
}
queryAccounts();
