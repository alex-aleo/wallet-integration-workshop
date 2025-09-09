/*
===================================================================================
IMPORTS

===================================================================================
*/
import React, { useState } from "react";
import "./App.css";
import leoToken from "./assets/leo-token-final.png";

import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import "@demox-labs/aleo-wallet-adapter-reactui/dist/styles.css";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { AleoTransaction} from "@demox-labs/aleo-wallet-adapter-base";


function App() {
  /*
  =================================================================
  STATE AND WALLET HOOKS
  =================================================================
  */
  const [selectedTab, setSelectedTab] = useState("mint");
  const [lastTxId, setLastTxId] = useState<string | null>(null);

  const [mintPublicAmount, setMintPublicAmount] = useState("");
  const [mintPublicLoading, setMintPublicLoading] = useState(false);
  
  const [mintPrivateAmount, setMintPrivateAmount] = useState("");
  const [mintPrivateRecordJson, setMintPrivateRecordJson] = useState("");
  const [mintPrivateLoading, setMintPrivateLoading] = useState(false);

  const [transferPublicAmount, setTransferPublicAmount] = useState("");
  const [transferPublicRecipient, setTransferPublicRecipient] = useState("");
  const [transferPublicLoading, setTransferPublicLoading] = useState(false);
  
  const [transferPrivateAmount, setTransferPrivateAmount] = useState("");
  const [transferPrivateRecipient, setTransferPrivateRecipient] = useState("");
  const [transferPrivateRecordJson, setTransferPrivateRecordJson] = useState("");
  const [transferPrivateLoading, setTransferPrivateLoading] = useState(false);

  const { wallet, publicKey, requestTransaction } = useWallet();

  /*
  =================================================================
  HELPER FUNCTIONS:

    tryParseJSON():
      - Used for parsing JSON inputs more easily 
      - Useful for Aleo Record type

  =================================================================
  */
  function tryParseJSON<T = unknown>(input: string): T | string {
    try {
      return JSON.parse(input) as T;
    } catch {
      return input;
    }
  }


  /*
  =================================================================
  EVENT HANDLERS:
  =================================================================
  */


  /*
  =================================================================
  TASK 1: handleMintPublic()
  
  TODOs: N/A

  NOTES:
    - This function is already filled in for you.
    - Review and understand the following code to see how inputs are
      parsed and how transactions are formed and broadcast via the wallet adapter

  PITFALLS:
      - The order of the inputs in a transaction matters! Check the order 
      of the inputs in the corresponding Aleo program to ensure correct
      processing!

  =================================================================
  */
  async function handleMintPublic(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    //Check if the wallet is connected and functioning properly
    if (!requestTransaction || !publicKey || !wallet?.adapter) {
      alert("No wallet connected");
      return;
    }

    //Parse the `Amount` Field
    const amountParsed = Number(mintPublicAmount);
    if (!Number.isFinite(amountParsed) || amountParsed <= 0) {
      alert("Enter a valid token amount (u8)");
      return;
    }

    //Set state to loading to prevent spamming transactions
    setMintPublicLoading(true);

    //Try to form and broadcast the transaction
    try {
      const aleoTransaction : AleoTransaction = {
        address: publicKey, // The address/public-key to initiate the transaction with
        chainId: "testnetbeta", // The network to broadcast to.  We'll stick with Testnet to avoid paying real money.
        transitions: [
          {
            program: "workshop_token.aleo", // The program to call
            functionName: "mint_public", // The function to execute
            inputs: [`${amountParsed}u8`], // The inputs to the above function. THE ORDER OF THE INPUTS MATTERS!
          },
        ],
        fee: 2000000, // This is the fee you'll pay (in microcredits). 1,000,000 microcredits == 1 credit
        feePrivate: false, // We'll use a public fee for this workshop for speed purposes
      };

      //Broadcast the transaction and await the corresponding transaction ID
      const txID = await requestTransaction(aleoTransaction);

      //Save the transaction ID above into a state variable
      setLastTxId(String(txID));

    } catch (err) {
      console.error(err);
      alert("Public mint failed. See console for details.");

    } finally {
      //Set state back to ready
      setMintPublicLoading(false);
    }
  }

  /*
  =================================================================
  TASK 2: handleMintPrivate()

  Review the handleMintPublic() function implementation above if 
  you get stuck.
  
  TODOs:
    1. Check that the wallet is connected and functioning 
    2. Parse the input fields `Amount` and `Token Record`
        - `Token Record` parsing is already implemented for you
    3. Set the mintPrivateLoading() state hook as active (true)
    4. Try to form and broadcast the transaction, catching any errors
    5. Finally, set the mintPrivateLoading() state hook as inactive (false)

  =================================================================
  */
  async function handleMintPrivate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Parse the `Token Record` field
    if (!mintPrivateRecordJson.trim()) {
      alert("Paste a token record JSON");
      return;
    }
    const recordInput = tryParseJSON(mintPrivateRecordJson);

  }


  /*
  =================================================================
  TASK 3: handleTransferPublic()

  Review the handleMintPublic() function implementation above if 
  you get stuck.
  
  TODOs:
    1. Check that the wallet is connected and functioning 
    2. Parse the input fields `Recipient` and `Amount`
        - `Recipient` parsing is already implemented for you
    3. Set the transferPublicLoading() state hook as active (true)
    4. Try to form and broadcast the transaction, catching any errors
    5. Finally, set the transferPublicLoading() state hook as inactive (false)

  =================================================================
  */
  async function handleTransferPublic(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Aleo addresses must be 63 alphanumeric characters beginning with "aleo1"
    const recipientParsed = transferPublicRecipient;
    if (recipientParsed.length != 63 ||  !(recipientParsed.substring(0,5) === "aleo1") || /^[a-zA-Z0-9]+$/.test(recipientParsed)) {
      alert("Enter a valid address");
      return;
    }

  }


  /*
  =================================================================
  TASK 4: handleTransferPrivate()

  Review the handleMintPublic() function implementation above if 
  you get stuck.
  
  TODOs:
    1. Check that the wallet is connected and functioning 
    2. Parse the input fields `Recipient`, `Amount`, and `Token Record`
    3. Set the transferPrivateLoading() state hook as active (true)
    4. Try to form and broadcast the transaction, catching any errors
    5. Finally, set the transferPrivateLoading() state hook as inactive (false)

  =================================================================
  */
  async function handleTransferPrivate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }


  /*
  =================================================================
  APP HTML
  =================================================================
  */
  return (
    <div className="app-container-wrapper">
      <main className="app-container">
        <header className="header">
          <div className="brand">
            <h1 className="brand-title">Aleo | Workshop</h1>
          </div>
          <div className="wallet-btn-wrapper">
ff
            <WalletMultiButton className="wallet-btn"/>
          </div>
        </header>

        <div className="interact-box-container">
          <section className="interact-box">
            <img src={leoToken} className="leo-token-img" />
            <div className="leo-token-description-container">
              <h1 className="leo-token-title">LEO TOKEN</h1>
              <span>The Leo Token is more than just a digital asset; it's a pixelated tribute to the core of 
              privacy-first blockchain development. Embodying the spirit of the Leo programming language, 
              this token is a digital representation of the unyielding pursuit of privacy and security on the 
              Aleo blockchain. Its simple, retro-inspired design reflects the straightforward yet powerful nature 
              of the technology it represents. Each token is a testament to the seamless integration of art, privacy, 
              and the raw, untamed potential of zero-knowledge proofs, making it a must-have for those who dare 
              to build a more private digital future.
              </span>
            </div>
          </section>

          <section className="interact-box2">
            <div className="interact-box-tabs">
              <button className={selectedTab == "mint" ? "mint-tab selected":"mint-tab"}
              onClick={() => setSelectedTab("mint")}
              >
                <h3> $ Mint </h3>
              </button>
              <button className={selectedTab == "transfer" ? "transfer-tab selected":"transfer-tab"}
              onClick={() => setSelectedTab("transfer")}
              >
                <h3> {"->"} Transfer </h3>
              </button>
            </div>

            <div className={selectedTab == "mint" ? "action-card-container" :"action-card-container disabled"}>
              <div className="action-card">
                <h2 className="action-title">Mint Public</h2>
                <form onSubmit={handleMintPublic} className="form">
                  <div className="field">
                    <label htmlFor="public-amount" className="label">
                      Amount
                    </label>
                    <input
                      id="public-amount"
                      className="input"
                      type="number"
                      min="0"
                      inputMode="numeric"
                      placeholder="u8"
                      value={mintPublicAmount}
                      onChange={(e) => setMintPublicAmount(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="primary-btn" disabled={mintPublicLoading}>
                    {mintPublicLoading ? "Submitting..." : "Mint"}
                  </button>
                  {lastTxId ? (
                    <p className="muted" style={{ margin: 0 }}>
                      Submitted. Track in wallet. Tx: {lastTxId}
                    </p>
                  ) : null}
                </form>
              </div>

              <div className="action-card-buffer"></div>

              <div className="action-card">
                <h1 className="action-title">Mint Private</h1>
                <form onSubmit={handleMintPrivate} className="form">
                  <div className="field">
                    <label htmlFor="private-amount" className="label">Amount:</label>
                    <input
                      id="private-amount"
                      className="input"
                      type="number"
                      min="0"
                      inputMode="numeric"
                      placeholder="u8"
                      value={mintPrivateAmount}
                      onChange={(e) => setMintPrivateAmount(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="private-record" className="label">Token Record:</label>
                    <textarea
                      id="private-record"
                      className="textarea"
                      rows={4}
                      placeholder='JSON'
                      value={mintPrivateRecordJson}
                      onChange={(e) => setMintPrivateRecordJson(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="primary-btn" disabled={mintPrivateLoading}>
                    {mintPrivateLoading ? "Submitting..." : "Mint"}
                  </button>
                </form>
              </div>
              
            </div>

            <div className={selectedTab == "transfer" ? "action-card-container" :"action-card-container disabled"}>
              <div className="action-card">
                <h2 className="action-title">Transfer Public</h2>
                <form onSubmit={handleTransferPublic} className="form">
                  <div className="field">
                    <label htmlFor="public-amount" className="label">
                      Recipient
                    </label>
                    <input
                      id="recipient"
                      className="input"
                      type="address"
                      inputMode="text"
                      placeholder="aleo1..."
                      value={transferPublicRecipient}
                      onChange={(e) => setTransferPublicRecipient(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="public-amount" className="label">
                      Amount
                    </label>
                    <input
                      id="public-amount"
                      className="input"
                      type="number"
                      min="0"
                      inputMode="numeric"
                      placeholder="u8"
                      value={transferPublicAmount}
                      onChange={(e) => setTransferPublicAmount(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="primary-btn" disabled={transferPublicLoading}>
                    {transferPublicLoading ? "Submitting..." : "Transfer"}
                  </button>
                  {lastTxId ? (
                    <p className="muted" style={{ margin: 0 }}>
                      Submitted. Track in wallet. Tx: {lastTxId}
                    </p>
                  ) : null}
                </form>
              </div>

              <div className="action-card-buffer"></div>

              <div className="action-card">
                <h1 className="action-title">Transfer Private</h1>
                <form onSubmit={handleTransferPrivate} className="form">
                  <div className="field">
                    <label htmlFor="public-amount" className="label">
                      Recipient
                    </label>
                    <input
                      id="recipient"
                      className="input"
                      type="address"
                      inputMode="text"
                      placeholder="aleo1..."
                      value={transferPrivateRecipient}
                      onChange={(e) => setTransferPrivateRecipient(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="private-amount" className="label">Amount:</label>
                    <input
                      id="private-amount"
                      className="input"
                      type="number"
                      min="0"
                      inputMode="numeric"
                      placeholder="u8"
                      value={transferPrivateAmount}
                      onChange={(e) => setTransferPrivateAmount(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="private-record" className="label">Token Record:</label>
                    <textarea
                      id="private-record"
                      className="textarea"
                      rows={4}
                      placeholder='JSON'
                      value={transferPrivateRecordJson}
                      onChange={(e) => setTransferPrivateRecordJson(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="primary-btn" disabled={transferPrivateLoading}>
                    {transferPrivateLoading ? "Submitting..." : "Transfer"}
                  </button>
                </form>
              </div>
              
            </div>


          </section>
        </div>
      </main>
      <footer className="footer muted">
          Designed by the Aleo Network Foundation
      </footer>
    </div>
  );
}

export default App;


