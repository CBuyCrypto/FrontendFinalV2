/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("dotenv/config");

const { HARDHAT_PORT } = process.env;

module.exports = {
  solidity: "0.7.3",
  networks: {
    localhost: { url: `http://127.0.0.1:${HARDHAT_PORT}` },
    hardhat: {
      accounts: [{"privateKey":"0x520553c2306f9271bbf5118797a2e7f46ed432bc13e8ac74252bff8ca71fd878","balance":"1000000000000000000000"},{"privateKey":"0x2aec842d231100b7c5dc412de5a1728b93f8b932a09c1e514155a52c9039f126","balance":"1000000000000000000000"},{"privateKey":"0x3f0ea8de2c68a38330e63ff43ebdb99176265b2b992d5076e8a9e14e56025e62","balance":"1000000000000000000000"},{"privateKey":"0x76872e16e8ea2653e16900b995dcc67d0923e6ae6fb6276e71afd9e0b8bba2ec","balance":"1000000000000000000000"},{"privateKey":"0x9487c6ec102f2d302d1da7295fbf67b19787d3dd52d638c385a6dfdc7230a41b","balance":"1000000000000000000000"},{"privateKey":"0xb467b64635eaf8fe5a33e24d5433d451f89037916eb185df1112ca06de05539d","balance":"1000000000000000000000"},{"privateKey":"0x75921fa563881c7023ea986db8864843a91980e73e4903df3b56652fa2dfd994","balance":"1000000000000000000000"},{"privateKey":"0xbaec62236313bfeaa948a317e35b94e3b9a105612e01da3bc03f5fade360cb84","balance":"1000000000000000000000"},{"privateKey":"0xc2a68873541711e289776e8bb285de7b8d0dd5795b18d66d1c60d576b4e67632","balance":"1000000000000000000000"},{"privateKey":"0xfbf29f8d30d39fb056c472f774b8fcae5a0d4f71b8289f619b82662bca229f97","balance":"1000000000000000000000"}]
    },
  },
  paths: {
    sources: './contracts',
    tests: './__tests__/contracts',
    cache: './cache',
    artifacts: './artifacts',
  },
};