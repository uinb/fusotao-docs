# Node

The nodes in the Fusotao network have different roles:

| role      | option      | staking |
|-----------|-------------|---------|
| rpc       | n/a         | n/a     |
| validator | --validator | $OCT    |
| broker    | --relayer   | $TAO    |

## Installing node

The pre-compiled linux executable Fusotao node can be downloaded from [Github Releases](https://github.com/uinb/fusotao/releases) page.
If you prefer to build Fusotao node from source, please prepare the [Rustup](https://rustup.rs/) toolchain and clone the [Github Repo](https://github.com/uinb/fusotao).

```
# install rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# add toolchain
rustup target add wasm32-unknown-unknown

# clone the repo
git clone https://github.com/uinb/fusotao.git

# checkout the recent release tag, e.g. v0.9.18-rum.11
cd fusotao && git checkout ${git.tag} 

# use nightly
cargo +nightly build --release 

```

> Make sure you have switched to the recent release tag if you plan to join the mainnet.

## Running Fusotao as a validator

Unlike the PoW network, most PoS blockchains need value staking to secure the network and keep it permissionless at the same time. Before running Fusotao node as a validator, operators need to complete a few steps and stake some $OCT tokens into the Anchor contract, please follow the [Octopus Docs](https://docs.oct.network/maintain/validator-guide.html#validator-guide).

This seems a little bit weird for a blockchain network, why another token is needed to run a validator for Fusotao network? And what is this $OCT token? Well, there are already a plenty of articles to introduce what Octopus Network is, here we'll simply explain why Octopus Network is important to Fusotao Protocol.

The power of a blockchain network is from its decentralization, but establishing a new decentralized network is hard, especially at the early stage. When a new decentralized network is created, it starts with a small network size and requires time to grow. As a result, it is vulnerable to attacks (in the BABE/GRANDPA consensus algorithm, controlling 2/3 of the consensus nodes can illegally tamper with data). Octopus Network is an infrastructure that ensures the security of a new blockchain network. With the help of a mature community and OCT holders, it can quickly assist a newly created decentralized protocol in establishing a network with dozens of nodes.


Once completed the steps of staking $OCT, launching the node is very easy(replace some parameters to adapt to your environment):

```
nohup ./fuso --chain octopus-mainnet \
             --ws-external \
             --rpc-external \
             --rpc-cors all \
             --telemetry-url "wss://telemetry.mainnet.octopus.network/submit 0" \
             --prometheus-external \
             --prometheus-port 9615 \
             --enable-offchain-indexing true \
             --base-path {/path/to/datastore} \
             --name "{name you prefer}" \
             --validator > /path/to/fusotao.out & 2>&1

```

## Running Fusotao as a broker

As a decentralized trading network, the nodes have ability to accept trading commands but it requires the node is launched is the broker mode.

1. Generate an address for the broker node:

```
./fuso key generate --scheme sr25519

```
It will output a ss58 address with secret phrase:
```
Secret phrase:       save consider title mechanic rent august clock clog alcohol journey online radar
  Secret seed:       0xcd53583ccdd18535037d6a6e2013c9953d6474b517d7b04a042f4e0990f66fe4
  Public key (hex):  0xa8ba5c697e0ce46b679821200ed0ecf257069baab8d60576c18f840f0b548b24
  Account ID:        0xa8ba5c697e0ce46b679821200ed0ecf257069baab8d60576c18f840f0b548b24
  Public key (SS58): 5FswGBXbdfe1jNEvZsMvKZn5pSHD8RNcTfa3kwtaqDo9oj7p
  SS58 Address:      5FswGBXbdfe1jNEvZsMvKZn5pSHD8RNcTfa3kwtaqDo9oj7p
```

2. Launch the node in broker mode: (the `--rpc-methods safe` must be annotated):

```
nohup ./fuso --chain octopus-mainnet \
             --ws-external \
             --rpc-external \
             --rpc-cors all \
             --rpc-methods safe \
             --telemetry-url "wss://telemetry.mainnet.octopus.network/submit 0" \
             --prometheus-external \
             --prometheus-port 9615 \
             --enable-offchain-indexing true \
             --base-path {/path/to/datastore} \
             --name "{name you prefer}" \
             --ws-max-connections 10000 \
             --relayer > /path/to/fusotao.out & 2>&1

```

3. Insert the key just generated into the node:

```
./fuso key insert --key-type rely --scheme sr25519 --chain octopus-mainnet
```
> That will ask you to input the `Secret phrase`.

4. Register the broker account:

You need to use another account as the beneficiary and stake 50,000 TAO to activate the broker.

The simplest way is to use the [RPC Endpoint](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fgateway.mainnet.octopus.network%2Ffusotao%2F0efwa9v0crdx4dg3uj8jdmc5y7dj4ir2#/extrinsics) like previous section.

![](/register-broker.png)

- `broker`: The address just generated in the 1st step.
- `rpcEndpoint`: The exposed websocket address. You may need to run a gateway in front of the broker node since it requires TLS.
- `name`: Any name you prefer.

> After that, your broker node will be visible in the network. Even you could build a customized webapp with non-custody trading features.


