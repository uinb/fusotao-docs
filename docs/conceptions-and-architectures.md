# Conceptions & Architectures

## Proof of Security

In the blockchain world, PoS often means Proof of Staking which is a type of consensus algorithm to organize the world-wide public network. PoS in Fusotao represents Proof of Security while DPoP(Delegated Proof of Participating, a little difference from DPoS) is the game theory-based consensus algorithm.

Generally speaking, PoS is the primary mining strategy in Fusotao, anyone compeleted the PoS will get reward from the network. The polynomial curve is shown below:

```
curve(0) = 800004.525
curve(t) = [t^2, t^1, t^0]•[924.203, 6007.320, 2010241.525]¬, t=[1..=50]
where t represents the nth term of the council
```

## Council

The council is consists of super nodes elected by referendum. Applicants can invoke the RPC during registration peroid to apply a seat of the council. All TAO holders can vote to a candidate and cause the assets locked until the end of current election. 

## Inspector

The inspector is a pre-setted oracle to verify foreign-chains' transactions by SPV.

## Receipt

TODO

## Token

TODO

## Self-Destruction

The self-destruction in Fusotao is not just burning TAOs. After the 51th term over, if the activities of Fusotao become lower and lower(measured by the blocks' average weight), a referendum about self-destruction will be automatically issued.