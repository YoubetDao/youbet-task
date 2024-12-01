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
    const distributorContract = await this.getDistributorContract()
    return await distributorContract.token()
  }

  async approveAllowance(amount: bigint) {
    const tokenContract = await this.getTokenContract()
    const tx = await tokenContract.approve(await this.getAddress(), amount)
    return await tx.wait()
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
}

const distributorAddress = import.meta.env.VITE_DISTRIBUTOR_ADDRESS || '0x1a48F5d414DDC79a79f519A665e03692B2a2c450'

const distributor = new Distributor(distributorAddress)

export { distributor }
