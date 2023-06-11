# RPC

RPC is the direct way to interact with Fusotao, following the [JSON-RPC 2.0](https://jsonrpc.org) standard. Fusotao supports both HTTP and WebSocket as the trasport layer. 

Similar to the web3.js library for Ethereum-based chains, there is a polkadot.js library that encapsulates the low-level JSON-RPC and encoding/decoding for Substrate-based chains.

## Runtime API tutorials

Since JSON-RPC is the way to interact with Fusotao node, while SCALE Codec is a kind of binary format, the encoded data is usually represented in the form of literal string with hex format. Below are some examples:

```
60 // number
=> '0x' + hex(scale_encode(60)) => 0x3c000000

0x7ad7aa7004615afd22edc830a8a7ab26d5531e066d4f0e4da9c467598fc856eb // fixed-size bytes
=> 0x7ad7aa7004615afd22edc830a8a7ab26d5531e066d4f0e4da9c467598fc856eb

{ i: 60, g: 'abcd' } // object
=> '0x' + hex(scale_encode(60)) + hex(scale_encode('abcd')) => 0x3c0000000461626364

[1, 2] // tuple
=> '0x' + hex(scale_encode([1, 2])) => 0x0100000002000000 
```

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

Sometime we don't know any `Broker` accounts and would like to fetch all the brokers just like iterate all the keys over a HashMap. There is a `state_getKeysPaged` rpc method to do that. Back to the step of calulating `StoragePrefix`, we could directly get all the keys start with the prefix:
```
wscat -c wss://gateway.testnet.octopus.network/fusotao/erc8ygm5qvmi2fw23ijpvzgpzzto47mi
> {"id":262,"jsonrpc":"2.0","method":"state_getKeysPaged","params":["0x5ebf094108ead4fefa73f7a3b13cb4a7379c21ecab4e77259ea5abd8011f197f",1000,"0x5ebf094108ead4fefa73f7a3b13cb4a7379c21ecab4e77259ea5abd8011f197f"]}
< {"jsonrpc":"2.0","result":["0x5ebf094108ead4fefa73f7a3b13cb4a7379c21ecab4e77259ea5abd8011f197f6063c21c8ce8ffd4deb0d04f7fca36b9b6c7eb6574b112ef69e413d94f83969f8f9906b7aaf1699b3f940b1bc3e93134","0x5ebf094108ead4fefa73f7a3b13cb4a7379c21ecab4e77259ea5abd8011f197fffd001f21765364c7b035e8896d1be80b015f2b9d63d5469d6b82ca1954cdb50910ffd5d598a7cd7882844652eac1012"],"id":262}
```

The low-level JSON-RPC is powerful enough but not very convenient to use. Luckily, the [Polkadotjs](https://polkadot.js.org/docs/substrate/storage) provides a easy way to access the on-chain storage. 

> NOTICE: the polkadotjs uses dynamic code generation according to the runtime metadata to encapsulate the JSON-RPC and expose via `api.query.<module>.<method>`. Some modules in the docs are not included in Fusotao runtime while some modules in Fusotao runtime are not shown in the docs, but developers still could access all the Fusotao storage via Polkadotjs. For all modules of Fusotao runtime, please refer to the [Runtime API specs](#runtime-api-specs) or check the online [RPC endpoint](https://polkadot.js.org/apps/?rpc=wss://gateway.mainnet.octopus.network/fusotao/0efwa9v0crdx4dg3uj8jdmc5y7dj4ir2#/explorer).

## Runtime API specs

TODO

## Open Trading API

The open trading API is not a part of the runtime layer.

| Method                    | Parameters                                                  | Description                                     |
|---------------------------|-------------------------------------------------------------|-------------------------------------------------|
| broker_trade              | [prover_account, user_account, cmd, digest, nonce]          | Place an order or cancel an order               |
| broker_queryPendingOrders | [prover_account, user_account, trading_pair, digest, nonce] | Query all pending orders of a trading pair      |
| broker_queryAccount       | [prover_account, user_account, digest, nonce]               | Query account balances authorized to the prover |
| broker_registerTradingKey | [prover_account, user_account, x25519_pubkey, signature]    | Register a trading key for the current user     |
| broker_getNonce           | [prover_account, user_account]                              | Retrieve the nonce of the current user          |
| broker_subscribeTrading   | [prover_account, user_account, digest, nonce]               | Subscribe the order change events.              |

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
// or use secp256k1 (NOTICE: we follow the Ethereum `personal_sign` spec, an extra prefix must be included in the signing message, please refer to [Metamask docs](https://github.com/ethereum/go-ethereum/pull/2940))
var signature = user_secp256k1_key.personal_sign(user_x25519_pubkey without 0x);
```
Send the `broker_registerTradingKey`, if everything goes well, a `nonce` in scale codec with hex format will be replied:
```
wscat -c wss://broker-rpc.fusotao.org
> {"id":"1","jsonrpc":"2.0","method":"broker_registerTradingKey","params":["5GxCNDyhqv2hx2zcQfse58vLWcueJKMjXPTgzcJbi9khtNrf","5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty","0xa0c867a0915cb07fb3d38ddd929fbe683f93b8337f980fa4fa83728c36fa615a","0x2e695451a138f5d395ea1743618cd7aa30e91f47980d9afcbe18535ad4e9d53914e306121e074767067b2a199964616a969ddf930726ff2440fd0a3b3235ed85"]}
< {"jsonrpc":"2.0","result":"0x651d0000","id":"1"}
```

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
The `broker_trade` contains a complex data type parameter which should be encoded:
```
#[serde(rename_all = "camelCase")]
pub enum TradingCommand {
    Ask {
        base: u32, // currency id of the base currency
        quote: u32, // currency id of the quote currency
        amount: String, // decimal of the amount, e.g. "0.258"
        price: String, // decimal of the price, e.g. "3.141592"
    },
    Bid {
        base: u32,
        quote: u32,
        amount: String,
        price: String,
    },
    Cancel {
        base: u32,
        quote: u32,
        order_id: u64,
    },
}
```
For some languages don't have tuple type, the parameter can be encoded equally:
```
Ask: '0x00' + scale-encode(u32) + scale-encode(u32) + scale-encode(String) + scale-encode(String)
Bid: '0x01' + scale-encode(u32) + scale-encode(u32) + scale-encode(String) + scale-encode(String)
Cancel: '0x02' + scale-encode(u32) + scale-encode(u32) + scale-encode(u64)
```

> Everytime a request sent, no matter it succeed or failed, the nonce should be increased by 1.

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
    status: u16,
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

