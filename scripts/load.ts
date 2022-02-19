import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
const config = require("./config");

const client = await CosmWasmClient.connect(config.rpcEndpoint);
