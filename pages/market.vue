<script lang="ts" setup>
import { Status, StatusType } from '@injectivelabs/utils'
import { createMarketLaunch } from '~/store/markets/message'
import { Modal } from '~/types'

const modalStore = useModalStore()
const tokenStore = useTokenStore()
const walletStore = useWalletStore()

const { values, resetForm, validate } = useForm()

const { $onError } = useNuxtApp()
const { success } = useNotifications()

const status = reactive(new Status())
const tokenFetchStatus = reactive(new Status(StatusType.Loading))

const isModalOpen = computed<boolean>(
  () => modalStore.modals[Modal.Connect] && !walletStore.isUserWalletConnected
)

function handleModalClose() {
  modalStore.closeModal(Modal.GovLaunchRedirection)
}

onMounted(async () => {
  await tokenStore.fetchTokens()
  tokenFetchStatus.setIdle()
})

const handleCreateMarket = async () => {
  const { valid } = await validate()

  if (!valid) {
    return
  }

  status.setLoading()

  try {
    await walletStore.validate()

    const marketParams = {
      baseDenom: values.baseDenom,
      quoteDenom: values.quoteDenom,
      minPriceTickSize: values.baseTick,
      minQuantityTickSize: values.quoteTick
    }

    const msg = createMarketLaunch(marketParams)

    await msg
      .then(() => {
        success({
          title: 'Success'
        })
        resetForm({
          values: {
            baseToken: values.baseToken
          }
        })
      })
      .catch($onError)
      .finally(() => {
        status.setIdle()
      })
  } finally {
    status.setIdle()
  }
}
</script>
<template>
  <AppHocLoading
    class="h-full"
    :status="tokenFetchStatus"
    :is-user-connected="walletStore.isUserWalletConnected"
  >
    <div class="container">
      <div class="w-full mx-auto my-4 md:my-12 4xl:w-4/5 relative text-black">
        <CommonPageTitle title="Create Liquidity Pair" />
        <CommonCard>
          <div>
            <PartialsCommonMarketLaunch />
            <AppButton
              :status="status"
              class="bg-gray-750 font-semibold mt-2 mb-4"
              @click="handleCreateMarket"
            >
              Create Liquidity Pair
            </AppButton>
          </div>
        </CommonCard>
        <AppModal
          :is-open="isModalOpen"
          class="bg-white"
          :ignore="['.v-popper__popper']"
          md
          @modal:closed="handleModalClose"
        >
          <template #title>
            <h3>Government proposal</h3>
          </template>
          Your Government proposal was created and is available here:
          <a
            target="_blank"
            href="https://hub.injective.network/governance"
            class="font-bold text-blue-550"
            >Injective Hub
          </a>
        </AppModal>
      </div>
    </div>
  </AppHocLoading>
</template>
