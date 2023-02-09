# Architecture


This chapter describes the top-level architecture of Fusotao, explaining each components and their interactions.

The following figure indicates the interaction between Fusotao components and other chains:

![](/wiki/FusotaoOverview.png)

## Components

- [Fusotao Node](https://github.com/uinb/fusotao)
- [Galois(Prover)](https://github.com/uinb/galois)
- [Octopus Anchor](https://github.com/octopus-network/anchor-contract)
- [Avatar Wallet](https://chrome.google.com/webstore/detail/avatar-wallet/ckfhnogibicdkfkijinnacpmmobbhbjk)
- [Chain Bridge](https://github.com/uinb/ChainBridge)

## Node

The Fusotao chain consists of a set of Substrate pallets which are responsible for:

- Producing and finalizing blocks (Parity: BABE/GRANDPA)
- Generating bridging proofs (Parity: BEEFY/MMR)
- Managing native token and gas (Parity: Balance/TransactionPayment)
- Managing validators (Octopus: OctopusAppchain/OctopusBridge)
- Verifying order matching proofs (Fusotao: FusoVerifier)
- Managing foreign reservable tokens (Fusotao: FusoToken)
- Enable interoperability with other EVM-compatible chains (Fusotao: FusoAgent)
- Bridging to EVM-compatible chains (ChainSafe: ChainBridge)

Additionally, the Fusotao runtime includes an off-chain worker that pulls events occurring on the NEAR network to mint NEP-141 tokens.

## Galois(Prover)

Galois is a standard matching engine written in Rust that can be used as either the proving client for Fusotao or a traditional centralized exchange (CEX) matcher. As a prover, Galois must handle receipts fetched from Fusotao blocks and directly accept incoming trading commands from users. For each user-signed trading command, Galois will generate an associated proof and commit it back to Fusotao to modify the user's assets. For further information, please refer to the [Fusotao Greenbook](https://www.fusotao.org/fusotao-greenbook.pdf).


## Octopus Anchor Contract

The Octopus Anchor Contract is a smart contract deployed on the NEAR Protocol. Its purpose is to either manage the validators of Fusotao or validate assets bridging between NEAR and Fusotao.

## Avatar Wallet

The Avatar Wallet is compatible with both NEAR and Fusotao and includes the built-in Octopus Bridge. This allows users to seamlessly switch between NEAR and Fusotao without the need to install separate wallet extensions.

## Chain Bridge

The Chain Bridge includes a relayer that facilitates the transfer of block messages between the Ethereum Virtual Machine (EVM) and Fusotao, as well as a solidity contract that is security audited for managing ERC20 tokens. Furthermore, the integration with the Fusotao Agent feature grants the Chain Bridge the ability of interoperability.
