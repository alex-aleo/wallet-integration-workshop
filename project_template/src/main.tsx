/*
===================================================================================
IMPORTS

===================================================================================
*/
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { WalletModalProvider } from "@demox-labs/aleo-wallet-adapter-reactui";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { DecryptPermission, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { useMemo } from "react";
import { 
  PuzzleWalletAdapter, 
  LeoWalletAdapter, 
  FoxWalletAdapter,
  SoterWalletAdapter 
} from 'aleo-adapters';

const Root = () => {
  /*
  ===============================
  WALLET SETUP

  ===============================
  */
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: 'Wallet Workshop',
      }),
      new PuzzleWalletAdapter({
        programIdPermissions: {
          [WalletAdapterNetwork.TestnetBeta]: ['credits.aleo, workshop_token.aleo']
        },
        appName: 'Wallet Workshop',
        appDescription: 'A privacy-focused app for the Aleo Wallet Integration Workshop',
        appIconUrl: ''
      }),
      new FoxWalletAdapter({
        appName: 'Wallet Workshop',
      }),
      new SoterWalletAdapter({
        appName: 'Wallet Workshop',
      })
    ],
    []
  );

  // Wrap your app in WalletProvider and WalletModalProvider
  return (
    <React.StrictMode>
      <WalletProvider
        wallets={wallets}
        network={WalletAdapterNetwork.TestnetBeta}
        decryptPermission={DecryptPermission.OnChainHistory}
        programs={['credits.aleo', 'workshop_token.aleo']}
        autoConnect
      >
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Root/>
);