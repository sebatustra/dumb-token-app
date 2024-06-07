"use client";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
require("@solana/wallet-adapter-react-ui/styles.css");
 
export default function AppWalletProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {

    const endpoint = process.env.NEXT_PUBLIC_RPC_URL!
    const wallets =  [
        new SolflareWalletAdapter()
    ];
   
    return (
      <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider> 
        </ConnectionProvider>
    );
  }