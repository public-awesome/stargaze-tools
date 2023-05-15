import {
  SigningCosmWasmClient,
  DirectSecp256k1HdWallet,
  GasPrice,
} from 'cosmwasm';
import inquirer from 'inquirer';

import { isValidHttpUrl } from './utils';

const config = require('../../config');

export const gasPrice = GasPrice.fromString('0ustars');

export async function getClient() {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
    prefix: 'stars',
  });
  
  let RPC_ENDPOINT = config.testnetRpc;
  
  if (config.mainnet === true) {
    let answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'You are connecting to mainnet. Proceed?',
      },
    ]);
    if (!answers.proceed) {
      process.exit(0);
    }
    RPC_ENDPOINT = config.mainnetRpc;

  }

  if (!isValidHttpUrl(RPC_ENDPOINT)) {
    throw new Error('Invalid RPC endpoint');
  }
  return await SigningCosmWasmClient.connectWithSigner(
    RPC_ENDPOINT,
    wallet,
    { gasPrice }
  );
}
