# Stargaze Tools V2

Stargaze Tools is a set of tools to interact with Launchpad smart contracts on Stargaze.

It's designed for creators and developers to help launch and manage collections. As use cases grow, more tools and scripts will be added.

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

## Vending Minter

A vending minter is suitable for PFP-style 10,000 item or less generative collections.

### Initialize a vending minter contract

A minter is created from a factory contract.

```sh
yarn minter
```

Creating an updatable vending collection requires adding --updatable-vending to the above command.

```sh
yarn minter --updatable-vending
```

### Mint

#### Mint a specific NFT to an address

```sh
yarn mint --for [token_id] [address]
```

`[address]` can be any Cosmos address. It'll be converted automatically into a Stargaze address.

#### Mint to an address

```sh
yarn mint --to [address]
```

This mints the next available token ID to the given address.

#### Batch mint

Mint `num` NFTs to an address.

```sh
yarn mint --to [address] --batch [num]
```

Same as `mint --to` but mints the next [num] tokens sequentially to the given address.

#### Batch update token URIs

**Only available for updatable collections.**

```sh
yarn update-metadata
```

Update a single token's metadata

```
yarn update-metadata 1 ipfs://somethinghere
```

### Whitelist (optional)

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

## Base Minter (1/1s)

A base minter is suitable for collections of 1/1s.

### Initialize a base minter contract

A minter is created from a factory contract.

```sh
yarn base-minter
```

### Mint

```sh
yarn mint --token-uri [token-uri]
```

## Query sg721

You can run queries against an instantiated sg721 contract with:

```sh
yarn query
```

For all possible queries, see the [query types](https://github.com/public-awesome/cw-nfts/blob/main/contracts/cw721-base/src/msg.rs#L76).

## Splits (optional)

Splits allow splitting mint revenue and secondary sale royalties across multiple accounts.

Define split members and allocations in `config.js`, and run:

```sh
yarn group
```

This command will output the group contract address. Now use this address to create a splits contract:

```sh
yarn splits [group-address]
```

Now the address of the splits contract can be used for the `paymentAddress` (primary sales) and/or `royaltyPaymentAddress` (secondary sales) in `config.js` when creating a minter.

Coming soon:

To distribute funds from the splits contract, make sure you are either the `admin` or a member of the group, and run:

```sh
yarn splits-distribute
```

## Snapshot

Create a snapshot of owners of a vending collection:

```
yarn vending-snapshot [collection] [expected_num_tokens]
```

For example, to do a snapshot of all owners of Bad Kids:

```
yarn vending-snapshot stars19jq6mj84cnt9p7sagjxqf8hxtczwc8wlpuwe4sh62w45aheseues57n420 9999
```

This generates a CSV file called `snapshot.csv`. Burned tokens will show as `burned` for the owner address.

### Snapshot + Airdrop

You can airdrop a new collection to owners of an existing vending collection.

First configure a new minter following [instructions above](#configure-project).

Then generate a snapshot. For example, to airdrop a new collection to owners of Bad Kids:

```
yarn vending-snapshot stars19jq6mj84cnt9p7sagjxqf8hxtczwc8wlpuwe4sh62w45aheseues57n420 9999
```

Then Airdrop to each address in the snapshot:

```
yarn mint-for-file
```

_Note: Burned tokens will be minted to your account._

### Flexible Whitelist

Use a whitelist that has custom `per_address_limit` based on NFT ownership of a different collection. This requires using the flexible factory address, flexible minter code id, and flexible whitelist code id.

```sh
yarn minter --flex-vending
yarn vending-snapshot
yarn query-owner-nft-count
# creates owner-nft-count.csv with the number of NFTs owned by each address
yarn whitelist-flex
yarn whitelist-flex-file
yarn minter --whitelist [whitelist_address]
```

## Testnet

Test your contract. Make sure it's visible in launchpad. Try minting and viewing the NFT in your profile.
[https://testnet.publicawesome.dev/](https://testnet.publicawesome.dev/)

## Video Tutorials

[https://www.youtube.com/watch?v=1gvDlBWKEUc](https://www.youtube.com/watch?v=1gvDlBWKEUc) by Meta-induction

[https://www.youtube.com/watch?v=lw6w5zlRj14](https://www.youtube.com/watch?v=lw6w5zlRj14) by Cosmos Tutorials

[https://asciinema.org/a/485818](https://asciinema.org/a/485818)

## More documentation

A more comprehensive guide is available at [Stargaze Docs](https://docs.stargaze.zone/guides/readme).

## Copyrighted Content

You represent and warrant that you have, or have obtained, all rights, licenses, consents, permissions, power and/or authority necessary to grant the rights granted herein for any content that you create, submit, post, promote, or display on or through the Service. You represent and warrant that such content does not contain material subject to copyright, trademark, publicity rights, or other intellectual property rights, unless you have necessary permission or are otherwise legally entitled to post the material and to grant Stargaze Parties the license described above, and that the content does not violate any laws.

## Disclaimer

STARGAZE TOOLS IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND. No developer or entity involved in creating Stargaze Tools or smart contracts will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of Stargaze, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value. Although Public Awesome, LLC and it's affiliates developed the initial code for Stargaze, it does not own or control the Stargaze network, which is run by a decentralized validator set.

## Terms and Conditions

By using this code you agree to the following [terms and conditions](TERMS).
