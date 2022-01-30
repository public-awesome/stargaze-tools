// This deploys an sg721 contract to a Stargaze chain (testnet or mainnet).
// NOTE: On Stargaze, you don't have to deploy contracts that have already been deployed once.
// You can instantiate an existing contract. This script only exists for those that want to
// depoloy a custom sg721 contract.

import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
// const config = require('config');
import config from "config";
import * as fs from "fs";

const rpcEndpoint = config.get('chain.rpc');

// Example user from scripts/wasmd/README.md
const alice = {
  mnemonic: "enlist hip relief stomach skate base shallow young switch frequent cry park",
  address0: "wasm14qemq0vw6y3gc3u3e0aty2e764u4gs5lndxgyk",
};

async function main(sg721WasmPath: string) {
  const gasPrice = GasPrice.fromString("0ustars");
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(alice.mnemonic, { prefix: "stars" });
  const client = await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, wallet);

  // Upload contract
  const wasm = fs.readFileSync(sg721WasmPath);
  const uploadFee = calculateFee(1_500_000, gasPrice);
  const uploadReceipt = await client.upload(alice.address0, wasm, uploadFee, "Upload sg721 contract");
  console.info("Upload succeeded. Receipt:", uploadReceipt);
}

// TODO: update to a public location when published
const sg721 = "../contracts/target/wasm32-unknown-unknown/release/sg721.wasm";
await main(sg721);
console.info("Done.");