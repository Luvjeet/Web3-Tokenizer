import React, { useEffect, useState } from "react";
import "./App.css";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KYC from "./contracts/KycContract.json";
import getWeb3 from "./utils/getWeb3.js";

function App() {
  const [Web3, setWeb3] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState(0);
  const [instances, setInstances] = useState({});
  const [kycAddress, setKycAddress] = useState("0x123...");
  const [tutorialtokenAddress, setTutorialTokenAddress] = useState("");
  const [tokenSaleAddress, setTokenSaleAddress] = useState("");

  useEffect(() => {
    const init = async () => {
      const Web3 = await getWeb3(setAccounts);
      const accounts = await Web3.eth.requestAccounts();
      console.log(accounts);
      const networkId = await Web3.eth.net.getId();

      const TutorialTokenAddress =
        MyToken.networks[networkId] && MyToken.networks[networkId].address;
      const TutorialTokenInstance = new Web3.eth.Contract(
        MyToken.abi,
        TutorialTokenAddress
      );

      const TokenSaleAddress =
        MyTokenSale.networks[networkId] &&
        MyTokenSale.networks[networkId].address;
      const TokenSaleInstance = new Web3.eth.Contract(
        MyTokenSale.abi,
        TokenSaleAddress
      );

      const kycInstance = new Web3.eth.Contract(
        KYC.abi,
        KYC.networks[networkId] && KYC.networks[networkId].address
      );

      setWeb3(Web3);
      setAccounts(accounts);
      setInstances({ TutorialTokenInstance, TokenSaleInstance, kycInstance });
      setTutorialTokenAddress(TutorialTokenAddress);
      setTokenSaleAddress(TokenSaleAddress);

      // listener
      TutorialTokenInstance.events
        .Transfer({ to: accounts[0] })
        .on("data", async () => {
          await getBalanceByAddress(accounts[0], TutorialTokenInstance);
        });
    };
    init();
  }, []);

  useEffect(() => {
    const { TutorialTokenInstance } = instances;
    const update = async () => {
      await getBalanceByAddress(accounts[0], TutorialTokenInstance);
    };
    if (TutorialTokenInstance) {
      update();
    }
  }, [accounts, instances]);

  const getBalanceByAddress = async (address, TutorialTokenInstance) => {
    const accountBalance = await TutorialTokenInstance.methods
      .balanceOf(address)
      .call();
    setBalance(accountBalance);
  };

  const handleInputChange = async (e) => {
    setKycAddress(e.target.value);
  };

  const handleKycWhitelisting = async () => {
    const { kycInstance } = instances;
    try {
      await kycInstance.methods
        .setKycCompleted(kycAddress)
        .send({ from: accounts[0] });
      alert("KYC is success!");
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmitCheckKyc = async () => {
    const { kycInstance } = instances;
    try {
      // return console.log(kycAddress);
      const status = await kycInstance.methods.kycCompleted(kycAddress).call();
      alert(
        `${kycAddress}: \n KYC is ${status ? "complete!!" : "not complete!!"}`
      );
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmitBuyTokens = async () => {
    const { TokenSaleInstance } = instances;
    try {
      await TokenSaleInstance.methods
        .buyTokens(accounts[0])
        .send({ from: accounts[0], value: Web3.utils.toWei("10", "wei") });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="App">
      <div className="box" id="box1" style={{ left: "10px", top: "0px" }}></div>
      <div
        className="box"
        id="box2"
        style={{ left: "500px", top: "60px" }}
      ></div>
      <div
        className="box"
        id="box3"
        style={{ left: "150px", bottom: "175px" }}
      ></div>
      <div
        className="box"
        id="box4"
        style={{ right: "30px", bottom: "400px" }}
      ></div>
      <div
        className="box"
        id="box5"
        style={{ right: "200px", bottom: "80px" }}
      ></div>
      <div className="container">
        <h1>
          <u>Arcade Token Sale</u>
        </h1>
        <p>Get your tokens today!</p>
        <div className="content">
          <h2>Kyc Whitelisting</h2>
          <div className="input-container">
            <input
              type="text"
              required
              name="kycAddress"
              onChange={handleInputChange}
              autoComplete="off"
            />
            <label htmlFor="address">Address to allow:</label>
          </div>
          <button
            type="button"
            onClick={onSubmitCheckKyc}
            disabled={kycAddress === ""}
          >
            Check KYC
          </button>
          <button type="button" onClick={handleKycWhitelisting}>
            Add to whitelisting
          </button>
        </div>

        <div className="content">
          <h2>Buy Tokens</h2>
          <p>
            If you want to buy tokens, send Wei to this address:
            <b>{tokenSaleAddress}</b>
          </p>
          <h2>My Balance</h2>
          <p>
            Wallet Address: <b>{accounts[0]}</b>
          </p>
        </div>
        <div className="content">
          <h2>Buy Tokens (10)</h2>
          <button type="button" onClick={onSubmitBuyTokens}>
            Buy Tokens
          </button>
          <p>
            Your Balance: <b>{balance}</b> LuvCoins
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
