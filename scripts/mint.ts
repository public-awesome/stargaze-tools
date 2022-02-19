import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { calculateFee, coins, GasPrice } from "@cosmjs/stargate";
import { Bech32 } from "@cosmjs/encoding";

const addrHelper = require("./addrHelper");
const config = require("./config");

async function mintSender() {
  const gasPrice = GasPrice.fromString("0stars");
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
    prefix: "stars",
  });
  const client = await SigningCosmWasmClient.connectWithSigner(
    config.rpcEndpoint,
    wallet
  );
  const executeFee = calculateFee(300_000, gasPrice);

  const msg = { mint: {} };
  console.log(msg);

  const result = await client.execute(
    config.account,
    config.minter,
    msg,
    executeFee,
    "mint to sender",
    coins("100000000", "ustars")
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === "wasm");
  console.info(
    "The `wasm` event emitted by the contract execution:",
    wasmEvent
  );
}

async function mintTo(recipient: string) {
  if (!recipient.startsWith("stars")) {
    const { data } = Bech32.decode(recipient);
    const starsAddr = Bech32.encode("stars", data);
    recipient = starsAddr;
  }
  console.log("Minting to: ", recipient);

  const gasPrice = GasPrice.fromString("0stars");
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
    prefix: "stars",
  });
  const client = await SigningCosmWasmClient.connectWithSigner(
    config.rpcEndpoint,
    wallet
  );
  const executeFee = calculateFee(300_000, gasPrice);

  const msg = { mint_to: { recipient: recipient } };
  console.log(msg);

  const result = await client.execute(
    config.account,
    config.minter,
    msg,
    executeFee,
    "mint to",
    coins("100000000", "ustars")
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === "wasm");
  console.info(
    "The `wasm` event emitted by the contract execution:",
    wasmEvent
  );
}

async function mintFor(tokenId: string, recipient: string) {
  let stars_recipient = addrHelper.to_stars_addr(recipient);
  console.log("Minting token " + tokenId + " for", stars_recipient);

  const gasPrice = GasPrice.fromString("0stars");
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
    prefix: "stars",
  });
  const client = await SigningCosmWasmClient.connectWithSigner(
    config.rpcEndpoint,
    wallet
  );
  const executeFee = calculateFee(300_000, gasPrice);

  const msg = { mint_for: { token_id: Number(tokenId), recipient } };
  console.log(msg);

  const result = await client.execute(
    config.account,
    config.minter,
    msg,
    executeFee,
    "mint for",
    coins("100000000", "ustars")
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === "wasm");
  console.info(
    "The `wasm` event emitted by the contract execution:",
    wasmEvent
  );
}

const args = process.argv.slice(6);
console.log(args);
if (args.length == 0) {
  await mintSender();
} else if (args.length == 2 && args[0] == "--to") {
  await mintTo(args[1]);
} else if (args.length == 3 && args[0] == "--for") {
  await mintFor(args[1], args[2]);
} else {
  console.log("Invalid arguments");
}
