import { MsgExecuteContractCompat } from '@injectivelabs/sdk-ts'
import { useChainService } from '~/composables/useChainService'

const TOKEN_CONTRACT_ADDRESS = ''
export const createNewToken = async (metadata: {
  symbol: string
  name: string
  description: string
  logo: string
  decimals: number
}) => {
  const walletStore = useWalletStore()
  const { msgBroadcastClient } = useChainService()

  await walletStore.validate()

  // Preparing the message
  const msgCreateToken = MsgExecuteContractCompat.fromJSON({
    contractAddress: TOKEN_CONTRACT_ADDRESS,
    sender: walletStore.injectiveAddress,
    msg: {
      createToken: metadata
    }
  })

  // Signing and broadcasting the message
  await msgBroadcastClient.broadcast({
    msgs: msgCreateToken,
    injectiveAddress: walletStore.injectiveAddress
  })
}
