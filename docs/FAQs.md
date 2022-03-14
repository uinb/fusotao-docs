# Fusotao FAQs

## Technology

##### 1.What is Fusotao Protocol?

Fusotao Protocol is a verification protocol for order-book based matching systems, using the paradigm of “execute off-chain, verify on-chain”. Founders can build their own DEXs backed by Fusotao. Communities can earn rewards by trading on the DEXs or directly staking tokens for the DEXs backed by Fusotao Protocol to earn transaction fees from them. The FXDX to be launched, will be the first order-book based DEX backed by Fusotao Protocol, as well as the first DEX in the whole NEAR ecosystem. 

##### 2.Why do we build Fusotao Protocol?


All the cryptocurrency holders need to trade their assets on some platforms. The Fusotao team realized that trading on CEXs due to hack cases and DEXs due to high transaction fees and low efficiency and user-friendliness is risky. Trading and investing in crypto carries risk regardless of which type of exchange one uses. Centralized exchanges (CEX) present risks such as hacks and foregoing asset custody, while decentralized exchanges (DEX) present the challenge of high transaction fees and low efficiency. Fusotao intends to disrupt this by providing a user-friendly order-book based DEX with zero-cost gas, low latency, and high security.

##### 3.What are the components or technical specs of the project? What will the final deliverables look like?


Fusotao Protocol is composed of two core components: A blockchain acts as the verifier and an off-chain matching system acts as the prover. Currently, we have built the blockchain based on the substrate as a standalone blockchain, by cooperating with the Octopus Network we can bridge to NEAR and other substrate-based application chains. By trading on a Fusotao integrated trading platform, users do not need to transfer coins to the platform, instead, they just need to authorize coins. After the authorization is completed, only the state is changed from “free” to “reserved” state, and coins are still kept in your wallet. The“reserved” status of coins will not change until the off-chain prover outputs proofs. The off-chain prover is a standard matching engine just like other CEX matching systems with an extra proving engine. The matcher will update the states within it immediately but the assets won't be changed until the proofs are verified.

##### 4.Which components of the project will be open source?

All of our components are fully open-source. The matching system is offered to founders who would like to build a reliable DEX.

