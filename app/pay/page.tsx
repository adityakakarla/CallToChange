'use client';

interface EthereumWindow {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (accounts: string[]) => void) => void;
    isMetaMask?: boolean;
  };
}

declare global {
  interface Window extends EthereumWindow {}
}

import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { AlertCircle, Wallet, SendHorizontal } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

export default function CryptoPayment() {
  const [walletAddress, setWalletAddress] = useState('');
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [balance, setBalance] = useState<string>('0');

  const RECIPIENT_ADDRESS = '0x4f09eF3C464e621a7172dbDC9fe4d82E50953913';
  const XRPL_CHAIN_ID = BigInt(1440002);
  const MIN_XRP_RESERVE = 10; // Minimum XRP reserve requirement
  const ESTIMATED_GAS_IN_XRP = 0.1; // Estimated gas fee in XRP

  // XRPL EVM Sidechain network configuration
  const XRPL_NETWORK_CONFIG = {
    chainId: '1440002',
    chainName: 'XRPL EVM Sidechain',
    nativeCurrency: {
      name: 'XRP',
      symbol: 'XRP',
      decimals: 18
    },
    rpcUrls: ['https://rpc-evm-sidechain.xrpl.org'],
    blockExplorerUrls: ['https://explorer.xrplevm.org/']
  };

  // Fetch balance whenever wallet address changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (web3 && walletAddress) {
        try {
          const balanceWei = await web3.eth.getBalance(walletAddress);
          const balanceXRP = web3.utils.fromWei(balanceWei, 'ether');
          setBalance(balanceXRP);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    };

    fetchBalance();
  }, [web3, walletAddress]);

  const addXrplNetwork = async () => {
    try {
      await window.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [XRPL_NETWORK_CONFIG]
      });
      return true;
    } catch (error) {
      console.error('Failed to add network:', error);
      return false;
    }
  };

  const switchToXrplNetwork = async () => {
    try {
      await window.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: XRPL_NETWORK_CONFIG.chainId }]
      });
      return true;
    } catch (error: Error | any) {
      if (error.code === 4902) {
        return await addXrplNetwork();
      }
      throw error;
    }
  };

  const validateTransaction = (amountXRP: number): string | null => {
    const balanceNum = parseFloat(balance);
    const totalRequired = amountXRP + MIN_XRP_RESERVE + ESTIMATED_GAS_IN_XRP;

    if (balanceNum < totalRequired) {
      return `Insufficient balance. You need at least ${totalRequired.toFixed(2)} XRP (${amountXRP} XRP + ${MIN_XRP_RESERVE} XRP reserve + ~${ESTIMATED_GAS_IN_XRP} XRP for gas). Available: ${balanceNum.toFixed(2)} XRP`;
    }

    return null;
  };

  const connectWallet = async () => {
    setError('');
    setLoading(true);

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (Array.isArray(accounts)) {
        setWalletAddress(accounts[0]);
        setWeb3(new Web3(window.ethereum));

        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          setWalletAddress(accounts[0] || '');
        });

        const newWeb3 = new Web3(window.ethereum);
        const chainId: bigint = await newWeb3.eth.getChainId();
        
        if (chainId !== XRPL_CHAIN_ID) {
          const switched = await switchToXrplNetwork();
          if (!switched) {
            throw new Error('Failed to switch to XRPL EVM Sidechain');
          }
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const sendPayment = async () => {
    if (!web3 || !amount || isNaN(Number(amount))) {
      setError('Please enter a valid amount');
      return;
    }

    const amountNum = parseFloat(amount);
    const validationError = validateTransaction(amountNum);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);
    setPaymentStatus('');

    try {
      // Get current gas price
      const gasPrice = await web3.eth.getGasPrice();
      const gasLimit = '21000'; // Standard gas limit for transfers
      const valueInWei = web3.utils.toWei(amount, 'ether');

      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const tx = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: walletAddress,
          to: RECIPIENT_ADDRESS,
          value: web3.utils.toHex(valueInWei),
          gas: web3.utils.toHex(gasLimit),
          gasPrice: web3.utils.toHex(gasPrice),
        }],
      });

      setPaymentStatus(`Payment successful! TX Hash: ${tx}`);
      setAmount('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const truncateAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-6 h-6" />
          Pay with wXRP
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!walletAddress ? (
          <Button
            onClick={connectWallet}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Connecting...' : 'Connect MetaMask'}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">Connected wallet:</p>
              <p className="font-mono">{truncateAddress(walletAddress)}</p>
              <p className="text-sm text-gray-600 mt-1">Balance: {parseFloat(balance).toFixed(2)} XRP</p>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-500">
                Note: Transactions require:
                <ul className="list-disc list-inside ml-2">
                  <li>Payment amount</li>
                  <li>{MIN_XRP_RESERVE} XRP minimum reserve</li>
                  <li>~{ESTIMATED_GAS_IN_XRP} XRP for gas fees</li>
                </ul>
              </div>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount in XRP"
                step="0.0001"
                min="0"
              />
              <Button
                onClick={sendPayment}
                disabled={loading || !amount}
                className="w-full"
              >
                <SendHorizontal className="w-4 h-4 mr-2" />
                {loading ? 'Processing...' : 'Pay Now'}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {paymentStatus && (
              <Alert>
                <AlertDescription>{paymentStatus}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}