# Network


## Overview

The fundament of permissionless network is decentralization. As a new permissionless blockchain, it is hard to look forward enough validator nodes to secure the network. Since Fusotao is based on [Substrate](https://substrate.dev), we decided to join the [Octopus Network](https://oct.network) which is a multi-chain infrastructure for Substrate-based Web3.0 applications. In this scenario, we call Fusotao an appchain of the Octopus Network.


## Validator

The Fusotao node executable binary can be downloaded from [Github Releases](https://github.com/uinb/fusotao/releases)(Linux amd64 only). Except for the node binary itself, network participants should indicate a chain specification to determine which network to join. Currently, we are under the final test phase(Vodka Testnet), the vodka chain specification is located on `/resources/octopus-testnet.json` of the repo.

The command below is to start a validator node of Fusotao Vodka Testnet.

```
fuso --chain octopus-testnet.json --validator
```

To validate the blocks of Fusotao, the validators must stake some $OCT tokens and register themselves on [Octopus Network Appchain Dashboard](https://oct.network/appchains). For more informations, please refer to the [Validator Guides.](https://docs.oct.network/maintain/validator-guide.html)

Once starting validation, the validators and their delegators can earn the Fusotao token $TAO. The total amount of $TAO to reward to validators of each era(abount 1 day) is *4109*. For a conclusion, the security of Fusotao Protocol is leased from the $OCT holders, that is what the LPoS(Leased Proof of Stake) means.

