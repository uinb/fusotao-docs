# Learn

This chapter describes the top-level architecture of Fusotao, explaining each components and their interactions. Many conceptions in Fusotao are inherited from Substrate which makes Fusotao becoming a blockchain.

## Architecture

The following figure indicates the interaction between Fusotao components and other chains:

![](/overview.png ':size=75%')

Since Fusotao is not a general-purpose blockchain, the tokens usually are not originally from Fusotao. To trade them, they need to be bridged from external chains. 

In fact, except NEP-141 tokens from NEAR protocol, people wouldn't aware the bridging progress. Since the main reason for bridging tokens to Fusotao is to trade them, Fusotao just combines the authorizing and bridging into a single transaction. People could just use Fusotao via popular wallets like metamask directly. That makes Fusotao just looks like a smart contract hosted on ETH and BSC.

## Decentralized broker

![](/network.webp ':size=75%')

## Runtime and container

Fusotao is a substrate-based blockchain system. Like any other decentralized networks, the peer node is the core component. 
In general terms, a Fusotao node is composed of an executable *container* and a *runtime* compiled to WASM bytecode.

The container involes some important but common components:

- Storage
- P2P networking
- Consensus
- RPC service
- Virtual machine

While the runtime indicates the business logic of this protocol. Specifically, the Fusotao runtime mainly includes a set of modules to verify the order matches executed out of this blockchain are valid.

- BABE/GRANDPA: Producing and finalizing blocks
- BEEFY/MMR: Generating bridging proofs
- Balance/TransactionPayment: Managing native token and gas
- OctopusAppchain/OctopusBridge: Managing validators and transfering between Fusotao and NEAR
- Verifier: Verifying order matching proofs 
- Token: Managing external reservable tokens
- Agent: Enable interoperability with other EVM-compatible chains
- Market: Managing the brokers and markets
- Chainbridge: Bridging to EVM-compatible chains

> You may want to check the [code](https://github.com/uinb/fusotao) here.

## Consensus

Following the parity team's research, Fusotao re-uses the consensus algorithm which can be splitted into two separate phases:

- Block producing is the process nodes use to create new blocks.
- Block finalization is the process used to handle forks and choose the **canonical chain**.

In a PoS system, time is divided up into discrete slots. During each slot only some of the validators are selected based on a verifiable random function (VRF) to produce a block. This mechanism is called BABE(Blind Assignment for Block Extension).

A VRF can not promise that only a single validator would be selected during a slot. So, folks usually occur in the network.
A fork choice rule is an algorithm that selects the best chain that should be extended. 

Fusotao uses GRANDPA(GHOST-based Recursive Ancestor Deriving Prefix Agreement) to ensure the blocks in the canonical chain have deterministic finality. It just listens to gossip about blocks that have been produced by block authoring nodes. GRANDPA validators vote on chains, not blocks.
GRANDPA participants, usually validators at same time, vote on a block that they consider best and their votes are applied transitively to all previous blocks. After two-thirds of the GRANDPA authorities have voted for a particular block, it is considered final.

Read more: 

> [Byzantine Fault](https://en.wikipedia.org/wiki/Byzantine_fault) and  [Reaching Agreement in the Presence of Faults](https://lamport.azurewebsites.net/pubs/reaching.pdf)

## Account

An account in Fusotao network represents an identity of a person or an organization that is capable of making transactions or holding funds. 
Fusotao uses Sr25519 as its cryptography signature by default. Thus, a Sr25519 public key can be represented as an account since the associated private key could be used to sign a transaction. 
But an account doesn't have to be a cryptographical public key. In fact, any 32-bytes array could be treat as an account.

Some other account types that are not public keys:

- System Account

The system accounts are usually used for locking funds but their private keys are not existed. For example, the octopus bridge module uses an account without private key to receive $TAO then mint equally amount on NEAR. An system account is usually generated by a specific content with hash functions which emit a 32-bytes array.

- Mapping Account

A mapping account represents an identity from outer chains, currently only EVM-compatible chains. It requires that the account owner owns the secp256k1 private key to make transactions.

- Multi-signature Account

The Multisig pallet enables multiple parties to share responsibility for executing certain transactions. Any account holder can specify the accounts that are allowed to approve a multi-signature transaction and the minimum number of approvals required for a call to be dispatched to the runtime.

## Address

The address format in Fusotao network is SS58 which is based on the Bitcoin Base-58-check format with an extra modification.
The basic format of the address can be described as:

```
base58encode ( concat ( 0x05, [account;32], [checksum]  )  )
```

To verify an address in JavaScript or TypeScript projects, you can use the functions built into the Polkadot-JS API. For example:

```
// Import Polkadot.js API dependencies.
const { decodeAddress, encodeAddress  } = require('@polkadot/keyring')
const { hexToU8a, isHex  } = require('@polkadot/util')

// Specify an address to test.
const address = '<addressToTest>'

// Check address.
const isValidSubstrateAddress = () => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address))
    return true
  } catch (error) {
    return false
  }
}

// Query result.
const isValid = isValidSubstrateAddress()
console.log(isValid)
```

## Codec 

All data types in the runtime are encoded in [SCALE Codec](https://github.com/paritytech/parity-scale-codec), which is designed for communication between runtime and the outer node.

The SCALE codec is in form of binary format and not self-describing in any way. It assumes the decoding context has all type information about the encoded data. If a type is defined in the runtime, the client library could automatically register the type according to the runtime metadata.
For example, the signed transactions, parameters of a query request and its response data are all SCALE encoded. 

## Submitting transactions

The easiest way to submit a transaction is through the [Polkadotjs App](https://polkadot.js.org/apps). This is online webapp for all substrate-based blockchains. On the left-upper corner, you need to specify a node endpoint to connect from which the webapp will automatically fetch the data.

Some well-known endpoints are shown below:

- `wss://gateway.mainnet.octopus.network/fusotao/0efwa9v0crdx4dg3uj8jdmc5y7dj4ir2`
- `wss://broker-rpc.fusotao.org`

We use the `transfer` as an example:

1. Click the `Developer` tab and select `Extrinsics`
2. In the first item, select the signer account which can be either inserted through the `Accounts` tab or injected from the [Polkadot Extension](https://polkadot.js.org/extension/)
3. From the module list, select `balances` which represents the native assets module, and on the right side, select `transfer` function.
4. The webapp will automatically render the parameters according to the chain runtime, in this scenario, they are `dest` and `value`. 
5. Clicking `Submit Transaction` will awake the extension and requires you to sign the transaction.

> Fusotao follows the tradition of bitcoin to use bigint to represent coins. If you want to transfer `1 TAO`, you need to input `1,000,000,000,000,000,000`.

![](/submit-trans.png)

## Querying runtime state

> TODO
