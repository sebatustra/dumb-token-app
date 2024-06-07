"use client"
import MintCreator from "@/components/MintCreator";
import TokenTransfer from "@/components/TokenTransfer";
import dynamic from 'next/dynamic';
import { useState } from "react";

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

export default function Home() {

    const [mintAddress, setMintAddress] = useState("")

    return (
        <main className="flex flex-col items-center justify-center min-h-screen gap-y-10">
            <div className="fixed top-0 right-0 p-4">
                <WalletMultiButtonDynamic />
            </div>
            <p className="text-3xl"><strong>Dumb token app</strong></p>

            <MintCreator 
                mintAddress={mintAddress}
                setMintAddress={setMintAddress}
            />

            <TokenTransfer 
                mintAddress={mintAddress}
            />
        </main>
    );
}
