import { ethers } from 'ethers'

export class Distributor {
  private static instance: Distributor | null = null
  private distributorAddress: string

  // Contract ABIs
  private static DISTRIBUTOR_ABI = [
    'function createRedPacket(string uuid, string[] githubIds, uint256[] amounts, string creatorId, string sourceType) external',
    'function claimRedPacket(string uuid, string githubId, bytes signature) external',
    'function refundRedPacket(string uuid) external',
    'function token() external view returns (address)',
    'function batchCreateRedPacket(tuple(string uuid, string[] githubIds, uint256[] amounts, string creatorId, string sourceType)[] batch) external',
    'function batchClaimRedPacket(tuple(string uuid, string githubId, bytes signature)[] batch) external',
  ]

  private static TOKEN_ABI = [
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address owner, address spender) external view returns (uint256)',
    'function balanceOf(address account) external view returns (uint256)',
    'function symbol() external view returns (string)',
    'function decimals() external view returns (uint8)',
  ]

  private constructor(distributorAddress: string) {
    this.distributorAddress = distributorAddress
  }

  static getInstance(address?: string): Distributor {
    console.log('contractAddress', address)
    if (!Distributor.instance || address !== Distributor.instance.distributorAddress) {
      const contractAddress =
        address || import.meta.env.VITE_DISTRIBUTOR_ADDRESS || '0xBE639b42A3818875D59992d80F18280387cFB412'
      Distributor.instance = new Distributor(contractAddress)
    }
    return Distributor.instance
  }

  static resetInstance(): void {
    Distributor.instance = null
  }

  async getDistributorContract() {
    const browserProvider = new ethers.BrowserProvider(window.ethereum)
    const signer = await browserProvider.getSigner()
    const distributor = new ethers.Contract(this.distributorAddress, Distributor.DISTRIBUTOR_ABI, signer)
    return distributor
  }

  async getTokenContract() {
    const distributorContract = await this.getDistributorContract()
    const tokenAddress = await distributorContract.token()
    const browserProvider = new ethers.BrowserProvider(window.ethereum)
    const signer = await browserProvider.getSigner()
    const token = new ethers.Contract(tokenAddress, Distributor.TOKEN_ABI, signer)
    return token
  }

  async getAddress() {
    return await this.distributorAddress
  }

  async getTokenAddress() {
    const distributorContract = await this.getReadOnlyDistributorContract()
    return await distributorContract.token()
  }

  async approveAllowance(amount: bigint) {
    const tokenContract = await this.getTokenContract()
    const tx = await tokenContract.approve(await this.getAddress(), amount)
    return await tx.wait()
  }

  async getTokenSymbolAndDecimals() {
    const tokenContract = await this.getReadOnlyTokenContract()
    return [await tokenContract.symbol(), await tokenContract.decimals()]
  }

  async getAllowance(walletAddress: string) {
    const tokenContract = await this.getTokenContract()
    return await tokenContract.allowance(walletAddress, await this.getAddress())
  }

  async getBalance(walletAddress: string) {
    const tokenContract = await this.getTokenContract()
    return await tokenContract.balanceOf(walletAddress)
  }

  async createRedPacket(uuid: string, githubIds: string[], amounts: bigint[], creatorId: string, sourceType: string) {
    try {
      const contract = await this.getDistributorContract()
      console.log('contract >>>>', contract)

      const tx = await contract.createRedPacket(uuid, githubIds, amounts, creatorId, sourceType)
      return await tx.wait()
    } catch (error) {
      console.log('createRedPacket', error)
    }
  }

  async claimRedPacket(uuid: string, githubId: string, signature: string) {
    const contract = await this.getDistributorContract()
    const tx = await contract.claimRedPacket(uuid, githubId, signature)

    return await tx.wait()
  }

  async refundRedPacket(uuid: string) {
    const contract = await this.getDistributorContract()
    const tx = await contract.refundRedPacket(uuid)
    return await tx.wait()
  }

  async batchCreateRedPacket(
    batch: {
      uuid: string
      githubIds: string[]
      amounts: bigint[]
      creatorId: string
      sourceType: string
    }[],
  ) {
    const contract = await this.getDistributorContract()
    const tx = await contract.batchCreateRedPacket(batch)
    return await tx.wait()
  }

  async batchClaimRedPacket(
    batch: {
      uuid: string
      githubId: string
      signature: string
    }[],
  ) {
    const contract = await this.getDistributorContract()
    const tx = await contract.batchClaimRedPacket(batch)
    return await tx.wait()
  }

  private async getReadOnlyProvider() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const network = await provider.getNetwork()

    const rpcUrl = network.name.includes('op') ? import.meta.env.VITE_OP_RPC_URL : import.meta.env.VITE_BSC_RPC_URL

    console.log('rpcUrl >>>>', rpcUrl)

    return new ethers.JsonRpcProvider(rpcUrl)
  }

  private async getReadOnlyDistributorContract() {
    const provider = await this.getReadOnlyProvider()
    return new ethers.Contract(this.distributorAddress, Distributor.DISTRIBUTOR_ABI, provider)
  }

  private async getReadOnlyTokenContract() {
    const distributorContract = await this.getReadOnlyDistributorContract()
    const tokenAddress = await distributorContract.token()
    const provider = await this.getReadOnlyProvider()
    return new ethers.Contract(tokenAddress, Distributor.TOKEN_ABI, provider)
  }
}

export const getDistributor = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const network = await provider.getNetwork()

  const contractAddress = network.name.includes('op')
    ? import.meta.env.VITE_OP_CONTRACT_ADDRESS
    : import.meta.env.VITE_BSC_CONTRACT_ADDRESS

  return Distributor.getInstance(contractAddress)
}
