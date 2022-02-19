import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { calculateFee, coins, GasPrice } from "@cosmjs/stargate";
import { Bech32 } from "@cosmjs/encoding";

const config = require("./config");

async function main(tokenId: string, recipient: string) {
  if (!recipient.startsWith("stars")) {
    const { data } = Bech32.decode(recipient);
    const starsAddr = Bech32.encode("stars", data);
    recipient = starsAddr;
  }

  const gasPrice = GasPrice.fromString("0stars");
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
    prefix: "stars",
  });
  const client = await SigningCosmWasmClient.connectWithSigner(
    config.rpcEndpoint,
    wallet
  );
  const executeFee = calculateFee(300_000, gasPrice);
  const msg = { mintFor: { tokenId, recipient } };
  console.log(JSON.stringify(msg, null, 2));

  const result = await client.execute(
    config.account,
    config.minter,
    msg,
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
await main(args[0], args[1]);
console.info("Done.");
