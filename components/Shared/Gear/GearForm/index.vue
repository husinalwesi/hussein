<template>
  <ValidationObserver ref="add-gear">
    <div class="gear-form-container">
      <div class="devider-dashed my-8" />
      <div v-if="isGuest" class="flex flex-row mobiles:flex-col mb-4 mt-6">
        <div class="w-1/2 ltr:mr-4 rtl:ml-4 mobiles:mb-4 mobiles:w-full">
          <BaseInput
            v-model="data.first_name"
            i-n-ptype="text"
            i-n-pname="firstName"
            :i-n-pplaceholder="$t('CREDENTIALS_FORM.FIELDS.FIRST_NAME')"
            :classes="['cursor-pointer', 'bg-white']"
            :rules="{ required: true }"
          />
        </div>
        <div class="w-1/2 mobiles:w-full">
          <BaseInput
            v-model="data.last_name"
            i-n-ptype="text"
            i-n-pname="LastName"
            :i-n-pplaceholder="$t('CREDENTIALS_FORM.FIELDS.LAST_NAME')"
            :classes="['cursor-pointer', 'bg-white']"
            :rules="{ required: true }"
          />
        </div>
      </div>
      <div v-if="isGuest" class="flex flex-col mb-6">
        <BaseDate
          :placeholder="$t('CREDENTIALS_FORM.DD_MM_YYYY')"
          :show-input-title="false"
          :date="data.date_of_birth"
          :is-date-picker-old-days-disabled="false"
          :extra-rules="{dateRange:dateRange}"
          @selectDate="selectDate"
        />
      </div>
      <template v-if="isDubaiEnv">
        <h3 class="action-title">
          {{ $t(`GEAR.EQUIPMENT_SECTION.${currentEnv}.TITLE`) }}
        </h3>
      </template>

      <div class="flex flex-col md:flex-row md:mt-2 gap-2">
        <div class="description-wrapper">
          <p class="description">
            {{
              isDubaiEnv ? $t(`GEAR.EQUIPMENT_SECTION.${currentEnv}.DESCRIPTION`) : $t('GEAR.ADD_GEAR')
            }}
          </p>
        </div>
        <div class="checkboxes-container" :class="{'pointer-events-none':isGuest}">
          <BaseCheckbox
            v-if="!isGuest&&(ticket.need_gear||isUser)&&isDubaiEnv"
            :id="'equipmentCheckbox'"
            v-model="data.equipmentCheckboxModel"
            :label="$t('GEAR.EQUIPMENT')"
            class="ltr:mr-2 rtl:ml-2"
          />
          <BaseCheckbox
            :id="'gearCheckbox'"
            v-model="data.gearCheckboxModel"
            :label="$t('GEAR.GEAR')"
          />
        </div>
      </div>

      <template v-if="data.equipmentCheckboxModel&&(!isUser?ticket.need_gear:true)&&isDubaiEnv">
        <div class="equipments-container">
          <h3 class="title">
            {{ $t(`GEAR.EQUIPMENT_SECTION.${currentEnv}.WHAT_EQUIPMENT_NEED`) }}
          </h3>
          <div class="equipment-cards">
            <div
              v-for="(equipment, index) in metaData.equipments"
              :key="index"
              class="product-card-container equipment-card"
              @click="selectEquipment(equipment)"
            >
              <div
                class="product-wrapper"
                :class="{
                  selected: data.equipment_id===equipment.id,
                  'error':errors.equipment
                }"
              >
                <img
                  :src="equipment.image"
                  alt="equipment img"
                  title="equipment img"
                  width="152"
                  height="152"
                >
                <div class="icon-wrapper" :class="{ selected: data.equipment_id===equipment.id }">
                  <Checkmark
                    width="16"
                    height="16"
                    :color="data.equipment_id===equipment.id ? 'white' : '#1A1A1A'"
                  />
                </div>
              </div>
              <div class="description" :class="{ selected: data.equipment_id===equipment.id }">
                {{ equipment.title }}
              </div>
            </div>
          </div>
        </div>
        <div class="devider-dashed my-8 md:my-10" />

        <div class="skill-level-chips-container">
          <h3 class="title">
            {{ $t(`GEAR.EQUIPMENT_SECTION.${currentEnv}.WHAT_SKILL_NEED`) }}
          </h3>
          <div class="skill-level-chips">
            <div
              v-for="(skill, index) in metaData.levels"
              :key="index"
              class="skill-chip"
              :class="{ selected: Number(data.level)===Number(skill.id), 'error':errors.level}"
              @click="selectSkill(skill)"
            >
              {{ skill.labels }}
            </div>
          </div>
          <div v-if="data.level&&(!isSkiSchool&&Number(data.level)>=1&&Number(data.level)<=2)" class="error-msg">
            {{ $t(`GEAR.EQUIPMENT_SECTION.${currentEnv}.SKILL_ERR_MSG`) }}
          </div>
        </div>

        <div class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold  text-base text-[#191919]">
          {{ $t(`GEAR.EQUIPMENT_SECTION.${currentEnv}.HEIGHT_WEIGHT_MSG`) }}
        </div>
        <div :key="renderId" class="flex justify-start mt-4 mb-10 mobiles:flex-col gap-4">
          <BaseDP
            :id="'height-dp'"
            :class-name="'dp-container'"
            :name="'height-dp'"
            :unit="$t('GEAR.CM')"
            :label-class="'dimension-label'"
            :wrapper-classes="'fixed-size'"
            :dp-options="heightList"
            :selected-place-holder="$t('GEAR.HEIGHT')"
            :show-unit="true"
            :is-error-exist="errors.height"
            :item-value="data.height"
            @item-selected="selectHeight($event)"
          />
          <BaseDP
            :id="'weight-dp'"
            :class-name="'dp-container'"
            :name="'weight-dp'"
            :wrapper-classes="'fixed-size'"
            :unit="$t('GEAR.KG')"
            :label-class="'dimension-label'"
            :dp-options="weightList"
            :selected-place-holder="$t('GEAR.WEIGHT')"
            :show-unit="true"
            :is-error-exist="errors.weight"
            :item-value="data.weight"
            @item-selected="selectWeight($event)"
          />
        </div>
      </template>
      <div v-if="data.gearCheckboxModel" class="devider-dashed my-8 md:my-10" />

      <div v-if="data.gearCheckboxModel" class="gears-items-container">
        <h3 class="title">
          {{ $t(`GEAR.GEAR_SECTION.${currentEnv}.TITLE`) }}
        </h3>
        <div class="sub-wrapper">
          <p>
            {{ $t(`GEAR.GEAR_SECTION.${currentEnv}.DESCRIPTION`) }}
          </p>
        </div>
        <div v-if="errors.gear" class="error-msg">
          {{ $t(`GEAR.ERROR_TITLE`) }}
        </div>
        <div :key="renderId" class="gears-items-list-wrapper">
          <div
            v-for="(gear, index) in metaData.gear"
            :key="index"
            class="product-card-container gear-item-card w-1/2"
            :class="{'disabled-gear':isDisabledGear(gear)}"
          >
            <span class="disabled-msg">

              {{
                $t(`GEAR.ERROR_SUB_TITLE`, {
                  selectedGear: gear.isLongJacket === 'long_jacket' || gear.uuid === 'jumpsuit' ? $t('GEAR.JACKET_TROUSER') : userType === 'junior' ? $t('GEAR.JUMPSUIT') : $t('GEAR.LONG_JACKET'),
                  gear: gear.title
                })
              }}
            </span>

            <div class="gear-wrapper">
              <div
                class="product-wrapper"
                :class="{
                  selected: isSelectGear(gear)
                }"
              >
                <div class="flex select-none" @click="selectGear(gear)">
                  <img
                    :src="gear.image"
                    alt="gear img"
                    title="gear img"
                    width="170"
                    height="170"
                    class="gear-img select-none z-1"
                  >
                </div>
                <div
                  v-if="gear.uuid!=='boots'" class="sizes-wrapper"
                  :class="{ active: isSelectGear(gear) }"
                >
                  <div class="sizes-container" :class="{'empty-size':isSelectGearSize(gear)&&formSubmitted}">
                    <div
                      v-for="(size, sizeIndex) in gear.size[userType]"
                      :key="sizeIndex"
                      class="size-item"
                      :class="{ active:isSelectSize(size,gear) }"
                      @click="selectSize(size,gear)"
                    >
                      {{ size.label }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="icon-wrapper" :class="{ selected: isSelectGear(gear) }" @click="selectGear(gear)">
                <Checkmark
                  width="16"
                  height="16"
                  :color="isSelectGear(gear)? 'white' : '#1A1A1A'"
                  class="check-icon"
                />
              </div>
            </div>
            <div
              class="mt-2 md:mt-4"
              :class="{
                'flex justify-between items-start flex-wrap gap-x-[14px]':
                  gear.id==='gr05',
              }"
            >
              <div
                class="flex gear-deatils"
                :class="
                  gear.id==='gr05'
                    ? 'flex-col gap-y-2'
                    : 'justify-between items-center'
                "
              >
                <div class="description" :class="{ selected: isSelectGear(gear)}">
                  {{ gear.title }}
                </div>
                <div
                  v-if="gear.size_chart&&Object.values(gear.size_chart).length"
                  class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-sm leading-4 text-dark-gray lg:hover:cursor-pointer"
                  @click="selectedGear=gear.id;showSizeModal=true;"
                >
                  {{ $t('GEAR.VIEW_SIZE_CHART') }}
                </div>
              </div>
              <SizesPopup
                v-if="gear.id===selectedGear"
                :title="gear.title"
                :size-list="gear.size_chart"
                :show-modal="showSizeModal"
                :gear="gear"
                :guest-type="userType"
                @close-modal="showSizeModal=false"
              />

              <div
                v-if="gear.id==='gr05'&&isSelectGear(gear)"
                class="flex-1 max-w-[127px] md:max-w-[152px]"
              >
                <BaseDP
                  :id="'size-type-dp'"
                  :class-name="'size-dp fixed-size'"
                  :name="'size-type-dp'"
                  :unit="$t('GEAR.EURO')"
                  :label-class="'size-label'"
                  :wrapper-classes="'fixed-size'"
                  :title-key="'size'"
                  :dp-options="getBootSize(gear)"
                  :selected-place-holder="''"
                  :show-unit="true"
                  :is-error-exist="errors.boot"
                  :error-message="$t('GEAR.SIZE')"
                  :item-value="data.boot||{}"
                  :ddl-input-classes="'px-4 py-4'"
                  @item-selected="selectSize($event,gear,true)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="$globalData.isMobileDevice" class="devider-dashed mobiles:mt-4" />

      <div class="flex justify-end mobiles:justify-center mobiles:mb-3 pt-3">
        <BaseButton
          :text="$t('COMMON.SAVE')"
          btn-type="button"
          :is-loading="isLoading"
          @onBtnClick="saveGear()"
        />
      </div>
    </div>
  </ValidationObserver>
