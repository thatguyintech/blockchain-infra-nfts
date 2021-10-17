import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import myEpicNft from './utils/MyEpicNFT.json';

const TWITTER_HANDLE = 'thatguyintech';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/blockchain-infra-nfts';
const TOTAL_MINT_COUNT = 100;

// I moved the contract address to the top for easy access.
const CONTRACT_ADDRESS = "0x384EC369b0681cC0b09e2a2Fbb1442015A9658D9";

const App = () => {

    const [currentAccount, setCurrentAccount] = useState("");
    const [mining, setMining] = useState(false);
    const [mintCount, setMintCount] = useState(0);
    
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;

      if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
      } else {
          console.log("We have the ethereum object", ethereum);
      }

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);

      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4"; 
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
					setCurrentAccount(account)
          
          // Setup listener! This is for the case where a user comes to our site
          // and ALREADY had their wallet connected + authorized.
          setupEventListener()
      } else {
          console.log("No authorized account found")
      }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener() 
    } catch (error) {
      console.log(error)
    }
  }

  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
          
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();
        setMining(true);

        console.log("Mining...please wait.")
        await nftTxn.wait();
        console.log(nftTxn);
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        setMining(false);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }


  const fetchMintCount = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        let _nftCount = await connectedContract.getTotalNFTsMintedSoFar();
        setMintCount(_nftCount.toNumber());

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    fetchMintCount();
  }, [])

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Mint NFT
    </button>
  )

  const loadingIcon = () => {
    return (
    <svg version="1.1" width="320" height="320" viewBox="0 0 320 320" fill="#000" stroke="#ffffff" stroke-linecap="round"
     xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
  <defs>
    <path id="r1">
      <animate id="p1" attributeName="d" values="m160,160l0,0 0,0;m130,110l30,-17 30,17;m130,60l30,-17 30,17;m160,20l0,0 0,0" dur="6s" repeatCount="indefinite"/>
      <animate attributeName="stroke-width" values="0;4;4;4;0" dur="6s" repeatCount="indefinite" begin="p1.begin"/>
    </path>
    <path id="r2">
      <animate attributeName="d" values="m160,160l0,0 0,0;m130,110l30,-17 30,17;m130,60l30,-17 30,17;m160,20l0,0 0,0" dur="6s" repeatCount="indefinite" begin="p1.begin+1s"/>
      <animate attributeName="stroke-width" values="0;4;4;4;0" dur="6s" repeatCount="indefinite" begin="p1.begin+1s"/>
    </path>
    <path id="r3">
      <animate attributeName="d" values="m160,160l0,0 0,0;m130,110l30,-17 30,17;m130,60l30,-17 30,17;m160,20l0,0 0,0" dur="6s" repeatCount="indefinite" begin="p1.begin+2s"/>
      <animate attributeName="stroke-width" values="0;4;4;4;0" dur="6s" repeatCount="indefinite" begin="p1.begin+2s"/>
    </path>
    <path id="r4">
      <animate id="p1" attributeName="d" values="m160,160l0,0 0,0;m130,110l30,-17 30,17;m130,60l30,-17 30,17;m160,20l0,0 0,0" dur="6s" repeatCount="indefinite" begin="p1.begin+3s"/>
      <animate attributeName="stroke-width" values="0;4;4;4;0" dur="6s" repeatCount="indefinite" begin="p1.begin+3s"/>
    </path>
    <path id="r5">
      <animate attributeName="d" values="m160,160l0,0 0,0;m130,110l30,-17 30,17;m130,60l30,-17 30,17;m160,20l0,0 0,0" dur="6s" repeatCount="indefinite" begin="p1.begin+4s"/>
      <animate attributeName="stroke-width" values="0;4;4;4;0" dur="6s" repeatCount="indefinite" begin="p1.begin+4s"/>
    </path>
    <path id="r6">
      <animate attributeName="d" values="m160,160l0,0 0,0;m130,110l30,-17 30,17;m130,60l30,-17 30,17;m160,20l0,0 0,0" dur="6s" repeatCount="indefinite" begin="p1.begin+5s"/>
      <animate attributeName="stroke-width" values="0;4;4;4;0" dur="6s" repeatCount="indefinite" begin="p1.begin+5s"/>
    </path>
  </defs>
  <use xlinkHref="#r1"/>
  <use xlinkHref="#r1" transform="rotate(60 160 160)"/>
  <use xlinkHref="#r1" transform="rotate(120 160 160)"/>
  <use xlinkHref="#r1" transform="rotate(180 160 160)"/>
  <use xlinkHref="#r1" transform="rotate(240 160 160)"/>
  <use xlinkHref="#r1" transform="rotate(300 160 160)"/>
  <use xlinkHref="#r2" transform="rotate(30 160 160)"/>
  <use xlinkHref="#r2" transform="rotate(90 160 160)"/>
  <use xlinkHref="#r2" transform="rotate(150 160 160)"/>
  <use xlinkHref="#r2" transform="rotate(210 160 160)"/>
  <use xlinkHref="#r2" transform="rotate(270 160 160)"/>
  <use xlinkHref="#r2" transform="rotate(330 160 160)"/>
  <use xlinkHref="#r3"/>
  <use xlinkHref="#r3" transform="rotate(60 160 160)"/>
  <use xlinkHref="#r3" transform="rotate(120 160 160)"/>
  <use xlinkHref="#r3" transform="rotate(180 160 160)"/>
  <use xlinkHref="#r3" transform="rotate(240 160 160)"/>
  <use xlinkHref="#r3" transform="rotate(300 160 160)"/>
  <use xlinkHref="#r4" transform="rotate(30 160 160)"/>
  <use xlinkHref="#r4" transform="rotate(90 160 160)"/>
  <use xlinkHref="#r4" transform="rotate(150 160 160)"/>
  <use xlinkHref="#r4" transform="rotate(210 160 160)"/>
  <use xlinkHref="#r4" transform="rotate(270 160 160)"/>
  <use xlinkHref="#r4" transform="rotate(330 160 160)"/>
  <use xlinkHref="#r5"/>
  <use xlinkHref="#r5" transform="rotate(60 160 160)"/>
  <use xlinkHref="#r5" transform="rotate(120 160 160)"/>
  <use xlinkHref="#r5" transform="rotate(180 160 160)"/>
  <use xlinkHref="#r5" transform="rotate(240 160 160)"/>
  <use xlinkHref="#r5" transform="rotate(300 160 160)"/>
  <use xlinkHref="#r6" transform="rotate(30 160 160)"/>
  <use xlinkHref="#r6" transform="rotate(90 160 160)"/>
  <use xlinkHref="#r6" transform="rotate(150 160 160)"/>
  <use xlinkHref="#r6" transform="rotate(210 160 160)"/>
  <use xlinkHref="#r6" transform="rotate(270 160 160)"/>
  <use xlinkHref="#r6" transform="rotate(330 160 160)"/>
</svg>);
  }

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Blockchain Infra NFTs</p>
          <p className="sub-text">
            Do you have what it takes...
            to prevent a dApp outage?
          </p>
          <p className="sub-text">
            {mintCount} / {TOTAL_MINT_COUNT} minted
          </p>
          <br/>
          {mining && loadingIcon()}
          <br/>
          {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
        </div>
        <div className="footer-container">
          <a
            className="footer-text"
            href={OPENSEA_LINK}
            target="_blank"
            rel="noreferrer"
          >{`🌊 View Collection on OpenSea`}</a>
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;