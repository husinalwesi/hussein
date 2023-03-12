<template>
  <BaseModal
    :classes="[`min-550:w-[32rem] max-w-[40rem] mobiles:max-w-[343px] sizes-modal`]"
    content-wrapper-classes="w-[32rem]"
    :show-modal="showModal"
    :show-close-icon="false"
    @closeModal="$emit('close-modal',false)"
  >
    <h2 slot="header" class="modal-header capitalize">
      {{ $t(`COMMON.PEOPLE.${guestType.toUpperCase()}`) }} {{ title }} {{ $t('GEAR.SIZE') }}
    </h2>
    <div slot="content">
      <div class="flex justify-start ltr:pr-10 rtl:pl-10 mt-6 gap-x-10">
        <template
          v-for="sizeType in sizesTitles"
        >
          <BaseRadio
            v-if="sizeList[sizeType.id]&&(sizeList[sizeType.id]||[]).length"
            :key="sizeType.id"
            v-model="selectedTab"
            :rules="{ required: true }"
            vid="titles"
            :attr-val="sizeType.id"
            :r-b-i-oname="'sizeItem'"
            :r-b-i-olabel="sizeType.label"
            :r-b-i-oid="sizeType.label + sizeType.id"
            @input="changeTab($event)"
          />
        </template>
      </div>
      <table v-if="selectedTab!=='all'" class="text-center mt-8 w-full">
        <thead>
          <tr class="dashed-border pb-4">
            <th v-for="head of generateTableHeader()" :key="head" class="title capitalize">
              {{ head }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sizeItem,index) in filterItem()" :key="index" class="dashed-border p-4">
            <td class="title">
              {{ sizeItem.size || sizeItem['Our Size (EUR)'] }}
            </td>
            <td v-if="sizeItem['uk '] || sizeItem['uk'] || sizeItem['length'] " class="title">
              {{ sizeItem['uk '] || sizeItem['uk'] || sizeItem['length'] }}
            </td>
            <td
              v-if="sizeItem['shoulder_length '] || sizeItem['shoulder_length'] || sizeItem.waist || sizeItem.us"
              class="title"
            >
              {{ sizeItem['shoulder_length '] || sizeItem['shoulder_length'] || sizeItem.waist || sizeItem.us }}
            </td>
            <td v-if="sizeItem.chest || sizeItem.legs" class="title">
              {{ sizeItem.chest || sizeItem.legs }}
            </td>
            <td v-if="sizeItem.sleeves" class="title">
              {{ sizeItem.sleeves }}
            </td>
          </tr>
        </tbody>
      </table>
      <table v-else class="text-center mt-8 w-full">
        <thead>
          <tr class="dashed-border pb-4">
            <th class="title">
              {{ $t('GEAR.SIZE') }}
            </th>
            <th class="title">
              {{ $t('GEAR.EUR') }}
            </th>
            <th class="title">
              {{ $t('GEAR.UK') }}
            </th>
            <th class="title">
              {{ $t('GEAR.US') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sizeItem,index) in filterItem()" :key="index" class="dashed-border p-4">
            <td class="title">
              {{ sizeItem.size }}
            </td>
            <td class="title">
              {{ sizeItem.eur }}
            </td>
            <td class="title">
              {{ sizeItem.uk }}
            </td>
            <td class="title">
              {{ sizeItem.us }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-end mt-6">
        <BaseButton
          class-name="btn-close"
          btn-type="button"
          :text="$t('COMMON.CLOSE')"
          @onBtnClick="$emit('close-modal',false)"
        />
      </div>
    </div>
  </BaseModal>
</template>

<script>
export default {
  props: {
    showModal: {
      required: true,
      type: Boolean,
    },
    sizeList: {
      type: [Array, Object],
      default: () => ([] || {})
    },
    title: {
      type: String,
      default: () => ''
    },
    gear: {
      type: Object,
      default: () => {
      }
    },
    guestType: {
      type: String,
      default: () => ''
    }
  },
  emits: ['close-modal'],
  data() {
    return {
      //todo: connect the radio button with the right data when api is ready
      isFinished: false,
      sizesTitles: [
        {label: this.$t("GEAR.ALL_SIZES"), id: 'all', value: "all"},
        {label: this.$t("GEAR.SIZES_IN_CM"), id: 'cm', value: "cm"},
      ],
      selectedTab: 'all',
      headers: ['Size', 'Eur', 'UK', 'US'],
      allSizeList: []
    }
  },
  mounted() {
    if (this.gear.uuid === 'boots') {
      this.sizesTitles = [
        {
          label: this.guestType === 'child' ? this.$t('GEAR.GEAR_SIZES.GIRLS') : this.$t('GEAR.GEAR_SIZES.FEMALE'),
          id: 'female',
          value: "female"
        },
        {
          label: this.guestType === 'child' ? this.$t('GEAR.GEAR_SIZES.BOYS') : this.$t('GEAR.GEAR_SIZES.MALE'),
          id: 'male',
          value: "male"
        },
      ]
      this.selectedTab = 'female'
    } else {
      this.selectedTab = 'cm'
    }
  },
  methods: {
    generateTableHeader() {
      let header = []

      if (this.gear.uuid === 'boots') {
        header = [this.$t("GEAR.GEAR_SIZES.OUR_SIZE_EUR"), this.$t('GEAR.UK'), this.$t('GEAR.US')]
      } else if (this.gear.uuid === 'trousers') {
        header = [this.$t("GEAR.SIZE"), this.$t("GEAR.LENGTH"), this.$t("GEAR.WAIST"), this.$t("GEAR.LEGS")]
      } else {
        header = [this.$t("GEAR.SIZE"), this.$t("GEAR.LENGTH"), this.$t("GEAR.SHOULDER"), this.$t("GEAR.CHEST"), this.$t("GEAR.SLEEVES")]
      }


      return header
    },
    filterItem() {
      if (this.sizeList && Object.keys(this.sizeList).length > 0) {
        if (this.gear.uuid === 'boots') {
          return this.sizeList[this.guestType].filter(item => item.gender === this.selectedTab)
        }

        if (this.selectedTab !== 'all')
          return this.sizeList[this.selectedTab].filter(item => item.guest_type === this.guestType)

        return this.sizeList[this.selectedTab]
      }
      return []
    },
    changeTab() {
      this.headers = this.generateTableHeader()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./SizesPopup.scss";
</style>
