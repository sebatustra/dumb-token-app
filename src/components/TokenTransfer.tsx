import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createTransferInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as web3 from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export default function TokenTransfer({
    mintAddress
}: {
    mintAddress: string
}) {

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [tokensToTransfer, setTokensToTransfer] = useState(1);
    const [addressToTransfer, setAddressToTransfer] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const submit = () => {
        const execute = async () => {
            try {
                if (!publicKey) {
                    alert("Please connect your wallet")
                    return
                }

                if (!mintAddress) {
                    alert("Please create a mint first");
                    return
                }

                const sourceAddress = await getAssociatedTokenAddress(
                    new web3.PublicKey(mintAddress),
                    publicKey,
                    false,
                    TOKEN_PROGRAM_ID,
                    ASSOCIATED_TOKEN_PROGRAM_ID
                )

                const destinationAddress = await getAssociatedTokenAddress(
                    new web3.PublicKey(mintAddress),
                    new web3.PublicKey(addressToTransfer),
                    false,
                    TOKEN_PROGRAM_ID,
                    ASSOCIATED_TOKEN_PROGRAM_ID
                )

                const transferInstruction = new web3.Transaction().add(
                    createAssociatedTokenAccountInstruction(
                        publicKey,
                        destinationAddress,
                        new web3.PublicKey(addressToTransfer),
                        new web3.PublicKey(mintAddress),
                        TOKEN_PROGRAM_ID,
                        ASSOCIATED_TOKEN_PROGRAM_ID
                    ),
                    createTransferInstruction(
                        sourceAddress,
                        destinationAddress,
                        publicKey,
                        tokensToTransfer,
                    )
                )

                const tx = await sendTransaction(transferInstruction, connection);

                console.log("transaction is:", tx)
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
                    Transfer tokens
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-3 items-center justify-center">
                <p>Amount to transfer:</p>
                <Input
                    className="w-1/3" 
                    type="number"
                    value={tokensToTransfer}
                    onChange={(event) => setTokensToTransfer(Number(event.target.value))}
                ></Input>
                <Input
                    className="w-full"
                    placeholder="Address to transfer" 
                    onChange={(event) => setAddressToTransfer(event.target.value)}
                ></Input>
            </CardContent>
            <CardFooter>
                <Button className="w-full" variant="default"
                    onClick={() => submit()}
                    disabled={isLoading}
                >{isLoading ? "Cargando" : "Transfer"}</Button>
            </CardFooter>
        </Card>
    )
}
