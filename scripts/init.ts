import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { calculateFee, GasPrice } from "@cosmjs/stargate";

const config = require("./config");

async function main() {
  const gasPrice = GasPrice.fromString("0stars");
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    config["mnemonic"],
    {
      prefix: "stars",
    }
  );
  const client = await SigningCosmWasmClient.connectWithSigner(
    config["rpcEndpoint"],
    wallet
  );
  const instantiateFee = calculateFee(500_000, gasPrice);

  const collectionMsg = {
    name: config["name"],
    symbol: config["symbol"],
    // TODO: this is the contract being instantiated, so we won't have a minter here right?
    minter: config["minter"],
  };
  console.log(collectionMsg);

  const { contractAddress } = await client.instantiate(
    config["creator"],
    config["contractCodeId"],
    collectionMsg,
    config["name"],
    instantiateFee
  );
  console.info(`Contract instantiated at: `, contractAddress);
}

await main();
console.info("Done.");
