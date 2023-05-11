require("dotenv").config({
  path: "C:/Users/lovej/OneDrive/Documents/Tokenization_Project/.env",
});
let MyToken = artifacts.require("MyToken");
let MyTokenSale = artifacts.require("MyTokenSale");
let KycContract = artifacts.require("KycContract");

module.exports = async function (deployer) {
  let add = await web3.eth.getAccounts();
  await deployer.deploy(MyToken, process.env.INITIAL_TOKENS);
  await deployer.deploy(KycContract);
  await deployer.deploy(
    MyTokenSale,
    1,
    add[0],
    MyToken.address,
    KycContract.address
  );
  let instance = await MyToken.deployed();
  await instance.transfer(MyTokenSale.address, process.env.INITIAL_TOKENS);
};
