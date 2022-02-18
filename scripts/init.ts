import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { calculateFee, GasPrice } from "@cosmjs/stargate";

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
        creator: config.creator,
        royalties: {
          payment_address: config.royaltyAddress,
          share: config.royaltyShare.toString(),
        },
      },
    },
    unit_price: {
      amount: (config.unitPrice * 1000000).toString(),
      denom: "ustars",
    },
  };
  console.log(msg);

  const { contractAddress } = await client.instantiate(
    config.account,
    config.minterCodeId,
    msg,
    config.name,
    instantiateFee
  );
  console.info(`Contract instantiated at: `, contractAddress);
}

await main();
console.info("Done.");
