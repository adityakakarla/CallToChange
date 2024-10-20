'use client'

import { WalletProvider } from "@suiet/wallet-kit"

export default function PayLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <WalletProvider>
        <div>
            {children}
        </div>
        </WalletProvider>
    )
  }