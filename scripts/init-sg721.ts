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
    minter: config["creator"],
  };
  console.log(collectionMsg);

  const { contractAddress } = await client.instantiate(
    config["creator"],
    config["sg721CodeId"],
    collectionMsg,
    config["name"],
    instantiateFee
  );
  console.info(`Contract instantiated at: `, contractAddress);
}

await main();
console.info("Done.");
