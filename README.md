# Stargaze Mission Control

## WORK IN PROGRESS -- NOT READY FOR PRODUCTION USE YET

Mission control is a set of tools for launching a project and minting on Stargaze.

## Setup project

```sh
git clone https://github.com/public-awesome/stargaze-nft
cd stargaze-nft
yarn install
```

## Create an account on testnet

```sh
yarn run account
```

This outputs an address you can use to instantiate your minter contract.

## Get funds from faucet

Ask for funds from the [Discord bot](https://discord.gg/EUpDph5k).

```
$request [address]
```

## Configure project

Edit `config.js` with your project configuration.

## Initialize an NFT minting contract

```sh
yarn run init
```

## Mint an NFT

```sh
yarn run mint
```

`[address]` can be any Cosmos address. It'll be converted automatically into a Stargaze address.

# More documentation

A more comprehensive guide is available at [Stargaze Docs](https://docs.stargaze.zone/guides/readme).
