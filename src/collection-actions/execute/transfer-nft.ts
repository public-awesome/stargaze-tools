import inquirer from 'inquirer';
import { toStars } from '../../utils/utils';
import { getClient } from '../../utils/client';
const config = require('../../../config');

let transferNft = async (token_address:string,token_id: string, recipient: string) => {
    let client = await getClient();
    let validated_address = toStars(recipient);
    const msg = { transfer_nft: { token_id: token_id, recipient: validated_address } };
    console.log(`Sending NFT with the id of ${token_id} to ${recipient}`);
    const answer = await inquirer.prompt([
        {
          message: 'Ready to submit the transaction?',
          name: 'confirmation',
          type: 'confirm',
        },
      ]);
      if (!answer.confirmation) return;
    let result = await client.execute(config.account,token_address,msg,"auto");
    const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
    console.info(
      'The `wasm` event emitted by the contract execution:',
      wasmEvent
    );

}
    

const args = process.argv.slice(2);

if (args.length != 3) {
    console.log("Usage:<sg721_address> <token_id> <recipient>");
    process.exit(1);
}
transferNft(args[0],args[1],args[2]);
