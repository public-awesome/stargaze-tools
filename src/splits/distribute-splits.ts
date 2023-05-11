import { getClient } from '../helpers/client';
import { ExecuteMsg } from '@stargazezone/launchpad/src/Splits.types';


const config = require('../../config');

let distrubute_splits= async ()=>{
    const client = await getClient();
    const msg: ExecuteMsg = {
        distribute: {
        },
    };

    const result = await client.execute(
        config.account,
        config.splitsContract,
        msg,
        'auto',
        'distribute',
    );
    console.log('Distribute result:', result);

}

distrubute_splits();
