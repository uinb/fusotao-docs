# Development

## Installing the Fusotao Node

### Downloading pre-compiled executables(Linux only)

The pre-compiled executable can be downloaded from our [Fusotao Releases](https://github.com/uinb/fusotao/releases) page.

### Building from source

If you prefer to build Fusotao node from source, please prepare the [Rustup](https://rustup.rs/) toolchain and clone the [Github Repo](https://github.com/uinb/fusotao).

```
# install rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
git clone https://github.com/uinb/fusotao.git
# checkout the recent release tag, e.g. v0.9.18-rum.11
cd fusotao && git checkout v0.9.18-rum.11
cargo build --release

```

**NOTICE:** Make sure you have switched to the recent release tag if you plan to join the mainnet.

### Running Fusotao in dev mode

To test Fusotao in local, simply start the node in dev mode:
```
target/release/fuso --dev

```

### Running Fusotao as a validator

Unlike the PoW network, most PoS blockchains need value staking to secure the network and keep it permissionless at the same time. Before running Fusotao node as a validator, operators need to complete a few steps and stake some $OCT tokens in the Anchor contract, please follow the [Octopus Docs](https://docs.oct.network/maintain/validator-guide.html#validator-guide).

Then back to the server and input(replace some parameters to adapt to your environment):

```
nohup ./fuso --chain octopus-mainnet \
             --ws-external \
             --rpc-external \
             --rpc-cors all \
             --telemetry-url "wss://telemetry.mainnet.octopus.network/submit 0" \
             --prometheus-external \
             --prometheus-port 9615 \
             --enable-offchain-indexing true \
             --base-path /path/to/datastore \
             --name "name you prefer" \
             --validator > /path/to/fusotao.out & 2>&1

```

### Running Fusotao as a broker

TODO

## RPC

RPC is the direct way to interact with Fusotao, following the [JSON-RPC 2.0](https://jsonrpc.org) standard. Fusotao supports both HTTP and WebSocket protocols. Similar to the web3.js library for Ethereum-based chains, Fusotao is a Substrate-based chain and has a Polkadot.js library that encapsulates the low-level JSON-RPC and encoding/decoding.

Fusotao's RPC can be divided into two categories:

**Runtime API**: requests go into the consensus part of the chain, such as reading on-chain storage or sending signed transactions.

**Node API**: requests do not execute inside the runtime, such as the Open Trading API.

This section will provide a detailed introduction to the second type of API. For the first type, only on-chain storage related to the Open Trading API will be discussed. For other APIs, please refer to the Polkadot.js documentation.

### Codec 

There are only 2 kinds of data format in the **Open Trading API**:

- Account: [ss58 format](https://ss58.org/)
- Others: [parity scale codec](https://github.com/paritytech/parity-scale-codec) in hex format with "0x" prefix

Below are some examples:

- user_account(fuso address): `5CGGzMEAVRwvBAr15c9c6c9N3LNKY3u3DmtJRpJHsWgSz4ii`
- nonce(number): `0x3c000000` => `'0x' + hex_format(scale_encode(60))`
- digest(fixed-size bytes): `0x7ad7aa7004615afd22edc830a8a7ab26d5531e066d4f0e4da9c467598fc856eb` => `'0x' + hex_format(blake2_256(data)) // for fixed-size bytes array, the encoding result is same as the original data, so we just omit the scale_encode`
- command(custom structure): `0x6780906036a0737931bc14669b077ae9b5f0e053995f1f3e84ade4200ebbf309d3469ea947e82ba420d74c97a7606cb0485ab85e192dc0cdc56dbebc215439892a6696b5aa9082e195dc8fd9e93e8f1d` => `0x + hex_format(scale_encode(structure_data))`
- trading_pair(tuple): `0x0000000001000000` => `'0x' + hex_format(scale_encode([0, 1]))`

### Low-level On-chain Storage API 

To use the low-level JSON-RPC to access the on-chain storage, users need to calculate the `StorageKey` then send a request. The `StorageKey` is concated with 3 parts: `twox128(module_name) + twox128(storage_name) + storage_hasher(key)`. The first two parts consist the `StoragePrefix` while the last part depends on the definition of the storage in the runtime. For instance, the `Broker` storage is defined at `market` module of the runtime:

```
#[pallet::storage]
pub type Brokers<T: Config> = StorageMap<
    _,
    Blake2_128Concat,
    T::AccountId,
    Broker<T::AccountId, Balance<T>, T::BlockNumber>,
    OptionQuery,
>;
```
First, let's calculate the `StoragePrefix`: 
```
storage_prefix = '0x' + twox128('market') + twox128('Brokers') 
=> '0x' + '5ebf094108ead4fefa73f7a3b13cb4a7' + '379c21ecab4e77259ea5abd8011f197f'
=> '0x5ebf094108ead4fefa73f7a3b13cb4a7379c21ecab4e77259ea5abd8011f197f'
```
According to the storage definition `Blake2_128Concat`, the `storage_hasher` is applying `blake2_128` hash function to the `AccountId` then concat itself:
```
// account is ss58 format of the sr25519 pubkey which is a 32-bytes array, so we omit the scale_encode
storage_hasher(account) = blake2_128(account.to_hex()) + account.to_hex() 

var account = '5G3aodhhZJgnkrNHwvEv3cEtsXv54mPa1avzPRrarth5P9Yu'
// the pubkey of '5G3aodhhZJgnkrNHwvEv3cEtsXv54mPa1avzPRrarth5P9Yu' is '0xb015f2b9d63d5469d6b82ca1954cdb50910ffd5d598a7cd7882844652eac1012'
storage_hasher(account) = blake2_128('b015f2b9d63d5469d6b82ca1954cdb50910ffd5d598a7cd7882844652eac1012') + 'b015f2b9d63d5469d6b82ca1954cdb50910ffd5d598a7cd7882844652eac1012'
=> 'ffd001f21765364c7b035e8896d1be80' + 'b015f2b9d63d5469d6b82ca1954cdb50910ffd5d598a7cd7882844652eac1012'
=> 'ffd001f21765364c7b035e8896d1be80b015f2b9d63d5469d6b82ca1954cdb50910ffd5d598a7cd7882844652eac1012'

```
Combine them togher, we finally got the whole `StorageKey`: 
```
storage_key = storage_prefix + storage_hasher(account)
=> '0x5ebf094108ead4fefa73f7a3b13cb4a7379c21ecab4e77259ea5abd8011f197fffd001f21765364c7b035e8896d1be80b015f2b9d63d5469d6b82ca1954cdb50910ffd5d598a7cd7882844652eac1012'
```
Send the request via websocket:
```
wscat -c wss://gateway.testnet.octopus.network/fusotao/erc8ygm5qvmi2fw23ijpvzgpzzto47mi
> {"id":"1","jsonrpc":"2.0","method":"state_getStorage","params":["0x5ebf094108ead4fefa73f7a3b13cb4a7379c21ecab4e77259ea5abd8011f197fffd001f21765364c7b035e8896d1be80b015f2b9d63d5469d6b82ca1954cdb50910ffd5d598a7cd7882844652eac1012"]}
< {"jsonrpc":"2.0","result":"0xda25052dc1f1223c33d3e4660147ddc7b72e968113075d4df4f8722578a9ea540000407ba5f06381960a0000000000001a7a3a00847773733a2f2f746573746e65742d736964656361722e6675736f74616f2e6f72672475696e622d74657374","id":"1"}
```
After receiving the response, we need to decode the result using scale codec. The `Broker`'s definition is shown below:
```
#[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, TypeInfo)]
pub struct Broker<AccountId, Balance, BlockNumber> {
    pub beneficiary: AccountId, // 32-bytes pubkey
    pub staked: Balance, // 128-bits unsigned integer
    pub register_at: BlockNumber, // 4-bytes unsigned integer
    pub rpc_endpoint: Vec<u8>,
    pub name: Vec<u8>,
}
```
We need to define a struct which has a same codec structure with the definition, for Rust, we could simply copy the definition and replace the generic type with `AccountId32`, `u128` and `u32`.

Sometime we don't know any `Broker` accounts and would like to fetch all the brokers just like iterate all the keys over a HashMap. Substrate provides a `state_getKeysPaged` rpc to do that. Back to the step of calulating `StoragePrefix`, we could directly get all the keys start with the prefix:
```
wscat -c wss://gateway.testnet.octopus.network/fusotao/erc8ygm5qvmi2fw23ijpvzgpzzto47mi
> {"id":262,"jsonrpc":"2.0","method":"state_getKeysPaged","params":["0x5ebf094108ead4fefa73f7a3b13cb4a7379c21ecab4e77259ea5abd8011f197f",1000,"0x5ebf094108ead4fefa73f7a3b13cb4a7379c21ecab4e77259ea5abd8011f197f"]}
< {"jsonrpc":"2.0","result":["0x5ebf094108ead4fefa73f7a3b13cb4a7379c21ecab4e77259ea5abd8011f197f6063c21c8ce8ffd4deb0d04f7fca36b9b6c7eb6574b112ef69e413d94f83969f8f9906b7aaf1699b3f940b1bc3e93134","0x5ebf094108ead4fefa73f7a3b13cb4a7379c21ecab4e77259ea5abd8011f197fffd001f21765364c7b035e8896d1be80b015f2b9d63d5469d6b82ca1954cdb50910ffd5d598a7cd7882844652eac1012"],"id":262}
```

The low-level JSON-RPC is powerful enough but not very convenient to use. Luckily, the [Polkadotjs](https://polkadot.js.org/docs/substrate/storage) provides a easy way to access the on-chain storage. 

NOTICE: the polkadotjs uses dynamic code generation according to the runtime metadata to encapsulate the JSON-RPC and expose via `api.query.<module>.<method>`. Some modules in the docs are not included in Fusotao runtime while some modules in Fusotao runtime are not shown in the docs, but developers still could access all the Fusotao storage via Polkadotjs. For all modules of Fusotao runtime, please refer to the [Fusotao Runtime Modules](/fusotao-runtime-modules) or check the online [RPC endpoint](https://polkadot.js.org/apps/?rpc=wss://gateway.mainnet.octopus.network/fusotao/0efwa9v0crdx4dg3uj8jdmc5y7dj4ir2#/explorer).

### Transaction

TODO

### Open Trading API

The open trading API is not a part of the runtime layer.

| Method                      | Parameters                                                    | Description                                     |
|-----------------------------|---------------------------------------------------------------|-------------------------------------------------|
| `broker_trade`              | `[prover_account, cmd, digest, nonce]`                        | Place an order or cancel an order               |
| `broker_queryPendingOrders` | `[prover_account, user_account, trading_pair, digest, nonce]` | Query all pending orders of a trading pair      |
| `broker_queryAccount`       | `[prover_account, user_account, digest, nonce]`               | Query account balances authorized to the prover |
| `broker_registerTradingKey` | `[prover_account, user_account, x25519_pubkey, signature]`    | Register a trading key for the current user     |
| `broker_getNonce`           | `[prover_account, user_account]`                              | Retrieve the nonce of the current user          |
| `broker_subscribeTrading`   | `[prover_account, user_account, digest, nonce]`               | Subscribe the order change events.              |

TODO

1. **Include broker nodes in your program**

You could either pre-indicate a broker node (e.g. your own node) or read the available broker list from on-chain storage then provide them to your users.

2. **Establish a websocket connection with the broker node**

The broker node is a full chain node but with the extra Open Trading API endpoints.

3. **Include the prover account**

Currently, there is only one well-known prover in the mainnet: 
     **```5FEuM9duAJ7ZwuuxkytbYdzikGNMDUpUDiVm7xL8ascSXVbv```**    
You could just hard-code it for convenience or read it from the on-chain storage.

4. **Authentication**

The authentication is a Diffie–Hellman key exchange procedure:
```
// randomly generate a x25519 key pair
var user_prikey = x25519_dalek::generate_rand();
// get prover pubkey from on-chain storage: verifier#DominatorSettings
var prover_pubkey = ... 
// calculate the shared secret, will be used later as the trading key
var shared_secret = user_prikey.shared_secret(prover_pubkey);
```
Note: the authentication is between users and the prover rather than with the node, so the shared secret and x25519 secret key must be kept in private.

5. **Register the trading key**

To let the prover knows that the trading key is generated from the account, the x25519 pubkey need to be signed using the personal sr25519 prikey:
```
var user_x25519_pubkey = user_prikey.pubkey();
var signature = user_sr25519_key.sign(user_x25519_pubkey);
```
Send the `broker_registerTradingKey`, if everything goes well, a `nonce` in scale codec with hex format will be replied:
```
wscat -c wss://testnet-sidecar.fusotao.org
> {"id":"1","jsonrpc":"2.0","method":"broker_registerTradingKey","params":["5GxCNDyhqv2hx2zcQfse58vLWcueJKMjXPTgzcJbi9khtNrf","5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty","0xa0c867a0915cb07fb3d38ddd929fbe683f93b8337f980fa4fa83728c36fa615a","0x2e695451a138f5d395ea1743618cd7aa30e91f47980d9afcbe18535ad4e9d53914e306121e074767067b2a199964616a969ddf930726ff2440fd0a3b3235ed85"]}
< {"jsonrpc":"2.0","result":"0x651d0000","id":"1"}
```

TODO 

6. **Request**

The `broker_trade`, `broker_queryPendingOrders`, `broker_queryAccount`, `broker_subscribeTrading` requests must contain a `blake2b_256` digest and the nonce:
```
// broker_trade:
var data = scale_encode(cmd);
var digest = blake2b_256(data, trading_key, nonce);
// broker_queryAccount:
var digest = blake2b_256([], trading_key, nonce);
// broker_queryPendingOrders:
var digest = blake2b_256(trading_pair, trading_key, nonce);
```
After a request sent, the nonce should be increased by 1.

NOTE: all the parameters of blake2b hash function should be scale-encoded.

7. **Response**

```
broker_queryPendingOrders -> [scale_encoded_hex: Order]
pub struct Order {
    order_id: u64,
    symbol: Symbol,
    direction: u8,
    create_timestamp: u64,
    amount: String,
    price: String,
    status: u8,
    matched_quote_amount: String,
    matched_base_amount: String,
    base_fee: String,
    quote_fee: String,
}

broker_queryPendingOrders -> [scale_encoded_hex: Account]
pub struct Account {
    currency: u32,
    available: String,
    freezed: String,
}

broker_trade -> scale_encoded_hex: u64
broker_getNonce -> scale_encoded_hex: u32
broker_registerTradingKey -> scale_encoded_hex: u32

```

## Prover (Out-of-date)

This section will introduce how to use Galois as a Fusotao proving client.

### Compiling Galois

Same as compiling Fusotao node, #[Rustup](https://rustup.rs/) is essential. After rustup is installed, download the recent release from [Galois Release](https:/github.com/uinb/galois/releases) and compile it in release mode with all features enabled:

```
cargo build --release --all-features
```

### Configurations

The configuration file of Galois looks like below, simply copy it and modify later:

```
[server]
# Listening address
bind_addr = "127.0.0.1:8097"

[mysql]
# Mysql server
url = "mysql://username:password@localhost:3306/galois"

[redis]
# Galois uses redis to publish the orderbook. This might be deprecated in the future
url = "redis://localhost:6379/0"

[sequence]
# Dump the memory very x events
checkpoint = 100000
# The folder where to save the coredump file and block scanning position
coredump_dir = "/var/galois"
# Batch executing commands
batch_size = 1000
dump_mode = "disk"
# Duration of fetching commands from the mysql
fetch_intervel_ms = 5

[fusotao]
# The Fusotao node rpc address
node_url = "ws://localhost:9944"
# The private key of Sr25519 used for submitting proofs, it can be generated by the `subkey` tool
key_seed = "//Alice"
# Batch submitting proofs, recommend 300
proof_batch_limit = 300
# When register the matcher on-chain
claim_block = 1
enable_from_genesis = true
# need to setup the associated pubkey on chain
x25519_priv = "0x8e51362c8a14f9183b5a33d26cd0bd39931c78ff7ca73c1d7ab76722d11b487c"

```

### Initializing dependencies

Galois depends on mysql to record all user commands including ask/bid/cancel, as well as the trading pair management commands. There are 3 groups of mysql table you must create before launching Galois:

- t_sequence (the incoming events, VERY IMPORTANT, CAN NOT BE DELETED OR DROPED)
- t_proof (where to store the proofs, can be re-generated after Galois reboot)
- t_clearing_result_{base}_{quote} (replace the place holder with the real currency codes)

All the essential sql table schemas have been included in the file `sql/init.sql`, simply importing it is ok.
Another dependency is Redis which is used for dumping the orderbook(user perspective) periodically. It might be deprecated in the future.

### Encrypting the file

Some of the configurations are sensitive, you may need to encrypt it. Galois provides a simple tool to generate a encrypted config file.

After filling the config file correctly, simply run the encryption tools:

```
MAGIC_KEY=REPLACE_WITH_YOUR_KEY target/release/galois -c galois.toml encrypt-config
```

Now you will get an encrypted configuration file looks like below:

```
[server]
bind_addr = "127.0.0.1:8097"

[sequence]
coredump_dir = "/var/galois"
checkpoint = 100000
batch_size = 1000
dump_mode = "disk"
fetch_intervel_ms = 5
enable_from_genesis = true

[mysql]
url = "kJVQl967ugZL2ngFdFKqhy2R71qwhziKbFOWB5TjWm2AFspJpU6PPGTlo/2+D08P"

[redis]
url = "fuQ/5X23NQN//94tl7wAn9eruMHS9UtWED7fZn2OV1U="

[fusotao]
node_url = "ws://localhost:9944"
key_seed = "IvIDN8Dg9Vo="
claim_block = 1
proof_batch_limit = 300
x25519_priv = "H4sIAKj/J2QAA8suTslKyylOyU5LKU4rTkkr5gIAHgi+IhIAAAA="
```

### Launching Galois

To make Galois understand the encrypted information, you need to indicate a same MAGIC_KEY through the environment:

```
MAGIC_KEY=SAME_KEY_WITH_THE_ENCRYPTION_STEP target/release/galois -c galois.toml
```

Now Galois is waiting for the incoming commands.

### Registering the prover

In the #[Configurations](#Configurations) section, we have filled the `key_seed` with the well-known `Alice`. Beyond the test, we should generate a real private key and register the address on Fusotao chain to enable submitting proofs.    
The easiest way to generate a private key is to use the #[subkey](https://github.com/paritytech/subkey) tool developed by the Parity team:

```
$subkey generate
Secret phrase:       income repair trouble apart work memory divorce famous short vintage device virus
  Network ID:        substrate
  Secret seed:       0x8e51362c8a14f9183b5a33d26cd0bd39931c78ff7ca73c1d7ab76722d11b487c
  Public key (hex):  0xaea8cab5dfbb3b8c24ecc15d6abfbb1e9387565747078d36fd2da37c5b148201
  Account ID:        0xaea8cab5dfbb3b8c24ecc15d6abfbb1e9387565747078d36fd2da37c5b148201
  Public key (SS58): 5G1iL8tcFL7h3F9W8uvEDWq5zRvjrjDk2ymFJUjxMgZ3CNZp
  SS58 Address:      5G1iL8tcFL7h3F9W8uvEDWq5zRvjrjDk2ymFJUjxMgZ3CNZp
```

The registry procedure is an on-chain transaction. To submit the extrinsic, you need some $TAO tokens in your address to pay the gas fees. If you are testing Galois and already installed a Fusotao node, simply transfer some from the endowed accounts, otherwise, contact the Fusotao team for help.
Then, import the menomnic phrase into Polkadotjs or Avatar wallet and submit the extrinsic on [Fusotao Mainnet RPC Endpoint](https://polkadot.js.org/apps/?rpc=wss://gateway.mainnet.octopus.network/fusotao/0efwa9v0crdx4dg3uj8jdmc5y7dj4ir2#/explorer)(Click the left upper corner to switch to your local node if you are testing).
In the page, select `verifier`, `register`, and input the dex's name you like, then click 'Submit Extrinsic'.

![](/register-dex.png)
The final step of registering a DEX is to make a PR to our [Github Repo](https://github.com/uinb/fusotao-registry) where to save dex's name, logo and url:

```
{
  "fxdx": {
    "name": "fxdx",
    "website": "https://testnet.fxdx.finance",
    "address": "5GxCNDyhqv2hx2zcQfse58vLWcueJKMjXPTgzcJbi9khtNrf",
    "logo": "https://testnet.fxdx.finance/fxdx.png"
  }
  // add your information here
}
```


### Testing authorizing and revoking

Different from CEXs, the trading platforms upon Fusotao don't hold any users' assets, instead, users shall use the `Authorize` and `Revoke` transactions to deposit and withdraw. After a prover registered, users can submit a `Authorize` transaction to authorize some tokens to it and that will issue a receipt on chain. If everything goes well, the prover will automatically execute a `TRANSFER_IN` command and submit the associated proof back to remove the receipt. The `Revoke` transaction is the similar procedure.


### Listing pairs

Fusotao chain doesn't support any smart contract right now. All the tokens are from other chains and must be registered on the bridges.    
Currently, Fusotao support 3 kinds of foreign tokens:
- NEP141 (OctopusBridge maintained by the Octopus Team)
- ERC20 (ChainBridge maintained by the Fusotao Team)
- BEP20 (ChainBridge maintained by the Fusotao Team)

Before listing tokens, DEX operator must submit the token information on the #[page](#) since the registration must be setup on the both sides.
If the token already registered, the remain steps are quite simple:

1. Execute the mysql command 

```create table t_clearing_result_{base}_{quote} like t_clearing_result;```

to create a new table.

*NOTICE*: the base and quote are not inner codes but legal token code on Fusotao chain. See #[Assets](#Assets).

2. Insert the openning command into the `t_sequence`


```insert into t_sequence(f_cmd) values('{"base":0,"quote":1,"base_scale":2,"quote_scale":4,"taker_fee":"0.002","maker_fee":"0.002","min_amount":"0.1","min_vol":"10","enable_market_order":false,"open":true,"cmd":13}');```

For more details of the commands, please refer to the [README](https://github.com/uinb/galois).

### Testnet

TODO
