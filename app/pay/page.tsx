'use client'

import {ConnectButton, useWallet} from '@suiet/wallet-kit';
import {Transaction} from "@mysten/sui/transactions";
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Page () {
  const wallet = useWallet()

  useEffect(() => {
    if (!wallet.connected) return;
    console.log('connected wallet name: ', wallet.name)
    console.log('account address: ', wallet.account?.address)
    console.log('account publicKey: ', wallet.account?.publicKey)
  }, [wallet.connected])

  async function performTransaction() {
    const tx = new Transaction()
    console.log(tx)
    const coin = tx.splitCoins(tx.gas, [100000000])
    tx.transferObjects([coin], '0x29fe24f7ca8a9169b41b53669dfe2370ca6e92e74c03493c77e129560915d1e1')
    const resData = await wallet.signAndExecuteTransaction({
      transaction: tx,
    });
    console.log(resData)
  }

  return (<div className='flex flex-col items-center justify-center h-screen text-white'>
    <p>Wallet name: {wallet.name}</p>
    <ConnectButton/>
    <Button onClick={() => performTransaction()}>Launch Move Call</Button>
  </div>)
};