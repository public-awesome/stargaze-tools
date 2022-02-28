# Stargaze Tools

## WORK IN PROGRESS -- NOT READY FOR PRODUCTION USE YET

Stargaze Tools is a set of tools for launching a project and minting on Stargaze.

## Setup project

```sh
git clone https://github.com/public-awesome/stargaze-tools
cd stargaze-tools
yarn install
```

## Create an account on testnet

```sh
yarn run account
```

This outputs an address you can use to instantiate your minter contract.

## Get funds from faucet

Ask for funds from the `#faucet` channel in [Discord Stargaze](https://discord.gg/stargaze).

```
$request [address]
```

## Configure project

Edit `config.js` with your project configuration.

## Initialize an NFT minting contract

```sh
yarn run minter
```

## Mint

### Mint to an address

```sh
yarn run mint --to [address]
```

`[address]` can be any Cosmos address. It'll be converted automatically into a Stargaze address.

### Mint a specific NFT to an address

```sh
yarn run mint --for [token_id] [address]
```

### Batch mint

Mint `num` NFTs to yourself.

```sh
yarn run batch-mint [num]
```

## Whitelist

Instantiate a whitelist contract:

```sh
yarn run whitelist
```

The output of the above command should give you a whitelist contract address. Edit `config.js` and update the `whitelist` field with this value. Next, set this address in your minter contract with:

```sh
yarn run minter --whitelist [whitelist_address]
```

To add addresses to the whitelist, use:

```sh
yarn run whitelist --add [stars1..., stars2..., etc.]
```

## Query sg721

You can run queries against an instantiated sg721 contract with:

```sh
yarn run query
```

For all possible queries, see the [query types](https://github.com/public-awesome/cw-nfts/blob/main/contracts/cw721-base/src/msg.rs#L76).

# More documentation

A more comprehensive guide is available at [Stargaze Docs](https://docs.stargaze.zone/guides/readme).

# Disclaimer

STARGAZE TOOLS IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND. No developer or entity involved in creating Stargaze Tools or smart contracts will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of Stargaze, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value. Although Public Awesome, LLC and it's affiliates developed the initial code for Stargaze, it does not own or control the Stargaze network, which is run by a decentralized validator set.
