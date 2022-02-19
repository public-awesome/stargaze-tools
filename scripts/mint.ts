import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { calculateFee, coins, GasPrice } from "@cosmjs/stargate";

const config = require("./config");

async function main() {
  const gasPrice = GasPrice.fromString("0stars");
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
    prefix: "stars",
  });
  const client = await SigningCosmWasmClient.connectWithSigner(
    config.rpcEndpoint,
    wallet
  );
  const executeFee = calculateFee(300_000, gasPrice);
  const result = await client.execute(
    config.account,
    config.minter,
    { mint: {} },
    executeFee,
    "minty fresh",
    coins("100000000", "ustars")
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === "wasm");
  console.info(
    "The `wasm` event emitted by the contract execution:",
    wasmEvent
  );
}
const args = process.argv.slice(7);
await main();
console.info("Done.");
