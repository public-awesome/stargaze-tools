import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { Bech32 } from "@cosmjs/encoding";

const config = require("./config");

async function main(recipient: string) {
  if (!recipient.startsWith("stars")) {
    const { data } = Bech32.decode(recipient);
    const starsAddr = Bech32.encode("stars", data);
    recipient = starsAddr;
  }

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
  const executeFee = calculateFee(300_000, gasPrice);
  const result = await client.execute(
    config["creator"],
    config["minter"],
    { mintFor: { recipient: recipient } },
    executeFee
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === "wasm");
  console.info(
    "The `wasm` event emitted by the contract execution:",
    wasmEvent
  );
}
const args = process.argv.slice(7);
console.log(args);
await main(args[0]);
console.info("Done.");