</template>

<script>
import moment from "moment";
import {AppConfig} from "@/const/variable";
import Checkmark from "@/components/SVGElements/Checkmark";
import BaseDP from "@/components/Shared/BaseUI/BaseDP/index.vue";
import SizesPopup from "@/components/Shared/SizesPopup";
import BaseDate from "@/components/Shared/BaseUI/FormElements/BaseDate";

export default {
  components: {
    BaseDate,
    Checkmark,
    BaseDP,
    SizesPopup
  },
  props: {
    ticket: {
      type: Object,
      default: () => ({}),
    },
    gearData: {
      type: Object,
      default: () => ({}),
    },
    user: {
      type: Object,
      default: () => ({}),
    },
    metaData: {
      type: Object,
      default: () => ({})
    },
    userType: {
      type: String,
      default: () => ''
    },
    isUser: {
      type: Boolean,
      default: () => false
    },
    relatedTickets: {
      type: Array,
      default: () => []
    },
    isSkiSchool: {
      type: Boolean,
      default: () => false
    },
  },
  data() {
    return {
      equipmentCheckboxModel: false,
      showSizeModal: false,
      gearCheckboxModel: false,
      heightList: [],
      weightList: [],
      bootsLst: [
        {id: 1, name: "6", value: '6'},
        {id: 2, name: "7", value: '7'},
        {id: 3, name: "8", value: '8'},
        {id: 4, name: "9", value: '9'},
      ],
      renderId: Date.now(),
      isGuest: false,
      selectedGear: -1,
      data: {
        level: null,
        equipment_id: '',
        selectedGear: {},
        height: {},
        weight: {},
        boot: {},
        gear: [],
        selectedGearIds: [],
        equipmentCheckboxModel: true,
        gearCheckboxModel: true,
        date_of_birth: null,
        first_name: '',
        last_name: ''
      },
      formSubmitted: false,
      errors: {
        gear: false,
        equipment: false,
        level: false,
        checkbox: false,
        weight: false,
        height: false,
        boot: false,
        size: false
      },
      isLoading: false,
      dateRange: {min: 3, max: 5},
      currentEnv: '',
      isOmanEnv: false,
      isDubaiEnv: false
    };
  },
  watch: {
    gearData: function () {
      this.init()
    }
  },
  created() {
    this.currentEnv = this.$getSiteCurrentEnvironment(false, true);
    this.isDubaiEnv = this.currentEnv.toLowerCase().includes("dubai")
    this.isOmanEnv = this.currentEnv.toLowerCase().includes("oman")
  },
  mounted() {
    this.init()
  },
  methods: {
    /**
     * select User Equipment
     *
     * @param {Object} equipment selected equipment
     * @return void
     */
    selectEquipment(equipment) {
      this.data.equipment_id = equipment.id
      this.errors.equipment = false
      this.$forceUpdate()
    },
    /**
     * select User Skill
     *
     * @param {Object} skill selected skill
     * @return void
     */
    selectSkill(skill) {
      this.data.level = skill.id
      this.errors.level = false
    },
    /**
     * select User Height
     *
     * @param {Object} height selected user height from ddl
     * @return void
     */
    selectHeight(height) {
      this.data.height = height
      this.errors.height = false
    },
    /**
     * select User Weight
     *
     * @param {Object} weight selected user weight from ddl
     * @return void
     */
    selectWeight(weight) {
      this.data.weight = weight
      this.errors.weight = false
    },
    /**
     * select Size
     * select or unselect gear size
     * @param {Object} size selected size
     * @param {Object} gear selected gear to check size
     * @param {Object} isDDL to check is boot sizes
     * @return void
     */
    selectSize(size, gear, isDDL = false) {
      let index = this.data.gear.findIndex(item => (item.id === gear.id) || (item.gear_id === gear.id))
      if (index !== -1) {
        this.data.gear[index].gear_size = isDDL ? size.size : size.id ? size.id : size
      }
      if (isDDL) {
        this.data.boot = size
        this.errors.boot = false
      }
      this.renderId = Date.now()
      this.$forceUpdate()
    },
    /**
     * select Gear
     * select or unselect gear
     * @param {Object} gear selected gear
     * @return void
     */
    selectGear(gear) {
      let index = this.data.gear.findIndex(item => (item.id === gear.id) || (item.gear_id === gear.id))
      if (index !== -1) {
        this.data.gear.splice(index, 1)
      } else {
        this.data.gear.push(gear)
      }
      this.errors.gear = this.data.gear.length === 0

      this.renderId = Date.now()
      this.$forceUpdate()
    },
    /**
     * check if Gear selected
     * check if gear is selected or select new one
     * @param {Object} gear selected gear
     * @return boolean
     */
    isSelectGear(gear) {
      let index = this.data.gear.findIndex(item => (item.id === gear.id) || (item.gear_id === gear.id))
      return index !== -1 && !this.isDisabledGear(gear)
    },
    /**
     * isSelectSize
     * check if size selected
     * @param {Object} size selected size
     * @param {Object} gear selected gear
     * @return boolean
     */
    isSelectSize(size, gear) {
      let index = this.data.gear.findIndex(item => (item.id === gear.id) || (item.gear_id === gear.id))
      if (index !== -1) {
        return this.data.gear[index].gear_size === size.id
      }
      return false
    },
    /**
     * Save Gear
     * submit and validate choose item
     * @return void
     */
    async saveGear() {
      try {
        this.formSubmitted = true
        this.errors = {
          gear: false,
          equipment: false,
          level: false,
          checkbox: false,
          weight: false,
          height: false,
          size: false
        }
        this.$refs["add-gear"].validate().then(async (res) => {
          if (res) {
            this.isLoading = true

            if (this.data.equipmentCheckboxModel) {
              if (!this.data.equipment_id) {
                this.errors.equipment = true
              }
              if (!this.data.level || Number(this.data.level) === -1) {
                this.errors.level = true
              }
              if (!this.data.gear && this.data.gearCheckboxModel) {
                this.errors.gear = true
              }
              if (this.data.height && Object.keys(this.data.height).length === 0) {
                this.errors.height = true
              }
              if (this.data.weight && Object.keys(this.data.weight).length === 0) {
                this.errors.weight = true
              }
            }
            let isBoot = this.data.gear.findIndex(item => item.id === 'gr05' || item.gear_id === 'gr05')

            if (!this.data.boot && isBoot !== -1) {
              this.errors.boot = true
            } else {
              if (isBoot !== -1 && (this.data.boot && Object.keys(this.data.boot).length === 0)) {
                this.errors.boot = true
              }
            }


            if (this.data.gearCheckboxModel && this.data.gear.length === 0) {
              this.errors.gear = true
            }
            let gear = []
            if (this.data.gearCheckboxModel) {
              gear = this.data.gear.map(item => {
                if (!item.gear_size) {
                  this.errors.size = true
                } else {
                  return {
                    "id": item.id || item.gear_id,
                    "size": item.gear_size.toString()
                  }
                }
              })
            }

            if (Object.values(this.errors).find(item => item)) {
              this.isLoading = false
              return;
            }

            let request = {
              "user_id": this.user ? this.user.id : null,
              "equipment_id": this.data.equipmentCheckboxModel ? this.data.equipment_id : null,
              "level": this.data.level,
              "height": this.data.height ? this.data.height.id : null,
              "weight": this.data.weight ? this.data.weight.id : null,
              "ticket_id": this.ticket.id,
              "ski_or_snowboard": this.data.equipment_id === 'eq01' ? 1 : 2,
              "sp_orientation": this.data.equipment_id === 'eq02' ? 1 : this.data.equipment_id === 'eq03' ? 2 : -1,
              "gear": this.data.gearCheckboxModel ? gear : [],
              "first_name": this.data.first_name,
              "last_name": this.data.last_name,
              'date_of_birth': this.data.date_of_birth,
              'is_sub_guest': this.isGuest,
              'guest_type_id': this.isGuest ? this.ticket.guest_types[0] ? this.ticket.guest_types[0].id : null : null
            }
            let response = await this.$repositories.saveGearApi(request)

            if (response) {
              for (let i = 0; i < this.relatedTickets.length; i++) {
                let relatedRequest = request
                relatedRequest.ticket_id = this.relatedTickets[i].id
                await this.$repositories.saveGearApi(relatedRequest)
              }
              this.data = {
                level: null,
                equipment_id: '',
                selectedGear: {},
                height: {},
                weight: {},
                boot: {},
                gear: [],
                selectedGearIds: [],
                equipmentCheckboxModel: true,
                gearCheckboxModel: true,
                date_of_birth: null,
                first_name: '',
                last_name: ''
              }
              this.$emit('saveGear')
            } else
              this.$showToast({
                type: "red",
                text: "An error occurred, please try again.",
              });

            this.isLoading = false;
          }
        })
      } catch (e) {
        this.isLoading = false;
        this.$showToast({
          type: "red",
          text: "An error occurred, please try again.",
        });
        console.log(e)
      }
    },
    /**
     * init
     * mapping gears and equipments items from saved user gear
     * @return void
     */
    init() {
      this.isGuest = !this.$isUserAuthenticated()
      this.heightList = this.metaData.height_meta
      this.weightList = this.metaData.weight_meta
      switch (this.userType) {
        case 'adult':
          this.dateRange = {min: 14};
          break;
        case 'junior':
          this.dateRange = {min: 7, max: 14};
          break;
        case 'child':
          this.dateRange = {min: this.isOmanEnv ? 2 : 3, max: 6};// TODO: Get back here to get these values from the ticket itself.
          break;
      }

      if (this.gearData && Object.keys(this.gearData).length > 0) {
        this.data = Object.assign({}, this.data, this.gearData)

        this.data.gear = this.gearData.GearItems.filter(item => item.gear_id !== null && item.gear_size !== null)
        this.data.equipmentCheckboxModel = this.isDubaiEnv && ((this.data.equipment_id && this.data.equipment_id.length > 0) || this.isUser || this.ticket.need_gear && !this.isGuest)
        this.data.gearCheckboxModel = this.data.gear.length > 0 || !this.ticket.need_gear || true

        if (this.data.height && Object.keys(this.data.height).length) {
          this.data.height = this.heightList.find(item => item.id.toString() === this.data.height.toString())
        } else {
          this.data.height = {}
        }
        if (this.data.weight && Object.keys(this.data.weight).length) {
          this.data.weight = this.weightList.find(item => item.id.toString() === this.data.weight.toString())
        } else {
          this.data.weight = {}
        }

        let bootIndex = this.data.gear.findIndex(item => item.gear_id === 'gr05')
        if (bootIndex !== -1) {
          let boots = this.metaData.gear.find(item => item.uuid === 'boots')
          let selectedBoot = boots.size_chart[this.userType].find(item => item.us.toString() === this.data.gear[bootIndex].gear_size.toString() || item.size.toString() === this.data.gear[bootIndex].gear_size.toString())
          this.data.boot = selectedBoot || {}
        } else {
          this.data.boot = {}
        }
      } else {
        this.data.weight = {}
        this.data.height = {}
      }
    },
    /**
     * Select Date
     * Get Selected Data on Guest Flow
     * @return void
     */
    selectDate({selectedDate}) {
      this.data = Object.assign({}, this.data, {date_of_birth: moment(selectedDate.toString()).format(AppConfig.dateFormat)})
      this.$forceUpdate()
    },
    /**
     * Check if there any gear constraints
     * @description long_jacket can't be selected when selected long jacket or  trousers
     * @return boolean
     */
    isDisabledGear(gear) {
      let longJacketId = this.userType !== 'junior' ? 'gr01' : 'gr02'
      let jacketId = 'gr04'
      let trousersId = 'gr03'

      if (this.userType === 'adult' || this.userType === 'junior') {
        if (gear.isLongJacket === 'long_jacket' || gear.uuid === 'jumpsuit') {
          let selectedGears = this.data.gear.filter(item => ((item.id === jacketId) || (item.gear_id === jacketId)) || (item.id === trousersId) || (item.gear_id === trousersId))
          if (selectedGears.length > 0) {
            return true
          }
        } else if (gear.uuid === 'jacket' || gear.uuid === 'trousers') {
          let selectedGears = this.data.gear.filter(item => item.id === longJacketId.toString() || item.gear_id === longJacketId.toString())
          if (selectedGears.length > 0) {
            return true
          }
        }
      }
      return false
    },
    /**
     * isSelectGearSize
     * Check if gear selected with out any size
     * @return boolean
     */
    isSelectGearSize(gear) {
      let index = this.data.gear.findIndex(item => (item.id === gear.id) || (item.gear_id === gear.id))
      if (index !== -1) {
        return !this.data.gear[index].gear_size
      }
    },
    /**
     * return boots ddl sizes based on gender
     * @return Object
     */
    getBootSize(gear) {
      let userGender = this.user.gender ? this.user.gender.toLowerCase() : 'male'
      return gear.size_chart[this.userType].filter(item => item.gender === userGender)
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./GearForm.scss";
</style>
