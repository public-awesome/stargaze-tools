import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
const config = require("./config");

const client = await CosmWasmClient.connect(config.rpcEndpoint);
// const contract = await client.getContract(config["collectionContract"]);
// const res = await client.queryContractSmart(config["collectionContract"], {});
