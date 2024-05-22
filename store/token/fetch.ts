import { Token } from '@injectivelabs/token-metadata'

export const fetchTokens = async () => {
  const tokenStore = useTokenStore()
  const walletStore = useWalletStore()

  const { env } = useAppStore()

  if (!walletStore.injectiveAddress) {
    return
  }

  if (tokenStore.chainTokens.length > 0) {
    return
  }

  const { allTokens } = await $fetch(`/api/tokens?env=${env}`)

  const chainTokens = allTokens

  tokenStore.$patch({
    chainTokens: [
      ...chainTokens
        .filter((x) => x.symbol !== 'UNTRACKED' && x.symbol !== 'Unknown')
        .sort((a, b) => a.symbol.localeCompare(b.symbol)),
      ...chainTokens
        .filter((x) => x.symbol === 'UNTRACKED' || x.symbol === 'Unknown')
        .map((x) => ({ ...x, decimals: undefined, symbol: null }))
    ] as Token[]
  })
}
