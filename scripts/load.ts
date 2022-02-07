import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import fs from "fs";

const CONFIG = "./config.json";
const config = JSON.parse(fs.readFileSync(CONFIG, "utf8"));
const client = await CosmWasmClient.connect(config["rpcEndpoint"]);
// const contract = await client.getContract(config["collectionContract"]);
// const res = await client.queryContractSmart(config["collectionContract"], {});
