require("dotenv").config({
  path: "C:/Users/lovej/OneDrive/Documents/Tokenization_Project/.env",
});
const MyTokenSale = artifacts.require("MyTokenSale");
const MyToken = artifacts.require("MyToken");
const KycContract = artifacts.require("KycContract");
const chai = require("./setupChai");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("TokenSale Test", async (accounts) => {
  [deployerAccount, recipient, anotherAccount] = accounts;

  it("there shouldn't be any coins in my account", async () => {
    let instance = await MyToken.deployed();
    return expect(
      instance.balanceOf(deployerAccount)
    ).to.eventually.be.a.bignumber.equal(new BN(0));
  });

  it("all tokens should be in the TokenSale Smart Contract by default", async () => {
    let instance = await MyToken.deployed();
    let balanceOfTokenSales = await instance.balanceOf(MyTokenSale.address);
    let totalSupply = await instance.totalSupply();
    return expect(balanceOfTokenSales).to.be.a.bignumber.equal(totalSupply);
  });

  it("should be psossible to buy tokens", async () => {
    let tokenInstance = await MyToken.deployed();
    let tokenSaleInstance = await MyTokenSale.deployed();
    let kycInstance = await KycContract.deployed();
    let balanceBeforeAccount = await tokenInstance.balanceOf.call(recipient);

    await expect(
      tokenSaleInstance.sendTransaction({
        from: recipient,
        value: web3.utils.toWei("1", "wei"),
      })
    ).to.be.rejected;
    await expect(balanceBeforeAccount).to.be.bignumber.equal(
      await tokenInstance.balanceOf.call(recipient)
    );
    await kycInstance.setKycCompleted(recipient);

    await expect(
      tokenSaleInstance.sendTransaction({
        from: recipient,
        value: web3.utils.toWei("1", "wei"),
      })
    ).to.be.fulfilled;
    return expect(balanceBeforeAccount + 1).to.be.bignumber.equal(
      await tokenInstance.balanceOf.call(recipient)
    );
  });
});
