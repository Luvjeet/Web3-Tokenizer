require("dotenv").config({
  path: "C:/Users/lovej/OneDrive/Documents/Tokenization_Project/.env",
});
const MyToken = artifacts.require("MyToken");
const chai = require("./setupChai");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("Token Test", async (accounts) => {
  [deployerAccount, recipient, anotherAccount] = accounts;

  beforeEach(async () => {
    this.myToken = await MyToken.new(process.env.INITIAL_TOKENS);
  });

  it("all tokens should be in my account", async () => {
    let instance = this.myToken;
    let totalSupply = await instance.totalSupply();
    return expect(
      instance.balanceOf(deployerAccount)
    ).to.eventually.be.a.bignumber.equal(totalSupply);
  });

  it("is not possible to send more tokens than account 1 has", async () => {
    let instance = this.myToken;
    let balanceOfDeployer = await instance.balanceOf(deployerAccount);

    await expect(instance.transfer(recipient, new BN(balanceOfDeployer + 1))).to
      .eventually.be.rejected;

    return expect(
      instance.balanceOf(deployerAccount)
    ).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
  });

  it("is possible to send tokens between accounts", async () => {
    const sendToken = 1;
    let instance = this.myToken;
    let totalSupply = await instance.totalSupply();
    await expect(
      instance.balanceOf(deployerAccount)
    ).to.eventually.be.a.bignumber.equal(totalSupply);
    await expect(instance.transfer(recipient, sendToken)).to.eventually.be
      .fulfilled;
    await expect(
      instance.balanceOf(deployerAccount)
    ).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendToken)));
    return expect(
      instance.balanceOf(recipient)
    ).to.eventually.be.a.bignumber.equal(new BN(sendToken));
  });
});
