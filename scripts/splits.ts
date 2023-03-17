import inquirer from 'inquirer';
import { toStars } from '../src/utils';
import { getClient } from '../src/client';
import { toBase64 } from 'cosmwasm';

const config = require('../config');

async function initGroup() {
  const client = await getClient();

  // @ts-ignore
  const msg: InstantiateMsg = {
    admin: 'stars1wh3wjjgprxeww4cgqyaw8k75uslzh3sd3s2yfk',
    members: [
      { addr: 'stars1wh3wjjgprxeww4cgqyaw8k75uslzh3sd3s2yfk', weight: 90 },
      { addr: 'stars1cy0nlkpp97xpfvc7jcaf483mqxvk0nkc6jm79f', weight: 10 },
    ],
  };

  console.log('Instantiating cw4-group contract...');

  const result = await client.instantiate(
    config.account,
    config.cw4GroupCodeId,
    msg,
    'cw4-group',
    'auto',
    { admin: config.account }
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'instantiate');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

async function initSplit() {
  const client = await getClient();
  // @ts-ignore
  const msg: InstantiateMsg = {
    admin: 'stars1wh3wjjgprxeww4cgqyaw8k75uslzh3sd3s2yfk',
    group: {
      cw4_address:
        'stars1t0fnmf765mk2dezhcvj5x4v836cxm74ju3vky8dw855fkej3aptqd04day',
    },
  };

  console.log('Instantiating splits contract...');

  const result = await client.instantiate(
    config.account,
    config.splitsCodeId,
    msg,
    'splits',
    'auto',
    { admin: config.account }
  );

  const wasmEvent = result.logs[0].events.find((e) => e.type === 'instantiate');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

async function initCombo() {
  const client = await getClient();

  // @ts-ignore
  const msg: InstantiateMsg = {
    admin: 'stars1wh3wjjgprxeww4cgqyaw8k75uslzh3sd3s2yfk',
    group: {
      cw4_instantiate: {
        code_id: config.cw4GroupCodeId,
        label: 'cw4-group',
        msg: {
          admin: 'stars1wh3wjjgprxeww4cgqyaw8k75uslzh3sd3s2yfk',
          members: [
            {
              addr: 'stars1wh3wjjgprxeww4cgqyaw8k75uslzh3sd3s2yfk',
              weight: 90,
            },
            {
              addr: 'stars1cy0nlkpp97xpfvc7jcaf483mqxvk0nkc6jm79f',
              weight: 10,
            },
          ],
        },
      },
    },
  };

  console.log('Instantiating combined splits contract...');

  const result = await client.instantiate(
    config.account,
    config.splitsCodeId,
    msg,
    'splits',
    'auto',
    { admin: config.account }
  );

  const wasmEvent = result.logs[0].events.find((e) => e.type === 'instantiate');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

const args = process.argv.slice(2);
if (args.length == 0) {
  initGroup();
} else if (args[0] == 'splits') {
  initSplit();
} else if (args[0] == 'combo') {
  initCombo();
} else {
  console.log('Invalid arguments');
}
