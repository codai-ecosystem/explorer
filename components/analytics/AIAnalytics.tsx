'use client';

import React, { useState } from 'react';
import {
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  timeframe: '1h' | '24h' | '7d' | '30d';
  metrics: {
    totalTransactions: number;
    totalVolume: number;
    averageGasPrice: number;
    activeAddresses: number;
    contractCalls: number;
    dexVolume: number;
    nftTrades: number;
    defiTvl: number;
  };
  predictions: {
    gasPriceNext1h: number;
    gasPriceTrend: 'up' | 'down' | 'stable';
    volumePrediction: number;
    networkCongestion: 'low' | 'medium' | 'high';
  };
  insights: AIInsight[];
  anomalies: Anomaly[];
  smartContractAnalysis: SmartContractStats[];
}

interface AIInsight {
  id: string;
  type: 'trend' | 'opportunity' | 'risk' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  recommendation: string;
}

interface Anomaly {
  id: string;
  type: 'suspicious' | 'unusual' | 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  addresses: string[];
  timestamp: Date;
  investigation: string;
}

interface SmartContractStats {
  address: string;
  name: string;
  type: 'DEX' | 'NFT' | 'DeFi' | 'Gaming' | 'Other';
  transactions24h: number;
  volume24h: number;
  gasUsed: number;
  riskScore: number;
  aiAnalysis: string;
}

const mockAnalyticsData: AnalyticsData = {
  timeframe: '24h',
  metrics: {
    totalTransactions: 1245678,
    totalVolume: 2847932.45,
    averageGasPrice: 25.6,
    activeAddresses: 98432,
    contractCalls: 756234,
    dexVolume: 1567890123,
    nftTrades: 2847,
    defiTvl: 45890123456,
  },
  predictions: {
    gasPriceNext1h: 28.3,
    gasPriceTrend: 'up',
    volumePrediction: 3200000,
    networkCongestion: 'medium',
  },
  insights: [
    {
      id: '1',
      type: 'trend',
      title: 'Rising DeFi Activity',
      description:
        'DeFi protocol interactions have increased by 34% in the last 24 hours, indicating growing adoption of yield farming strategies.',
      confidence: 92,
      impact: 'high',
      recommendation:
        'Monitor gas prices as DeFi activity typically correlates with network congestion.',
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'Optimal Transaction Timing',
      description:
        'AI analysis shows transactions between 2:00-4:00 UTC have 40% lower gas costs on average.',
      confidence: 87,
      impact: 'medium',
      recommendation:
        'Schedule non-urgent transactions during low-activity periods to minimize costs.',
    },
    {
      id: '3',
      type: 'risk',
      title: 'Potential Flash Loan Attack Pattern',
      description:
        'Detected unusual borrowing patterns across multiple DeFi protocols that match historical flash loan attack signatures.',
      confidence: 76,
      impact: 'high',
      recommendation:
        'Increase monitoring of affected protocols and consider temporary risk mitigation measures.',
    },
    {
      id: '4',
      type: 'optimization',
      title: 'Gas Price Inefficiencies',
      description:
        '23% of transactions are overpaying for gas by more than 50% compared to optimal pricing.',
      confidence: 94,
      impact: 'medium',
      recommendation:
        'Implement dynamic gas pricing strategies based on network conditions.',
    },
  ],
  anomalies: [
    {
      id: '1',
      type: 'suspicious',
      severity: 'high',
      description:
        'Coordinated transaction pattern detected across 47 addresses with identical timing and amounts',
      addresses: ['0x742d35Cc...', '0x5aAeb605...', '0x8ba1f109...'],
      timestamp: new Date(Date.now() - 3600000),
      investigation: 'Potential wash trading or market manipulation scheme',
    },
    {
      id: '2',
      type: 'unusual',
      severity: 'medium',
      description:
        'Single address performed 10,000+ micro-transactions in 10 minutes',
      addresses: ['0x1aE0EA34...'],
      timestamp: new Date(Date.now() - 7200000),
      investigation: 'Possible bot testing or smart contract stress testing',
    },
    {
      id: '3',
      type: 'error',
      severity: 'critical',
      description:
        'Smart contract bug causing failed transactions with high gas consumption',
      addresses: ['0x6f46cf55...'],
      timestamp: new Date(Date.now() - 1800000),
      investigation:
        'Contract verification needed - potential reentrancy vulnerability',
    },
  ],
  smartContractAnalysis: [
    {
      address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      name: 'Uniswap V2 Router',
      type: 'DEX',
      transactions24h: 45632,
      volume24h: 987654321,
      gasUsed: 2456789,
      riskScore: 15,
      aiAnalysis:
        'Well-established DEX with consistent volume. Low risk of vulnerabilities.',
    },
    {
      address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
      name: 'Uniswap V3 Router',
      type: 'DEX',
      transactions24h: 38924,
      volume24h: 1234567890,
      gasUsed: 3456789,
      riskScore: 12,
      aiAnalysis:
        'Advanced AMM with capital efficiency features. Regular security audits.',
    },
    {
      address: '0x60E4d786628Fea6478F785A6d7e704777c86a7c6',
      name: 'Mayc Contract',
      type: 'NFT',
      transactions24h: 156,
      volume24h: 1250.75,
      gasUsed: 234567,
      riskScore: 25,
      aiAnalysis:
        'Popular NFT collection with moderate trading activity. Standard ERC-721 implementation.',
    },
    {
      address: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
      name: 'Unknown Contract',
      type: 'Other',
      transactions24h: 892,
      volume24h: 45.23,
      gasUsed: 156789,
      riskScore: 78,
      aiAnalysis:
        'Unverified contract with unusual gas patterns. Requires investigation.',
    },
  ],
};

