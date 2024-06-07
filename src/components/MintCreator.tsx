import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { 
    MINT_SIZE, 
    getMinimumBalanceForRentExemptMint, 
    TOKEN_PROGRAM_ID, 
    createInitializeMintInstruction,
    createMintToInstruction,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
    ASSOCIATED_TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import * as web3 from "@solana/web3.js"
import { useState } from "react";
import { Input } from "./ui/input";
import { getExplorerLink } from "@solana-developers/helpers";

export default function MintCreator({
    mintAddress,
    setMintAddress
}: {
    mintAddress: string,
    setMintAddress: Function
}) {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [isLoading, setIsLoading] = useState(false);
    const [tokensToMint, setTokensToMint] = useState(1)

    const submit = () => {
        const execute = async () => {
            try {
                setIsLoading(true)
                if (!publicKey) {
                    setIsLoading(false)
                    alert("wallet not connect")
                    return
                }

                const accountKeypair = web3.Keypair.generate()
                const lamports = await getMinimumBalanceForRentExemptMint(connection);

                const associatedAddress = await getAssociatedTokenAddress(
                    accountKeypair.publicKey,
                    publicKey,
                    false,
                    TOKEN_PROGRAM_ID,
                    ASSOCIATED_TOKEN_PROGRAM_ID
                );

                const transaction = new web3.Transaction().add(
                    web3.SystemProgram.createAccount({
                        fromPubkey: publicKey!,
                        newAccountPubkey: accountKeypair.publicKey,
                        space: MINT_SIZE,
                        lamports,
                        programId: TOKEN_PROGRAM_ID
                    }),
                    createInitializeMintInstruction(
                        accountKeypair.publicKey,
                        0,
                        publicKey,
                        null,
                        TOKEN_PROGRAM_ID
                    ),
                    createAssociatedTokenAccountInstruction(
                        publicKey,
                        associatedAddress,
                        publicKey,
                        accountKeypair.publicKey,
                        TOKEN_PROGRAM_ID,
                        ASSOCIATED_TOKEN_PROGRAM_ID
                    ),
                    createMintToInstruction(
                        accountKeypair.publicKey,
                        associatedAddress,
                        publicKey,
                        tokensToMint,
                    )
                    
                );

                await sendTransaction(transaction, connection, {
                    signers: [accountKeypair]
                })

                setMintAddress(accountKeypair.publicKey.toBase58())

                setIsLoading(false)

            } catch(e) {
                setIsLoading(false)
                console.error(e);
            }
        }

        execute()
    }

    return (
        <Card className="w-[500px]">
            <CardHeader>
                <CardTitle className="text-center">
                    Create Mint
                </CardTitle>
            </CardHeader>
            <CardContent className=" flex flex-col text-center justify-center items-center gap-y-3">

                <p>Token mint address: <strong>{mintAddress.length > 0 ? mintAddress : "You have not created a mint yet"}</strong></p>

                <p>Initial Supply:</p>
                <Input 
                    className="w-1/3" 
                    type="number" 
                    placeholder="Initial amount"
                    onChange={(event) => setTokensToMint(Number(event.target.value))}
                    value={tokensToMint}
                ></Input>

            </CardContent>
            <CardFooter>
                <Button 
                    className="w-full" 
                    variant="default"
                    onClick={() => submit()}
                    disabled={isLoading}
                    >
                        {isLoading ? "loading..." : "Create Token Mint"}
                    </Button>
            </CardFooter>
        </Card>
    )
}
