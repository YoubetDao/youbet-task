import { ethers } from 'ethers'

export class Distributor {
  private distributorAddress: string

  // Contract ABIs
  private static DISTRIBUTOR_ABI = [
    'function createRedPacket(string uuid, string[] githubIds, uint256[] amounts) external',
    'function claimRedPacket(string uuid, string githubId, bytes signature) external',
    'function refundRedPacket(string uuid) external',
    'function token() external view returns (address)',
  ]

  private static TOKEN_ABI = [
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address owner, address spender) external view returns (uint256)',
    'function balanceOf(address account) external view returns (uint256)',
    'function symbol() external view returns (string)',
    'function decimals() external view returns (uint8)',
  ]

  constructor(distributorAddress: string) {
    this.distributorAddress = distributorAddress
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

  async createRedPacket(uuid: string, githubIds: string[], amounts: bigint[]) {
    const contract = await this.getDistributorContract()
    const tx = await contract.createRedPacket(uuid, githubIds, amounts)
    return await tx.wait()
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

  private async getReadOnlyProvider() {
    return new ethers.JsonRpcProvider(import.meta.env.VITE_DISTRIBUTOR_RPC_URL || 'https://sepolia.optimism.io')
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

const distributorAddress = import.meta.env.VITE_DISTRIBUTOR_ADDRESS || '0xBE639b42A3818875D59992d80F18280387cFB412'

const distributor = new Distributor(distributorAddress)

export { distributor }
