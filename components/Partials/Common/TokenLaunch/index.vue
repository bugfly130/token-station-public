<script setup lang="ts">
import { BigNumberInWei, Status } from '@injectivelabs/utils'

const tokenStore = useTokenStore()
const accountStore = useAccountStore()
const { $onError } = useNuxtApp()

const { values, validate } = useForm()

const status = reactive(new Status())

const injFee = computed(
  // TODO
  () =>
    new BigNumberInWei(
      tokenStore.params.denomCreationFee.find((x) => x.denom === 'inj')
        ?.amount || 0
    )
)

const handleCreateDenom = async () => {
  const { valid } = await validate()

  if (!valid) {
    return
  }

  status.setLoading()
  try {
    await tokenStore.createNewToken({
      symbol: values.symbol,
      name: values.name,
      description: values.description,
      logo: values.logo,
      decimals: values.decimals
    })
  } catch (error: any) {
    $onError(error)
  } finally {
    status.setIdle()
  }
}

onMounted(() => {
  accountStore.fetchAccountPortfolio()
})
</script>

<template>
  <div>
    <PartialsCommonTokenLaunchForm />
    <AppFundValidator :inj-fee="injFee" />
    <div class="flex gap-4 items-center mt-2">
      <AppButton
        :status="status"
        class="bg-gray-750 font-semibold"
        @click="handleCreateDenom"
      >
        Create Token
      </AppButton>
    </div>
  </div>
</template>
