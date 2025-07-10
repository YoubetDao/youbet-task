import { ethers } from 'ethers'

export class GDAv1Forwarder {
  private static FORWARDER_ABI = [
    {
      inputs: [
        { internalType: 'contract ISuperToken', name: 'pool', type: 'address' },
        { internalType: 'bytes', name: 'userData', type: 'bytes' },
      ],
      name: 'connectPool',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'contract ISuperToken', name: 'pool', type: 'address' },
        { internalType: 'bytes', name: 'userData', type: 'bytes' },
      ],
      name: 'disconnectPool',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'contract ISuperToken', name: 'pool', type: 'address' },
        { internalType: 'address', name: 'memberAddress', type: 'address' },
        { internalType: 'bytes', name: 'userData', type: 'bytes' },
      ],
      name: 'claimAll',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]
  private forwarderAddress: string

  constructor(forwarderAddress = '0x6DA13Bde224A05a288748d857b9e7DDEffd1dE08') {
    this.forwarderAddress = forwarderAddress
  }

  async connectPool(pool: string) {
    const forwarder = await this.getForwarderContract()
    const emptyData = '0x'
    const tx = await forwarder.connectPool(pool, emptyData)
    await tx.wait()
  }

  async disconnectPool(pool: string) {
    const forwarder = await this.getForwarderContract()
    const emptyData = '0x'
    const tx = await forwarder.disconnectPool(pool, emptyData)
    await tx.wait()
  }

  async getForwarderContract() {
    const browserProvider = new ethers.BrowserProvider(window.ethereum)
    const signer = await browserProvider.getSigner()
    const forwarder = new ethers.Contract(this.forwarderAddress, GDAv1Forwarder.FORWARDER_ABI, signer)
    return forwarder
  }
}
