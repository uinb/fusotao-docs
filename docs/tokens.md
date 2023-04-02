# Native Tokens

## Trading rewards

TODO

## Staking

Fusotao is a decentralized network without any permissions, anyone can register as a prover by signing an on-chain extrinsic `verifier#register`. Before a registered prover can submit proofs, some $TAO must be staked. Before the 5256000th block, it requires 80,000 $TAO to activate a prover.
As returns, the $TAO stakers can earn transaction fees from the DEX they staking for. On the opposite, as a serial system, the prover is highly sensitive in the incoming events. Any unexpected mistakes will cause the system interrupted. That's why the proving progress(PPI, Proving Performance Index) is very important to Fusotao Protocol. Every event will change the inner global state of the prover and should be submitted to the verifier to validate, if the proving progress of a prover falls behind the current block too much, it will be marked as `Evicted`. Once evicted, the DEX can't submit proofs anymore, nor accept staking.

## On-chain governance

TODO
