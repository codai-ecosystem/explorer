import { NextRequest, NextResponse } from 'next/server';

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
  parentHash: string;
  nonce: string;
  mixHash: string;
  receiptsRoot: string;
  stateRoot: string;
  transactionsRoot: string;
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
  nonce: number;
  input: string;
}

// Mock blockchain data - in production this would connect to actual blockchain nodes
const generateMockBlock = (blockNumber: number): Block => ({
  number: blockNumber,
  hash: `0x${Math.random().toString(16).substr(2, 64)}`,
  timestamp: new Date(Date.now() - (18750234 - blockNumber) * 15000), // ~15 sec block time
  transactions: Math.floor(Math.random() * 300) + 50,
  miner: `0x${Math.random().toString(16).substr(2, 40)}`,
  gasUsed: Math.floor(Math.random() * 10000000) + 20000000,
  gasLimit: 30000000,
  size: Math.floor(Math.random() * 100000) + 50000,
  difficulty: '58750234567890123456',
  totalDifficulty: '587502345678901234567890',
  reward: 2 + Math.random() * 0.5,
  parentHash: `0x${Math.random().toString(16).substr(2, 64)}`,
  nonce: `0x${Math.random().toString(16).substr(2, 16)}`,
  mixHash: `0x${Math.random().toString(16).substr(2, 64)}`,
  receiptsRoot: `0x${Math.random().toString(16).substr(2, 64)}`,
  stateRoot: `0x${Math.random().toString(16).substr(2, 64)}`,
  transactionsRoot: `0x${Math.random().toString(16).substr(2, 64)}`,
});

const generateMockTransaction = (blockNumber: number): Transaction => ({
  hash: `0x${Math.random().toString(16).substr(2, 64)}`,
  from: `0x${Math.random().toString(16).substr(2, 40)}`,
  to: `0x${Math.random().toString(16).substr(2, 40)}`,
  value: Math.random() * 10,
  gasPrice: Math.floor(Math.random() * 50000000000) + 10000000000,
  gasUsed: Math.floor(Math.random() * 100000) + 21000,
  gasLimit: Math.floor(Math.random() * 200000) + 21000,
  status: Math.random() > 0.1 ? 'success' : 'failed',
  timestamp: new Date(Date.now() - Math.random() * 3600000),
  blockNumber,
  confirmations: Math.floor(Math.random() * 10) + 1,
  type: ['Transfer', 'Contract Call', 'DEX Swap', 'NFT Trade'][
    Math.floor(Math.random() * 4)
  ],
  nonce: Math.floor(Math.random() * 1000),
  input:
    Math.random() > 0.5
      ? '0x'
      : `0x${Math.random().toString(16).substr(2, 200)}`,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'latest';
    const limit = parseInt(searchParams.get('limit') || '10');
    const blockNumber = searchParams.get('block');
    const hash = searchParams.get('hash');

    // Handle different query types
    switch (type) {
      case 'latest':
        const latestBlocks = [];
        const currentBlock = 18750234;
        for (let i = 0; i < Math.min(limit, 50); i++) {
          latestBlocks.push(generateMockBlock(currentBlock - i));
        }
        return NextResponse.json({
          success: true,
          data: {
            blocks: latestBlocks,
            totalBlocks: currentBlock,
            avgBlockTime: 15.2,
          },
        });

      case 'transactions':
        const latestTransactions = [];
        for (let i = 0; i < Math.min(limit, 50); i++) {
          latestTransactions.push(
            generateMockTransaction(18750234 - Math.floor(i / 10))
          );
        }
        return NextResponse.json({
          success: true,
          data: {
            transactions: latestTransactions,
            totalTransactions: 2456789012,
          },
        });

      case 'block':
        if (!blockNumber && !hash) {
          return NextResponse.json(
            { success: false, error: 'Block number or hash required' },
            { status: 400 }
          );
        }

        const blockNum = blockNumber ? parseInt(blockNumber) : 18750234;
        const block = generateMockBlock(blockNum);

        // Generate transactions for this block
        const blockTransactions = [];
        for (let i = 0; i < block.transactions; i++) {
          blockTransactions.push(generateMockTransaction(blockNum));
        }

        return NextResponse.json({
          success: true,
          data: {
            block,
            transactions: blockTransactions.slice(0, 20), // Limit to first 20 for API response
            totalTransactions: block.transactions,
          },
        });

      case 'transaction':
        if (!hash) {
          return NextResponse.json(
            { success: false, error: 'Transaction hash required' },
            { status: 400 }
          );
        }

        const transaction = generateMockTransaction(18750234);
        transaction.hash = hash;

        return NextResponse.json({
          success: true,
          data: { transaction },
        });

      case 'stats':
        const stats = {
          latestBlock: 18750234,
          totalTransactions: 2456789012,
          totalAddresses: 245678901,
          averageBlockTime: 15.2,
          networkHashRate: '485.2 TH/s',
          difficulty: '58.75 T',
          totalSupply: 120450678.45,
          circulatingSupply: 120450234.12,
          gasPrice: {
            slow: 18,
            standard: 25,
            fast: 35,
            instant: 50,
          },
          networkUtilization: 78.5,
        };

        return NextResponse.json({
          success: true,
          data: stats,
        });

      case 'search':
        const query = searchParams.get('q');
        if (!query) {
          return NextResponse.json(
            { success: false, error: 'Search query required' },
            { status: 400 }
          );
        }

        // Determine search type based on query format
        let searchResult = null;
        let searchType = 'unknown';

        if (query.match(/^\d+$/)) {
          // Block number
          searchType = 'block';
          searchResult = generateMockBlock(parseInt(query));
        } else if (query.startsWith('0x') && query.length === 66) {
          // Transaction hash
          searchType = 'transaction';
          searchResult = generateMockTransaction(18750234);
          searchResult.hash = query;
        } else if (query.startsWith('0x') && query.length === 42) {
          // Address
          searchType = 'address';
          searchResult = {
            address: query,
            balance: Math.random() * 1000,
            transactionCount: Math.floor(Math.random() * 10000),
            isContract: Math.random() > 0.7,
            firstSeen: new Date(Date.now() - Math.random() * 31536000000), // Random date within last year
            lastActivity: new Date(Date.now() - Math.random() * 86400000), // Random date within last day
          };
        }

        return NextResponse.json({
          success: true,
          data: {
            query,
            type: searchType,
            result: searchResult,
          },
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid query type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error fetching blockchain data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blockchain data' },
      { status: 500 }
    );
  }
}
