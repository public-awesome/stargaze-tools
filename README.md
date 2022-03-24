# Stargaze Tools

Stargaze Tools is a set of tools for launching a collection and minting on Stargaze.

## Setup project

```sh
git clone https://github.com/public-awesome/stargaze-tools
cd stargaze-tools
yarn install
```

## Create an account on testnet

```sh
yarn account
```

This outputs an address you can use to instantiate your minter contract.

## Get funds from faucet

Ask for funds from the `#faucet` channel in [Discord Stargaze](https://discord.gg/stargaze).

```
$request [address]
```

## Configure project

Copy `config.example.js` to `config.js`.
Edit `config.js` with your project configuration.

## Initialize an NFT minting contract

```sh
yarn minter
```

## Mint

### Mint a specific NFT to an address

```sh
yarn mint --for [token_id] [address]
```

`[address]` can be any Cosmos address. It'll be converted automatically into a Stargaze address.

### Mint to an address

```sh
yarn mint --to [address]
```

This mints the next available token ID to the given address.

### Batch mint

Mint `num` NFTs to an address.

```sh
yarn mint --to [address] --batch [num]
```

Same as `mint --to` but mints the next [num] tokens sequentially to the given address.

## Whitelist (optional)

Instantiate a whitelist contract:

```sh
yarn whitelist
```

The output of the above command should give you a whitelist contract address. Edit `config.js` and update the `whitelist` field with this value. Next, set this address in your minter contract with:

```sh
yarn minter --whitelist [whitelist_address]
```

To add addresses to the whitelist, use:

```sh
yarn whitelist --add [stars1..., stars2..., etc.]
```

## Query sg721

You can run queries against an instantiated sg721 contract with:

```sh
yarn query
```

For all possible queries, see the [query types](https://github.com/public-awesome/cw-nfts/blob/main/contracts/cw721-base/src/msg.rs#L76).

## Testnet

Test your contract. Make sure it's visible in launchpad. Try minting and viewing the NFT in your profile.
[https://testnet.publicawesome.dev/](https://testnet.publicawesome.dev/)

# More documentation

A more comprehensive guide is available at [Stargaze Docs](https://docs.stargaze.zone/guides/readme).

# Disclaimer

STARGAZE TOOLS IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND. No developer or entity involved in creating Stargaze Tools or smart contracts will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of Stargaze, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value. Although Public Awesome, LLC and it's affiliates developed the initial code for Stargaze, it does not own or control the Stargaze network, which is run by a decentralized validator set.

# Terms and Conditions

By using this code you agree to the following [terms and conditions](TERMS).
