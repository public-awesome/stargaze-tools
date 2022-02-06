import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
const fs = require("fs");

const rpcEndpoint = "https://rpc.devnet.publicawesome.dev:443/";

const alice = {
  mnemonic: "enlist hip relief stomach skate base shallow young switch frequent cry park",
};

const codeId = 4;

async function main() {
  const gasPrice = GasPrice.fromString("0stars");
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(alice.mnemonic, { prefix: "stars" });
  const client = await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, wallet);

  const accounts = await wallet.getAccounts();
  console.log(accounts);
  // Instantiate
  const instantiateFee = calculateFee(500_000, gasPrice);

  const configData = fs.readFileSync("config.json");
  const config = JSON.parse(configData);

  // This contract specific message is passed to the contract
  const collectionMsg = {
    name: config["name"],
    symbol: config["symbol"],
    minter: config["minter"],
  };
  console.log(collectionMsg);

  const { contractAddress } = await client.instantiate(
    accounts[0].address,
    config["contractCodeId"],
    collectionMsg,
    config["name"],
    instantiateFee,
  );
  console.info(`Contract instantiated at: `, contractAddress);
}

await main();
console.info("Done.");