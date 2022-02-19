import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { calculateFee, coins, GasPrice } from "@cosmjs/stargate";

const config = require("./config");

function isValidHttpUrl(uri: string) {
  let url;

  try {
    url = new URL(uri);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function isValidIpfsUrl(uri: string) {
  let url;

  try {
    url = new URL(uri);
  } catch (_) {
    return false;
  }

  return url.protocol === "ipfs:";
}

async function main() {
  const gasPrice = GasPrice.fromString("0stars");
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
    prefix: "stars",
  });

  if (!isValidHttpUrl(config.rpcEndpoint)) {
    throw new Error("Invalid RPC endpoint");
  }
  const client = await SigningCosmWasmClient.connectWithSigner(
    config.rpcEndpoint,
    wallet
  );

  if (!isValidIpfsUrl(config.baseTokenUri)) {
    throw new Error("Invalid base token URI");
  }

  if (config.numTokens > 10_000) {
    throw new Error("Too many tokens");
  }

  const instantiateFee = calculateFee(500_000, gasPrice);

  const msg = {
    base_token_uri: config.baseTokenUri,
    num_tokens: config.numTokens,
    sg721_code_id: config.sg721CodeId,
    sg721_instantiate_msg: {
      name: config.name,
      symbol: config.symbol,
      minter: config.account,
      config: {
        contract_uri: config.contractUri,
        creator: config.account,
        royalties: {
          payment_address: config.royaltyAddress,
          share: config.royaltyShare,
        },
      },
    },
    unit_price: {
      amount: (config.unitPrice * 1000000).toString(),
      denom: "ustars",
    },
  };
  console.log(JSON.stringify(msg, null, 2));

  const { contractAddress } = await client.instantiate(
    config.account,
    config.minterCodeId,
    msg,
    config.name,
    instantiateFee,
    { funds: coins("1000000000", "ustars") }
  );
  console.info(`Contract instantiated at: `, contractAddress);
}

await main();
console.info("Done.");