To have a better understanding, please review our Technical Greenbook: [Fusotao Technical Greenbook](https://www.fusotao.org/fusotao-greenbook.pdf).

##### 5.Competitiveness and advantages

We know that many public blockchain ecosystems have their own order-book DEXs. If we are building a DEX, there will be many competitors in any blockchain. However, we are a decentralized infrastructure that can provide support for order book DEXs. Any founder can develop his own order book DEX based on our matching and verification protocol. We don't find any team doing similar things with us at present.

What is the difference between the DEX on Fusotao and the existing DEXs?

**The existing DEXs or CEXs:**

- Slow tradingspeed, latency exists
- Have to pay gas fee
- DEX's trading experience is not as good as CEX's
- Need to transfer assets to the exchange                               	
- Users are unable to control assets and worry about the platform going down and leaving with their tokens!

**Advantages for DEXs backed by Fusotao Protocol:** 

- 0 GAS Fees for transactions in the DeFi World
- Order-book based
- Faster than Swap(off-chain matching)
- The Same Trading Experience as CEXs 
- Assets are always at the user's control
- The Community can share transaction fees by staking TAO for the DEXs backed by Fusotao

##### **6. What’s the difference between Fusotao and zk-SNARKs?**

zk-SNARKs is a common solution for the Polynomial problem. Generally speaking, zk-SNARKs can be used for verifying something without recalculating it. there are 3 reasons we need to consider using zk-SNARKs:

1. recalculating it is complex measured in space

2. recalculating it is complex measured in time

3. something needs to be hiddenIn the blockchain

1st and 2nd are very important. But as a matching engine, the time cost of recalculating it is acceptable, or even less than verifying by zk-SNARKs. So far, compared to the zero-knowledge proving, generating merkle proofs without zk-SNARKs is much cheaper. That's why we don't use zk-SNARKs in Fusotao. 

![img](https://miro.medium.com/max/840/0*rzcqC9wlnFcAzQsM)

##### **7. How can the DEXs backed by Fusotao work with 0 gas?**

The orders from the users are sent directly to the off-chain matcher and executed off-chain,so the users need not to pay the gas fee. The verifier on-chain is responsible for verifying the correctness of the status modification. For the DEXs or the matchers, they should pay the gas since it is the invoker, but if the proofs they submit are verified, the gas would be returned by the validators. In another word, only the invalid proofs will be charged.

##### **8. How does Fusotao ensure security?**

Fusotao uses the paradigm of “execute off-chain, verify on-chain”. We have a centralized service off-chain to store the order book and match the trading order. After the off-chain matching, the protocol will verify it on-chain. That means the assets are always in the user's control and always on-chain. In addition, Fusotao will collaborate with Octopus Network to ensure blockchain security and enable Fusotao’s interoperability with NEAR or any IBC-enabled blockchain. 

##### **9. Which chains will Fusotao function with?**

Our substrate-based application chain validated by Octopus network.Fusotao is an appchain that joins Octopus Network and is part of the Near ecosystem, as tokens on both NEAR and Octopus Chain are first online to order-book based DEXs (FXDX) on Fusotao.Fusotao is a side-chain connected with NEAR mainnet through a light-client bridge which is different from oracle.

##### **10. Does it hop over to Aurora and have the EVM compatibility?**

EVM no, actually the bridge is provided by Octopus network, as far as I know, NEAR is the first choice.

##### **11. Which wallet will be used for Fusotao in testnet and mainnet?**

Polkadot wallet and Fusotao wallet.Because substrate moves fast, we must keep up with the technical progress to promise the runtime compatible with Polkadot wallet

##### **12.What’s the long-term vision?**

Fusotao Protocol is a decentralized infrastructure for order-book based DEX. Our immediate mission is to support a number of founders to build their own order-book based DEXs on our blockchain by using our matching engine and verification protocol. In the near future, Fusotao aspires to be a core component in driving the development of DeFi using its high performance and high-security features.

##### 13.Roadmap

**Done**:

1. The verifier implementation over Substrate
2. Standard matching engine with proving procedure
3. Wallet extension4. Exchange broker and Web UI 

**2022 Q1**

1. Proving optimization
2. Shared orderbook
3. Cooperation with Octopus Network
4. IDO on Skyward Finance
5. Testnet online and expand the community. Aim to get 1000 users to participate in the testnet
6. The first order-book based DEX FXDX online 

**2022 Q2**

1. Marketing sub-protocol
2. Mainnet launch, a new journey
3. Community governance by staking for more DEX. Make Fusotao a safer, more general, more decentralized and more open financial infrastructure.

## **TOKENOMICS**

##### **1. Token distribution**

The total amount of TAO tokens is 100 million. 63% of TAO tokens will be allocated to community members including trading rewards (Proof-of-Trading,48% of the total token supply), validator rewards (Proof-of-Validator,7.5% of the total token supply), TAO staking rewards (Proof-of-Staking, 7.5% of the total token supply).

Among the rest 37% of total token supply, 8% will be distributed to the FusotaoTeam, 12.5% to the Investors, 2.5% to the public sale,	4% to the Initial Liquidity, 1% to the Testnet Rewards, 3% to Ecosystem Developers and Marketing, 6% to Fusotao Foundation. Check the [Fusotao Economy Whitepaper](https://www.fusotao.org/fusotao-whitepaper.pdf) to learn the vesting schedules.

![img](https://miro.medium.com/max/840/0*2VEZEG9cFRk94krE)

![img](https://miro.medium.com/max/840/1*6mASvb7tSieyK5g19ws0kw.png)

##### 2. TAO token Usage Scenarios

As the native utility token of the Fusotao Protocol, TAO not only represents the rights of the holder, but also has actual value. TAO can be used in the following scenarios.

###### 1. Governance Token

Fusotao is a decentralized infrastructure with deep participation and leadership of the community. TAO is the only certificate of community participation in governance.

- TAO holders with a certain number of TAO can initiate upgrade proposals, such as adjusting gas, changing the reward distribution of liquidity provision pool, and putting forward TAO long-term incentives.
- All TAO holders can vote on proposals, and the proposal with a majority of votes will be adopted and implemented by the development team.
- If the project team plans to build a new DEX on the Fusotao Protocol, it needs to reach the minimum number of votes before it goes online.

###### 2. Gas Fee

TAO tokens can be used to pay gas fees on the Fusotao Protocol application Chain.

###### **3. Stake to Earn Transaction Fees**

The Fusotao protocol is a decentralized blockchain network. Community users can directly share transaction fees through staking TAO Tokens for the DEXs backed by Fusotao Protocol.

###### **4. Trading Rewards**

Users who hold TAO tokens in the on-chain wallet and trade on the DEXs backed by the Fusotao Protocol can earn rewards through PoT.

## COMMUNITY

##### 1. How can I join the Fusotao community?

Fusotao Protocol will be open-source. Find the Fusotao community on [Telegram](https://t.me/fusotao), [Discord](https://discord.gg/uhhWEzfVZX), follow us on [Twitter](https://twitter.com/FusotaoProtocol), [YouTube](https://youtu.be/NjwhsonPdHM) and [Medium](https://medium.com/fusotao-protocol) for the latest announcements, get more information on [Website](https://www.fusotao.org/) and [GitHub](https://github.com/uinb).

##### 2. What incentive program is ongoing?

A totally 200k $TAO airdrop event for the community is ongoing. [Fusotao Airdrop!](https://medium.com/fusotao-protocol/additional-airdrop-of-102-500-tao-for-top-5-000-in-the-entries-leaderboard-ec09121b216c)

The testnet incentive program will kick off soon and 500k $TAO will be allocated to the participants as rewards. Please stay tuned.

##### 3. The Benefits of Participating in the Fusotao Protocol

Fusotao Protocol is a completely decentralized and non-licensed community protocol. Therefore, most of the $TAO tokens will be generated by community mining and distributed to community members who maintain the operation of the Fusotao Protocol and carry out transactions.

63% of \$TAO tokens will be allocated to community members participating in the Protocol, that is, community traders, blockchain validators and ​\$TAO staking participants. They are the main contributors to ensure the stable operation of the Fusotao Protocol and realize the zero-cost, high-speed and safe transaction. The three participants will get $TAO rewards through PoT, PoV and PoS.

1. Trading Rewards: Proof-of-Trading (PoT). The trading itself is the core of the whole system. Fusotao Protocol introduces the Proof-of-Trading to motivate transactions to get TAO rewards. When users trade on DEXs backed by the Fusotao Protocol, they will get TAO tokens according to the trading volume.
2. Validator Rewards: Validator nodes of the Fusotao Protocol are provided by the Octopus Network which uses Leased Proof-of-Stake(LPoS) to secure the permissionless network. Community users can obtain TAO rewards by becoming a validator node or staking OCT to verification nodes in the Octopus Network.
3. TAO Staking Rewards: Proof-of-Staking (PoS). Apart from these above, In order to incentivize the long-term holders of TAO tokens, the Fusotao Protocol will also support TAO token staking after the mainnet is launched.
4. Share transaction fees: Community users can directly share transaction fees through staking TAO Tokens for the DEXs backed by Fusotao Protocol.

##### 4. IDO is when and where? How specific is the IDO?

We will launch IDO on Skyward, the most popular launchpad platform in the NEAR ecosystem, and the IDO price on Skyward Finance is not fixed.

Many investors who do not have the opportunity to get involved in our private sale will participate in IDO.

In addition, all the early investors will contribute to our IDO in some aspects. For example, Octopus network will airdrop 200k OCT to the community members participating in our IDO.

##### 5. How can token holders get their tokens?

Fusotao Protocol has its own native utility token-aptly named ‘TAO’, which is both a NEP-141 token and a substrate native token.

NEP-141 token is transferred via NEAR wallet. and substrate native token is transferred via the browser extension of Fusotao.

##### 6. When will the rewards be distributed?

The rewards got from participating in the contests or activities we held before will be allocated once the main network is launched. The airdrop and the testnet rewards will be allocated at one time three months after the mainnet is launched.

##### 7. Do you have a global ambassador program or referral rewards system or bonuses for newcomers to your community?

Yes, we have a global ambassador program and we have regional community managers to help us promote and manage the community so far. As to referral rewards, of course, our airdrops are underway, and you can participate in it by inviting people via your referral link, more invitations, more entries, more Airdrops.