export default function AIAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<AnalyticsData['timeframe']>('24h');
  const [selectedTab, setSelectedTab] = useState<
    'insights' | 'anomalies' | 'contracts' | 'predictions'
  >('insights');

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'trend':
        return <TrendingUpIcon className="w-5 h-5 text-blue-600" />;
      case 'opportunity':
        return <LightBulbIcon className="w-5 h-5 text-green-600" />;
      case 'risk':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
      case 'optimization':
        return <SparklesIcon className="w-5 h-5 text-purple-600" />;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'trend':
        return 'bg-blue-50 border-blue-200';
      case 'opportunity':
        return 'bg-green-50 border-green-200';
      case 'risk':
        return 'bg-red-50 border-red-200';
      case 'optimization':
        return 'bg-purple-50 border-purple-200';
    }
  };

  const getAnomalyColor = (severity: Anomaly['severity']) => {
    switch (severity) {
      case 'low':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'medium':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'high':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'critical':
        return 'text-red-800 bg-red-200 border-red-300';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 30) return 'text-green-600 bg-green-100';
    if (score <= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            AI Blockchain Analytics
          </h1>
          <p className="text-gray-600">
            Advanced insights powered by machine learning
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeframe}
            onChange={e =>
              setSelectedTimeframe(e.target.value as AnalyticsData['timeframe'])
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <ArrowPathIcon className="w-4 h-4" />
            <span>Refresh Analysis</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">
              Total Transactions
            </h3>
            <ChartBarIcon className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatNumber(mockAnalyticsData.metrics.totalTransactions)}
          </p>
          <p className="text-sm text-green-600">+12.5% from yesterday</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Volume</h3>
            <TrendingUpIcon className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatNumber(mockAnalyticsData.metrics.totalVolume)} ETH
          </p>
          <p className="text-sm text-green-600">+8.7% from yesterday</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Avg Gas Price</h3>
            <TrendingDownIcon className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {mockAnalyticsData.metrics.averageGasPrice} Gwei
          </p>
          <p className="text-sm text-red-600">-3.2% from yesterday</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">
              Active Addresses
            </h3>
            <ShieldCheckIcon className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatNumber(mockAnalyticsData.metrics.activeAddresses)}
          </p>
          <p className="text-sm text-blue-600">+5.4% from yesterday</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'insights', name: 'AI Insights', icon: LightBulbIcon },
              {
                id: 'anomalies',
                name: 'Anomaly Detection',
                icon: ExclamationTriangleIcon,
              },
              {
                id: 'contracts',
                name: 'Smart Contracts',
                icon: ShieldCheckIcon,
              },
              { id: 'predictions', name: 'Predictions', icon: TrendingUpIcon },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === tab.id
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
          {selectedTab === 'insights' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                AI-Generated Insights
              </h3>
              <div className="space-y-4">
                {mockAnalyticsData.insights.map(insight => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
                  >
                    <div className="flex items-start space-x-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {insight.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              Confidence:
                            </span>
                            <span className="font-medium text-gray-900">
                              {insight.confidence}%
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">
                          {insight.description}
                        </p>
                        <div className="bg-white p-3 rounded border">
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            Recommendation:
                          </p>
                          <p className="text-sm text-gray-800">
                            {insight.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'anomalies' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Anomaly Detection
              </h3>
              <div className="space-y-4">
                {mockAnalyticsData.anomalies.map(anomaly => (
                  <div
                    key={anomaly.id}
                    className={`p-4 rounded-lg border ${getAnomalyColor(anomaly.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <ExclamationTriangleIcon className="w-5 h-5" />
                        <span className="font-semibold capitalize">
                          {anomaly.severity} Risk
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {new Date(anomaly.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-800 mb-3">{anomaly.description}</p>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Affected Addresses:
                        </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {anomaly.addresses.map((address, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-mono rounded"
                            >
                              {address}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Investigation Notes:
                        </span>
                        <p className="text-sm text-gray-700 mt-1">
                          {anomaly.investigation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'contracts' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Smart Contract Analysis
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Contract
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        24h Txns
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Volume
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Risk Score
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        AI Analysis
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockAnalyticsData.smartContractAnalysis.map(contract => (
                      <tr key={contract.address} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {contract.name}
                            </div>
                            <div className="text-sm text-gray-500 font-mono">
                              {contract.address.slice(0, 10)}...
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {contract.type}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {contract.transactions24h.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {formatNumber(contract.volume24h)}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskScoreColor(contract.riskScore)}`}
                          >
                            {contract.riskScore}/100
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">
                          {contract.aiAnalysis}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedTab === 'predictions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                AI Predictions & Forecasts
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Gas Price Forecast
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Current:</span>
                      <span className="font-medium">
                        {mockAnalyticsData.metrics.averageGasPrice} Gwei
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Next Hour:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {mockAnalyticsData.predictions.gasPriceNext1h} Gwei
                        </span>
                        {mockAnalyticsData.predictions.gasPriceTrend ===
                        'up' ? (
                          <TrendingUpIcon className="w-4 h-4 text-red-500" />
                        ) : (
                          <TrendingDownIcon className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Network Load:</span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          mockAnalyticsData.predictions.networkCongestion ===
                          'low'
                            ? 'bg-green-100 text-green-800'
                            : mockAnalyticsData.predictions
                                  .networkCongestion === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {mockAnalyticsData.predictions.networkCongestion}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Volume Prediction
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current 24h:</span>
                      <span className="font-medium">
                        {formatNumber(mockAnalyticsData.metrics.totalVolume)}{' '}
                        ETH
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Predicted Next 24h:</span>
                      <span className="font-medium text-green-600">
                        {formatNumber(
                          mockAnalyticsData.predictions.volumePrediction
                        )}{' '}
                        ETH
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Growth Rate:</span>
                      <span className="font-medium text-green-600">
                        +
                        {(
                          ((mockAnalyticsData.predictions.volumePrediction -
                            mockAnalyticsData.metrics.totalVolume) /
                            mockAnalyticsData.metrics.totalVolume) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Market Trend Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingUpIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h5 className="font-semibold text-green-800">
                      Bullish Signals
                    </h5>
                    <p className="text-sm text-green-700">
                      DeFi TVL increasing, active addresses growing
                    </p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <ChartBarIcon className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <h5 className="font-semibold text-yellow-800">
                      Neutral Factors
                    </h5>
                    <p className="text-sm text-yellow-700">
                      Gas prices stabilizing, volume consistent
                    </p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <TrendingDownIcon className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <h5 className="font-semibold text-red-800">Risk Factors</h5>
                    <p className="text-sm text-red-700">
                      Potential flash loan attacks, contract vulnerabilities
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
