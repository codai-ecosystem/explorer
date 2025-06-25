'use client';

import React, { useState, useEffect } from 'react';
import {
  CubeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  FireIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

interface Block {
  number: number;
  hash: string;
  timestamp: Date;
  transactions: number;
  miner: string;
  gasUsed: number;
  gasLimit: number;
  size: number;
  difficulty: string;
  totalDifficulty: string;
  reward: number;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: number;
  gasPrice: number;
  gasUsed: number;
  gasLimit: number;
  status: 'success' | 'failed' | 'pending';
  timestamp: Date;
  blockNumber: number;
  confirmations: number;
  type: string;
}

interface NetworkStats {
  blockHeight: number;
  hashRate: string;
  difficulty: string;
  networkFees: number;
  activeAddresses: number;
  totalSupply: number;
  circulatingSupply: number;
  marketCap: number;
  price: number;
  priceChange24h: number;
}

const mockBlocks: Block[] = [
  {
    number: 18750234,
    hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
    timestamp: new Date(Date.now() - 30000),
    transactions: 245,
    miner: '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5',
    gasUsed: 29845673,
    gasLimit: 30000000,
    size: 125436,
    difficulty: '58750234567890123456',
    totalDifficulty: '587502345678901234567890',
    reward: 2.05,
  },
  {
    number: 18750233,
    hash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    timestamp: new Date(Date.now() - 150000),
    transactions: 189,
    miner: '0x829BD824B016326A401d083B33D092293333A830',
    gasUsed: 28934521,
    gasLimit: 30000000,
    size: 98765,
    difficulty: '58750234567890123456',
    totalDifficulty: '587502345678901234567890',
    reward: 2.08,
  },
  {
    number: 18750232,
    hash: '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
    timestamp: new Date(Date.now() - 270000),
    transactions: 312,
    miner: '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c',
    gasUsed: 29567890,
    gasLimit: 30000000,
    size: 156789,
    difficulty: '58750234567890123456',
    totalDifficulty: '587502345678901234567890',
    reward: 2.12,
  },
];

const mockTransactions: Transaction[] = [
  {
    hash: '0xa1b2c3d4e5f6789012345678901234567890123456789012345678901234567890',
    from: '0x742d35Cc6635C0532925a3b8D8c025C476b7E4D9',
    to: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
    value: 1.5,
    gasPrice: 25000000000,
    gasUsed: 21000,
    gasLimit: 21000,
    status: 'success',
    timestamp: new Date(Date.now() - 45000),
    blockNumber: 18750234,
    confirmations: 1,
    type: 'Transfer',
  },
  {
    hash: '0xb2c3d4e5f6789012345678901234567890123456789012345678901234567890a1',
    from: '0x8ba1f109551bD432803012645Hac136c0c8f2A59',
    to: '0x1aE0EA34a72D944a8C7603Ee4D60081242dE8Dd7',
    value: 0.025,
    gasPrice: 30000000000,
    gasUsed: 85430,
    gasLimit: 100000,
    status: 'success',
    timestamp: new Date(Date.now() - 120000),
    blockNumber: 18750233,
    confirmations: 2,
    type: 'Contract Call',
  },
  {
    hash: '0xc3d4e5f6789012345678901234567890123456789012345678901234567890a1b2',
    from: '0x6f46cf5569aefa1acc1009290c8a5cf5c5d5f8a2',
    to: '0x90e63c3e54b3543a9b1c6b7f6c5a0b2f8e1d3c4b',
    value: 5.75,
    gasPrice: 35000000000,
    gasUsed: 45230,
    gasLimit: 50000,
    status: 'failed',
    timestamp: new Date(Date.now() - 180000),
    blockNumber: 18750232,
    confirmations: 3,
    type: 'DEX Swap',
  },
];

const networkStats: NetworkStats = {
  blockHeight: 18750234,
  hashRate: '485.2 TH/s',
  difficulty: '58.75 T',
  networkFees: 12.45,
  activeAddresses: 125634,
  totalSupply: 120450678,
  circulatingSupply: 120450234,
  marketCap: 245890345678,
  price: 2041.32,
  priceChange24h: 2.84,
};

export default function BlockchainExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('blocks');
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const formatHash = (hash: string, length: number = 12) => {
    return `${hash.slice(0, length)}...${hash.slice(-8)}`;
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <CubeIcon className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Codai Explorer
                  </h1>
                  <p className="text-sm text-gray-600">
                    AI-Powered Blockchain Analytics
                  </p>
                </div>
              </div>
            </div>

            {/* Network Status */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">
                  Block #{networkStats.blockHeight.toLocaleString()}
                </span>
              </div>
              <div className="text-gray-600">
                Gas:{' '}
                <span className="font-medium">
                  {networkStats.networkFees} Gwei
                </span>
              </div>
              <div className="text-gray-600">
                Price:{' '}
                <span className="font-medium text-green-600">
                  ${networkStats.price.toLocaleString()}
                </span>
                <span className="text-green-600 ml-1">
                  (+{networkStats.priceChange24h}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Address / Txn Hash / Block Number"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Network Statistics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <FireIcon className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hash Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {networkStats.hashRate}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <BoltIcon className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Difficulty</p>
                <p className="text-2xl font-bold text-gray-900">
                  {networkStats.difficulty}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <ChartBarIcon className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Market Cap</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${formatNumber(networkStats.marketCap)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CurrencyDollarIcon className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Addresses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {networkStats.activeAddresses.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'blocks', name: 'Latest Blocks', icon: CubeIcon },
                {
                  id: 'transactions',
                  name: 'Latest Transactions',
                  icon: ArrowRightIcon,
                },
                { id: 'analytics', name: 'AI Analytics', icon: ChartBarIcon },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'blocks' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Latest Blocks
                </h3>
                <div className="space-y-3">
                  {mockBlocks.map(block => (
                    <div
                      key={block.number}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => setSelectedBlock(block)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <CubeIcon className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">
                              #{block.number.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatTimeAgo(block.timestamp)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Hash: {formatHash(block.hash)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {block.transactions} txns
                        </div>
                        <div className="text-sm text-gray-600">
                          Reward: {block.reward} ETH
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Latest Transactions
                </h3>
                <div className="space-y-3">
                  {mockTransactions.map(tx => (
                    <div
                      key={tx.hash}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => setSelectedTransaction(tx)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <ArrowRightIcon className="w-6 h-6 text-green-600" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-sm text-gray-900">
                              {formatHash(tx.hash)}
                            </span>
                            <div
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tx.status)}`}
                            >
                              {tx.status}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            From: {formatHash(tx.from)} → To:{' '}
                            {formatHash(tx.to)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {tx.value} ETH
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatTimeAgo(tx.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  AI-Powered Analytics
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Transaction Pattern Analysis
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Peak Activity:</span>
                        <span className="font-medium">14:00 - 16:00 UTC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Most Common Value:
                        </span>
                        <span className="font-medium">0.1 - 1.0 ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Success Rate:</span>
                        <span className="font-medium text-green-600">
                          97.3%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Gas Price Predictions
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Avg:</span>
                        <span className="font-medium">25 Gwei</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next Hour:</span>
                        <span className="font-medium text-orange-600">
                          28 Gwei ↑
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Optimal Time:</span>
                        <span className="font-medium">02:00 UTC (18 Gwei)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Network Health Score
                    </h4>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                            style={{ width: '89%' }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-green-600">
                        89/100
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Excellent network performance
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Smart Contract Activity
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">DEX Volume:</span>
                        <span className="font-medium">$1.2B (24h)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">NFT Trades:</span>
                        <span className="font-medium">2,847</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">DeFi TVL:</span>
                        <span className="font-medium">$45.8B</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Block Detail Modal */}
      {selectedBlock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Block #{selectedBlock.number.toLocaleString()}
                  </h2>
                  <p className="text-gray-600">Block Details</p>
                </div>
                <button
                  onClick={() => setSelectedBlock(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Hash
                    </label>
                    <p className="font-mono text-sm text-gray-900 break-all">
                      {selectedBlock.hash}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Timestamp
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedBlock.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Transactions
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedBlock.transactions.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Miner
                    </label>
                    <p className="font-mono text-sm text-gray-900 break-all">
                      {selectedBlock.miner}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Gas Used / Limit
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedBlock.gasUsed.toLocaleString()} /{' '}
                      {selectedBlock.gasLimit.toLocaleString()}
                      <span className="ml-2 text-gray-500">
                        (
                        {(
                          (selectedBlock.gasUsed / selectedBlock.gasLimit) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Size
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedBlock.size.toLocaleString()} bytes
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Difficulty
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedBlock.difficulty}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Block Reward
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedBlock.reward} ETH
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Transaction Details
                  </h2>
                  <p className="text-gray-600 font-mono">
                    {selectedTransaction.hash}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Status
                    </label>
                    <div
                      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedTransaction.status)}`}
                    >
                      {selectedTransaction.status}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      From
                    </label>
                    <p className="font-mono text-sm text-gray-900 break-all">
                      {selectedTransaction.from}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      To
                    </label>
                    <p className="font-mono text-sm text-gray-900 break-all">
                      {selectedTransaction.to}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Value
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedTransaction.value} ETH
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Block Number
                    </label>
                    <p className="text-sm text-gray-900">
                      #{selectedTransaction.blockNumber.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Confirmations
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedTransaction.confirmations}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Gas Price
                    </label>
                    <p className="text-sm text-gray-900">
                      {(selectedTransaction.gasPrice / 1e9).toFixed(2)} Gwei
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Gas Used / Limit
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedTransaction.gasUsed.toLocaleString()} /{' '}
                      {selectedTransaction.gasLimit.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
