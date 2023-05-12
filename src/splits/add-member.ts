import { toStars } from '../helpers/utils';
import { getClient } from '../helpers/client';

const config = require('../../config');

async function addGroupMember(member: string, weight: number) {
  const client = await getClient();

  // @ts-ignore
  const msg: ExecuteMsg = {
    update_members: { add: [{ addr: toStars(member), weight: weight }] },
  };

  console.log('Adding member to cw4-group...');

  const result = await client.execute(
    config.account,
    config.groupContract,
    msg,
    'auto'
  );

  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

const args = process.argv.slice(2);
if (args[0] == 'add-member' && args.length == 3) {
  addGroupMember(args[1], parseInt(args[2]));
} else {
  console.log('Invalid arguments');
}
