# Architecture


This chapter describes the top-level architecture of Fusotao, explaining each components and their interactions.

The following figure indicates the interaction between Fusotao components and other chains:

![](/FusotaoOverview.png)

## Components

- [Fusotao Node](https://github.com/uinb/fusotao)
- [Galois(Prover)](https://github.com/uinb/galois)
- [Octopus Anchor](https://github.com/octopus-network/anchor-contract)
- [Avatar Wallet](https://chrome.google.com/webstore/detail/avatar-wallet/ckfhnogibicdkfkijinnacpmmobbhbjk)
- [Chain Bridge](https://github.com/uinb/ChainBridge)
- [Web Portal](https://portal.fusotao.org)
- [Explorer](https://explorer.mainnet.oct.network/fusotao)
- [Polkadotjs for Fusotao](https://polkadot.js.org/apps/?rpc=wss://gateway.mainnet.octopus.network/fusotao/0efwa9v0crdx4dg3uj8jdmc5y7dj4ir2#/explorer)

## Fusotao Node

The Fusotao chain node is composed of a runtime layer and a container layer. The runtime layer is a WASM binary contains all the core logic of the chain and execute by the container layer for reaching a consensus state cross the whole network. The container layer includes P2P communication, storage, consensus algorithm and RPC service. Usually, a substrate-based blockchain only focuses on the runtime development while Fusotao Protocol extends them both.

The Fusotao runtime layer consists of a set of pallets which are responsible for:

- Producing and finalizing blocks (Parity: BABE/GRANDPA)
- Generating bridging proofs (Parity: BEEFY/MMR)
- Managing native token and gas (Parity: Balance/TransactionPayment)
- Managing validators and transfering between Fusotao and NEAR (Octopus: OctopusAppchain/OctopusBridge)
- Verifying order matching proofs (Fusotao: FusoVerifier)
- Managing foreign reservable tokens (Fusotao: FusoToken)
- Enable interoperability with other EVM-compatible chains (Fusotao: FusoAgent)
- Managing the brokers and markets (Fusotao: FusoMarket)
- Bridging to EVM-compatible chains (ChainSafe: ChainBridge)

Additionally, Fusotao protocol extends the Substrate container layer to support Proof of Order Relay which enables everyone to join the network as a broker without permissions and even building a customized webpage in front of the node, or embedding the open trading APIs into any projects.


## Galois(Prover)

Galois is a standard matching engine written in Rust that can be used as either the proving client for Fusotao or a traditional centralized exchange (CEX) matcher. As a prover, Galois must handle receipts fetched from Fusotao blocks and directly accept incoming trading commands from users. For each user-signed trading command, Galois will generate an associated proof and commit it back to Fusotao to modify the user's assets. For further information, please refer to the [Fusotao Greenbook](https://www.fusotao.org/fusotao-greenbook.pdf).


## Octopus Anchor Contract

The Octopus Anchor Contract is a smart contract deployed on the NEAR Protocol. Its purpose is to either manage the validators of Fusotao or validate assets bridging between NEAR and Fusotao.

## Avatar Wallet

The Avatar Wallet is compatible with both NEAR and Fusotao and includes the built-in Octopus Bridge. This allows users to seamlessly switch between NEAR and Fusotao without the need to install separate wallet extensions.

## Chain Bridge

The Chain Bridge includes a relayer that facilitates the transfer of block messages between the Ethereum Virtual Machine (EVM) and Fusotao, as well as a solidity contract that is security audited for managing ERC20 and BEP20 tokens. Furthermore, the integration with the Fusotao Agent feature grants the Chain Bridge the ability of interoperability.

## Web Portal

The Web Portal is a decentralized webapp for interacting with Fusotao, mainly includes staking, claiming rewards, bridging, token transfering and etc.

## Explorer

The Fusotao explorer is powered by the Octopus team.
