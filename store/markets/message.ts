import { MsgExecuteContractCompat } from '@injectivelabs/sdk-ts'
import { useChainService } from '~/composables/useChainService'

interface MarketParams {
  baseDenom: string
  quoteDenom: string
  minPriceTickSize: string
  minQuantityTickSize: string
}

const TOKEN_CONTRACT_ADDRESS = ''
export const createMarketLaunch = async (market: MarketParams) => {
  const walletStore = useWalletStore()
  const { msgBroadcastClient } = useChainService()

  await walletStore.validate()

  // Preparing the message
  const msgCreateMarket = MsgExecuteContractCompat.fromJSON({
    contractAddress: TOKEN_CONTRACT_ADDRESS,
    sender: walletStore.injectiveAddress,
    msg: {
      createMarket: market
    }
  })

  // Signing and broadcasting the message
  await msgBroadcastClient.broadcast({
    msgs: msgCreateMarket,
    injectiveAddress: walletStore.injectiveAddress
  })
}
