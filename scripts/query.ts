import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
const config = require('./config');

const client = await CosmWasmClient.connect(config.rpcEndpoint);
const sg721 = config.sg721;

const balance = await client.getBalance(config.account, 'ustars');
console.log('account balance:', balance);

const numTokens = await client.queryContractSmart(sg721, { num_tokens: {} });
console.log('num tokens:', numTokens);
