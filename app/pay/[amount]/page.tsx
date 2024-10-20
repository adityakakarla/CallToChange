'use client'

import { ConnectButton, useWallet } from '@suiet/wallet-kit';
import { Transaction } from "@mysten/sui/transactions";
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { updateOffset } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function Page({params}: { params: {amount: string}}) {
    const wallet = useWallet()
    const router = useRouter()

    useEffect(() => {
        if (!wallet.connected) return;
        console.log('connected wallet name: ', wallet.name)
        console.log('account address: ', wallet.account?.address)
        console.log('account publicKey: ', wallet.account?.publicKey)
    }, [wallet.connected])

    const floatAmount = parseFloat(params.amount)
    const sui = Math.round(floatAmount * 1000000000 / 2.0682)

    async function performTransaction() {
      try {
        const tx = new Transaction()
        console.log(sui)
        const coin = tx.splitCoins(tx.gas, [sui])
        tx.transferObjects([coin], '0x29fe24f7ca8a9169b41b53669dfe2370ca6e92e74c03493c77e129560915d1e1')
        await wallet.signAndExecuteTransaction({
            transaction: tx,
        });
        await updateOffset(parseFloat(params.amount));
        router.push('/dashboard')
      } catch (error) {
        console.error(error);
      }
        
    }

    return (
        <div className="relative w-full h-screen">
          <div className="absolute inset-0 -z-10">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              poster="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65c8ed3e7d491e37259a30c5_Langchain-hero-1_1706794335%201-placeholder.jpg"
            >
              <source
                src="https://customer-xp1a3vy0ydc4ega7.cloudflarestream.com/bb6cf069546e3d829aa5808ac8b07748/downloads/default.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="relative flex flex-col items-center justify-center h-full text-white z-0">
            <ConnectButton />
            {wallet.connected &&
            <Button className="mt-20 bg-transparent border border-white text-white transition duration-300 ease-in-out hover:bg-black hover:bg-opacity-20 rounded-full py-8 px-12 text-lg"
            onClick={performTransaction}>
          Pay ${params.amount} = {(Math.round(parseFloat(params.amount) * 10000 / 2.0682) / 10000).toFixed(4)} SUI
          </Button>}
          </div>
        </div>
      );
      
};