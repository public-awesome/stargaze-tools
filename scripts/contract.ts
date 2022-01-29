import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { calculateFee, GasPrice } from "@cosmjs/stargate";

const rpcEndpoint = "https://rpc.devnet.publicawesome.dev:443/";

// Example user from scripts/wasmd/README.md
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
  // This contract specific message is passed to the contract
  const msg = {
    name: "Stargaze Punks",
    symbol: "PUNK",
    minter: accounts[0].address,
  };
  const { contractAddress } = await client.instantiate(
    accounts[0].address,
    codeId,
    msg,
    "My NFT",
    instantiateFee,
    { memo: `Launch Stargaze Punks` },
  );
  console.info(`Contract instantiated at: `, contractAddress);
}

await main();
console.info("Done.");