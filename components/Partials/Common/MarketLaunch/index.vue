<script setup lang="ts">
import { QuoteDenoms } from '~/app/data/quoteDenom'

const { env } = useAppStore()
const tokenStore = useTokenStore()

const { value: baseToken, errorMessage: baseTokenError } = useStringFieldCustom(
  {
    name: 'baseToken',
    rule: 'required'
  }
)

const quoteTokenOptions = computed(() => QuoteDenoms[env])

const { value: quoteToken } = useStringFieldCustom({
  name: 'quoteToken',
  rule: 'required',
  initialValue: quoteTokenOptions.value[0].value
})

const { value: baseTick, errorMessage: baseTickError } = useStringFieldCustom({
  name: 'baseTick',
  rule: 'required'
})

const { value: quoteTick, errorMessage: quoteTickError } = useStringFieldCustom(
  {
    name: 'quoteTick',
    rule: 'required'
  }
)

const baseDenomOptions = computed(() => [
  ...tokenStore.tokens?.map((item) => ({
    display: item.tokenType === null ? '' : item.symbol,
    value: item.denom
  }))
])
</script>

<template>
  <div class="grid grid-cols-2 gap-x-4 gap-y-6 mb-4">
    <div>
      <div class="flex mb-2 items-center gap-1">
        <label class="block text-xs font-semibold"> Base Token* </label>
        <CommonInfoTooltip
          tooltip="This is the asset you would like to trade."
        />
      </div>
      <AppSelectField
        v-model="baseToken"
        label="Base Token*"
        :options="baseDenomOptions"
        searchable
        :selected-class="'justify-between py-1 px-3 border  border-gray-300'"
      >
        <template #selected-item="{ option }">
          <div v-if="option" class="p-2 bg-gray-200 cursor-defaul text-sm">
            <span v-if="option?.display?.length" class="font-semibold mr-2">
              {{ option?.display }}
            </span>
            <span class="font-semibold text-gray-600">
              {{ option?.value }}
            </span>
          </div>
        </template>
        <template #selected-option="{ option }">
          <span v-if="!option" class="text-gray-500"> Select </span>
          <span v-else>
            {{
              option?.display ||
              option?.value.slice(0, 12) + '...' + option?.value.slice(-5)
            }}
          </span>
        </template>

        <template #option="{ option }">
          <div>
            <span v-if="option?.display?.length" class="font-semibold mr-2">
              {{ option?.display }}
            </span>
            <span class="font-semibold text-gray-600">
              {{ option?.value }}
            </span>
          </div>
        </template>
      </AppSelectField>
      <p class="text-red-500 text-xs mt-1">
        {{ baseTokenError }}
      </p>
    </div>
    <div>
      <div class="flex mb-2 items-center gap-1">
        <label class="block text-xs font-semibold"> Quote Token* </label>
        <CommonInfoTooltip
          tooltip="This is the asset by which the market will be denominated. You can buy the base asset with the quote asset, common examples include USDT and USDC."
        />
      </div>
      <AppSelect
        v-model="quoteToken"
        label="Quote Token*"
        :options="quoteTokenOptions"
        :wrapper-class="'justify-between py-1 px-3 border  border-gray-300'"
      >
        <template #default="{ selected }">
          <span v-if="selected">
            {{ selected.display }}
          </span>
          <span v-else class="text-gray-500"> Select </span>
        </template>

        <template #option="{ option }">
          <span>
            {{ option.display }}
          </span>
        </template>
      </AppSelect>
    </div>
    <div class="col-span-2 grid grid-cols-2 gap-x-4">
      <div>
        <div class="flex mb-2 items-center gap-1">
          <label class="block text-xs font-semibold">Price Tick Size* </label>
          <CommonInfoTooltipWithElement>
            <template #content>
              Defines the minimum tick size of the order's price and margin.
              <br /><br />For example, the price tick size in the INJ/USDT
              market is 0.001. Thus, the INJ price in USDT has 3 decimals.<br /><br />
              The price of the base asset will determine the most appropriate
              tick size, visit the Injective Explorer
              <a
                class="text-gray-300 underline"
                href="https://explorer.injective.network/markets/trading-rules/"
                target="_blank"
                >Injective Explorer
              </a>
              to view active markets and examples.
            </template>
          </CommonInfoTooltipWithElement>
        </div>

        <AppInput
          v-model="baseTick"
          placeholder="0.00001"
          input-classes="focus:border focus:border-solid focus:border-gray-300"
          class="w-full max-w-96 border border-gray-300 py-1"
          :transparent-bg="true"
        />
        <p class="text-red-500 text-xs mt-1">
          {{ baseTickError }}
        </p>
      </div>
      <div>
        <div class="flex mb-2 items-center gap-1">
          <label class="block text-xs font-semibold">
            Quantity Tick Size*
          </label>
          <CommonInfoTooltipWithElement>
            <template #content>
              Defines the minimum tick size of the order's quantity.
              <br /><br />For example, the quantity tick size in the INJ/USDT
              market is 0.001. Thus, the minimum amount you can trade is 0.001
              INJ. <br /><br />
              The price of the base asset will determine the most appropriate
              tick size, visit the
              <a
                class="text-gray-300 underline"
                href="https://explorer.injective.network/markets/trading-rules/"
                target="_blank"
                >Injective Explorer
              </a>
              to view active markets and examples.
            </template>
          </CommonInfoTooltipWithElement>
        </div>
        <AppInput
          v-model="quoteTick"
          placeholder="1"
          input-classes="focus:border focus:border-solid focus:border-gray-300"
          class="w-full max-w-96 border border-gray-300 py-1"
          :transparent-bg="true"
        />
        <p class="text-red-500 text-xs mt-1">
          {{ quoteTickError }}
        </p>
      </div>
    </div>
  </div>
</template>
