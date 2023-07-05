1. Upgrade Box -> BoxV2
2. Proxy -> Box
   -> BoxV2

3. Deploy a Proxy Manually
4. hardhat-deploy built in proxy
5. OpenZeppelin upgrades plugin

```shell
yarn
yarn install
```

To deploy the contract

```
yarn hardhat deploy
```

To Upgrade the contract version from Box -> BoxV2

```
yarn hardhat run scripts/upgrade-box.js --network localhost
```
