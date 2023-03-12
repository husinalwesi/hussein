<template>
  <div class="card-item-body">
    <ValidationObserver ref="waiver-form" v-slot="{ invalid }">
      <section>
        <div class="section-title">
          {{ $t('WAIVER.FORM.EMERGENCY_CONTACT') }}
        </div>
        <BaseInput
          v-model="selectedWaiver.emergency_contact_name"
          i-n-ptype="text"
          i-n-pname="fullName"
          :i-n-pplaceholder="$t('WAIVER.FORM.FULL_NAME')"
          :classes="['bg-white']"
          :rules="{required: true,alpha_spaces: true,max:50}"
        />
        <div class="flex-1 mt-4">
          <MobileInput
            :mobile="mobileDetails"
            @setCompleteMobileNumber="setCompleteMobileNumber"
            @updateMobileDetails="updateMobileDetails($event)"
          />
        </div>
        <div
          v-if="user.age>=18&&showApplyAll"
          class="mt-4 flex justify-end mobiles:justify-start"
        >
          <BaseCheckbox
            :id="'guestCheckbox'"
            v-model="applyToAllGuest"
            :label="$t('WAIVER.FORM.APPLY_TO_ALL_GUESTS')"
          />
        </div>
        <div class="section-border mt-10" />
      </section>
      <section>
        <div class="section-title">
          {{ $t('WAIVER.FORM.SKILL_LEVEL') }}
        </div>
        <div class="mt-4 flex flex-col">
          <BaseRadio
            v-for="(skill,skillIndex) in skillList"
            :key="skillIndex"
            v-model="selectedWaiver.skill_level"
            :vid="`skillCheckbox-${skillIndex}`"
            :attr-val="skill.value"
            :r-b-i-oname="`skillCheckbox`"
            :rules="{ required: true }"
            :r-b-i-olabel="skill.label"
            :r-b-i-oid="`skillCheckbox-${skillIndex}`"
            :label-class="'ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-[0.875rem] leading-4 text-[#1A1A1A] flex items-center pb-4'"
            :show-error="skill.valid===false"
            @input="skillChanged($event)"
          />
        </div>
        <div v-if="showSkillErrorMessage" class="error-msg mb-[2.5rem] mt-[0.5rem]">
          {{ $t('WAIVER.FORM.SKILL_LEVEL_ERROR') }}
          <span dir="ltr">{{ $t('WAIVER.FORM.SUPPORT_NUMBER') }}</span>
        </div>
      </section>
      <div class="section-border mt-6" />
      <section>
        <div class="requirement-title">
          {{ $t('WAIVER.FORM.REQUIREMENT.TITLE') }}
        </div>
        <div
          v-for="(requirement,requirementIndex) in requirementList"
          :key="requirementIndex"
          class="flex flex-col mt-[16px]"
        >
          <div class="flex items-center">
            <div class="requirement-badge flex justify-between">
              <Checkmark
                class="check-icon"
                :color="'#1A1A1A'"
                :width="'15'"
                :height="'12'"
              />
            </div>
            <span class="badge-title">{{ requirement.title }}</span>
          </div>
          <div class="badge-subtitle">
            {{ requirement.subtitle }}
          </div>
        </div>
        <div :key="selectedWaiver.minimum_requirements" class="flex justify-start mt-4">
          <BaseButton
            :class-name="`requirement-btn ${selectedWaiver.minimum_requirements?'active':''}`"
            :text="$t('WAIVER.FORM.REQUIREMENT.YES')" btn-type="button"
            @onBtnClick="setMinimumRequirement(true)"
          />
          <BaseButton
            :class-name="`requirement-btn ${!selectedWaiver.minimum_requirements?'active':''}`"
            btn-type="button"
            :text="$t('WAIVER.FORM.REQUIREMENT.NO')"
            @onBtnClick="setMinimumRequirement(false)"
          />
        </div>
        <div v-if="selectedWaiver.minimum_requirements===false" class="error-msg mt-4">
          {{ $t('WAIVER.FORM.REQUIREMENT.ERROR_MSG') }}
          <span dir="ltr">{{ $t('WAIVER.FORM.SUPPORT_NUMBER') }}</span>
        </div>
      </section>
      <div class="section-border mt-10" />
      <section class="sign-section">
        <template>
          <div class="section-title">
            {{ $t('WAIVER.FORM.SIGN_DOCUMENT') }}
          </div>
          <div
            v-if="!selectedWaiver.sign_value"
            :class="{error:errors.mainSign}"
            class="adult-signiture lg-width relative hover:cursor-pointer justify-center flex gap-1"
            @click="showSignModal=true"
          >
            <img class="signiture-img" src="~assets/images/gear/ic_sign.png">
            <div> {{ $t('WAIVER.FORM.SIGNATURE_HERE') }}</div>
          </div>
          <div
            v-else
            :key="selectedWaiver.sign_value"
            class="adult-signiture"
            @click="openSignModal(false)"
          >
            <img
              :src="selectedWaiver.sign_value" alt="user signature" title="user signature"
              class="w-fit h-full"
            >
          </div>
        </template>

        <template v-if="user.age?user.age<18:checkUserAge(user)<18">
          <div
            v-if="!selectedWaiver.showNewGuardin" class="flex justify-start mt-4 relative items-center"
            :class="{error:errors.guardianInfo}"
          >
            <template>
              <span class="ltr:mr-2 rtl:ml-2 guardian-text">
                <span v-if="!selectedWaiver.guardian_name">{{ $t('WAIVER.FORM.GUARDIAN_TO_ALL') }}</span>
                <span
                  v-if="selectedWaiver.guardian_name&&!selectedWaiver.showNewGuardin"
                >{{
                  selectedWaiver.guardian_name
                }}</span>
              </span>
              <arrow-svg
                :with-wrapper="true" width="16"
                height="16"
                :wrapper-class="'w-8 h-8 bg-[#ECECEC] open-drop-list'"
                arrow-color="#1A1A1A"
                :direction="`${openGuardianMenu?'up':'down'}`"
                @onArrowClick="openGuardianMenu=!openGuardianMenu"
              />
              <ul
                :id="'list-1'"
                class="absolute guest-drop-down bg-white  pt-2 z-20"
                :class="{'hidden':!openGuardianMenu}"
              >
                <template v-for="user in userList">
                  <li
                    v-if="user.age?user.age>=18:checkUserAge(user)>=18"
                    :key="user.id"
                    class="list-item"
                    @click="selectGuardian(user,selectedWaiver)"
                  >
                    <span class="px-4">{{ user.fullName || user.name }}</span>
                  </li>
                </template>

                <li class="add-new">
                  <div class="flex justify-end mt-4">
                    <BaseButton
                      :class-name="'menu-btn'"
                      :text="$t('WAIVER.FORM.ADD_GUARDIAN_TEXT')" btn-type="button"
                      @onBtnClick="newGuardian()"
                    />
                  </div>
                </li>
              </ul>
            </template>
          </div>
          <div
            v-if="selectedWaiver.showNewGuardin||(selectedWaiver.guardian_name&&!selectedWaiver.guardian_id)"
            :key="selectedWaiver.showNewGuardin"
          >
            <div class="mt-4">
              <BaseAccordion
                :accordion-title="$t('WAIVER.FORM.ADD_GUARDIAN',{name:selectedWaiver.guardian_name?selectedWaiver.guardian_name:$t('WAIVER.FORM.ADD_GUARDIAN_TEXT')})"
                :title-class-name="'ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold  text-[1rem] leading-6 text-[#191919]'"
                :show-section="false"
                :class-name="'guardian-card'"
                :arrow-class-name="'items-center wavier-arrow-continer grey-arrow mobiles:top-[-1.5rem]  mobiles:ltr:right-[-12rem] mobiles:rtl:left-[-12rem]'"
                :arrow-color="'black'"
                arrow-wrapper-color="bg-[#ECECEC]"
                @accordion-expand="guardianExpand"
              >
                <template #accordion-content>
                  <div v-if="guardianExpanded" class="card-item-body">
                    <div class="mt-4">
                      <BaseInput
                        v-model="selectedWaiver.guardian_name"
                        i-n-ptype="text"
                        i-n-pname="guardianName"
                        :i-n-pplaceholder="$t('WAIVER.FORM.GUARDIAN_NAME')"
                        :classes="['bg-white']"
                        :rules="{required: true,max: 50,alpha:false}"
                      />
                    </div>
                    <div class="mt-4">
                      <BaseDate
                        :placeholder="$t('CREDENTIALS_FORM.DD_MM_YYYY')"
                        :show-input-title="false"
                        :date="selectedWaiver.guardian_birthday"
                        :extra-rules="{dateOfBirthValidity:{date:18}}"
                        :is-date-picker-old-days-disabled="false"
                        @selectDate="selectDate"
                      />
                    </div>
                    <div :key="selectedWaiver.guardian_sign_value" class="mt-4">
                      <div
                        v-if="!selectedWaiver.guardian_sign_value"
                        :class="{error:errors.guardianSign}"
                        class="adult-signiture lg-width relative hover:cursor-pointer justify-center flex gap-1 mt-4"
                        @click="openSignModal(true)"
                      >
                        <img class="signiture-img" src="~assets/images/gear/ic_sign.png">
                        <div>{{ $t('WAIVER.FORM.SIGNATURE_HERE') }}</div>
                      </div>
                      <div
                        v-if="selectedWaiver.guardian_sign_value"
                        class="adult-signiture relative mt-4 mb-2 hover:cursor-pointer w-full h-full"
                        @click="openSignModal(true)"
                      >
                        <img
                          class="w-full h-full"
                          :src="selectedWaiver.guardian_sign_value"
                        >
                      </div>
                    </div>
                  </div>
                </template>
              </BaseAccordion>
            </div>
          </div>
        </template>

        <div v-if="user.age>=18&&showApplyAll" class="mb-4 text-dark-gray mt-4">
          <BaseCheckbox
            :id="'GuardianallCheckbox'"
            v-model="applyToAllGuardian"
            classes="text-dark-gray"
            :label="$t('WAIVER.FORM.GUARDIAN_CONFIRM')"
          />
        </div>
        <div class="agreement-description mt-4">
          {{ $t('WAIVER.FORM.TERMS_AND_CONDITIONS.TITLE') }} <span
            class="underline cursor-pointer"
            @click="isTermsConditionsModalActive=true"
          >{{ $t('WAIVER.FORM.TERMS_AND_CONDITIONS.UNDER_LINE') }}</span>,
          {{ $t('WAIVER.FORM.TERMS_AND_CONDITIONS.TEXT') }}
        </div>
        <div class="section-border mt-5" />
        <div class="flex justify-end mobiles:justify-center mt-6">
          <BaseButton
            class="whitespace-nowrap"
            :is-loading="isSubmitLoading"
            :b-t-ndisabled="invalid"
            :text="$t('WAIVER.FORM.SAVE_BTN')" btn-type="button"
            @onBtnClick="submit()"
          />
        </div>
      </section>
    </ValidationObserver>
    <TermsConditionsModal
      :show-modal="isTermsConditionsModalActive"
      @closeModal="isTermsConditionsModalActive = false"
    />
    <BaseModal
      :classes="[`max-w-[40rem] mobiles:max-w-[343px]`]" :show-close-icon="false" :show-modal="showRequirementModal"
      @close-modal="showRequirementModal=false"
    >
      <template slot="header">
        <div class="modal-title">
          {{ user.name }}
        </div>
        <div class="mt-2 modal-subtitle">
          {{ $t('WAIVER.FORM.MINIMUM_ERROR_MODAL.MODAL_TITLE') }}
        </div>
      </template>
      <template slot="content">
        <div class="requirement-inner-title" v-html=" $t('WAIVER.FORM.MINIMUM_ERROR_MODAL.TITLE')" />
        <div class="requirement-subtitle" v-html="$t('WAIVER.FORM.MINIMUM_ERROR_MODAL.SUB_TITLE')" />
        <div class="mt-6 requirement-inner-title" dir="ltr">
          {{ $t('WAIVER.FORM.MINIMUM_ERROR_MODAL.MOBILE') }}
        </div>
        <div class="flex justify-center mt-10">
          <BaseButton
            :class-name="'skip-btn uppercase'"
            :text="$t('WAIVER.FORM.SKIP_FOR_NOW')" btn-type="button"
            @onBtnClick="showRequirementModal=false"
          />
        </div>
      </template>
    </BaseModal>
    <BaseModal
      :classes="[!signed?`max-w-[40rem] mobiles:max-w-[343px]`:`sm mobiles:max-w-[343px]`]"
      :show-close-icon="false" :show-modal="showSignModal"
      @closeModal="showSignModal=false;signed=false"
    >
      <template slot="header">
        <div v-if="!signed" class="sign-title">
          {{ $t('WAIVER.FORM.SIGN_DOCUMENT') }}
        </div>
        <div v-else class="complete-sign-title">
          {{ $t('WAIVER.FORM.DOCUMENT_SIGNED') }}
        </div>
        <div v-if="!signed" class="flex justify-end mt-1">
          <BaseButton
            :class-name="'accept-btn ltr:mr-[0.5rem] rtl:ml-[0.5rem]'"
            :text="$t('WAIVER.FORM.UNDO')" btn-type="button"
            @onBtnClick="undoClearSignature(1)"
          />
          <BaseButton
            :class-name="'accept-btn'"
            :text="$t('WAIVER.FORM.CLEAR')" btn-type="button"
            @onBtnClick="undoClearSignature(2)"
          />
        </div>
      </template>
      <template slot="content">
        <div>
          <VueSignaturePad
            v-if="!signed"
            ref="signaturePad" :width="!$globalData.isMobileDevice?'678px':'300px'" height="217px"
            :custom-style="signatureStyle"
          />
          <div
            v-else
            class="text-[14px] ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-dark-gray text-center"
          >
            {{ $t('WAIVER.FORM.SIGNED_MSG') }}
          </div>
          <div v-if="!signed" class="flex justify-end mt-10">
            <BaseButton
              :class-name="'sign-second-btn ltr:mr-[0.5rem] rtl:ml-[0.5rem]'"
              :text="$t('WAIVER.FORM.SIGN_LATER')" btn-type="button"
              @onBtnClick="showSignModal=false;signed=false;"
            />
            <BaseButton
              class-name="sign-btn"
              :text="$t('COMMON.CONTINUE')" btn-type="button"
              @onBtnClick="signSaved()"
            />
          </div>
          <div v-else class="flex justify-center mt-8">
            <BaseButton
              class-name="sign-btn"
              :text="$t('COMMON.CONTINUE')"
              btn-type="button"
              @onBtnClick="showSignModal=false;signed=false"
            />
          </div>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script>
import Vue from "vue";
import VueSignaturePad from 'vue-signature-pad';
import BaseDate from "@/components/Shared/BaseUI/FormElements/BaseDate";
import BaseAccordion from "@/components/Shared/BaseUI/BaseAccordion/index.vue"
import MobileInput from "@/components/Shared/BaseUI/FormElements/MobileInput/index.vue";
import TermsConditionsModal
  from "@/components/BookingFlow/PersonalDetails/UserCredentials/Guest/Modals/TermsConditionsModal.vue";
import Checkmark from "@/components/SVGElements/Checkmark";
import BaseInput from "@/components/Shared/BaseUI/FormElements/BaseInput/index.vue";
import BaseCheckbox from "@/components/Shared/BaseUI/FormElements/BaseCheckbox/index.vue";

Vue.use(VueSignaturePad);


export default {
  name: "WaiverForm",
  components: {
    BaseDate,
    BaseAccordion,
    MobileInput,
    TermsConditionsModal,
    BaseCheckbox,
    Checkmark,
    BaseInput
  },
  props: {
    user: {
      type: Object,
      default: () => {
      }
    },
    userMobile: {
      type: Object,
      default: () => ({
        regionCode: "ae",
        countryCode: "+971",
        significantMobileNumber: "",
      })
    },
    waiverData: {
      type: Object,
      default: () => {
      }
    },
    userList: {
      type: Array,
      default: () => []
    },
    isUsersWaiver: {
      type: Boolean,
      default: () => false
    },
    showApplyAll: {
      type: Boolean,
      default: () => true
    },
    relatedTickets: {
      type: Array,
      default: () => []
    },
    waiverMeta: {
      type: Object,
      default: () => {
      }
    }
  },
  emits: ['submit'],
  data() {
    return {
      selectedWaiver: {},
      applyToAllGuest: false,
      guardianExpanded: false,
      showSkillErrorMessage: false,
      showSignModal: false,
      isSubmitLoading: false,
      isGuardianModal: false,
      isTermsConditionsModalActive: false,
      showRequirementModal: false,
      openGuardianMenu: false,
      applyToAllGuardian: false,
      signed: false,
      mobileDetails: {
        regionCode: "ae",
        countryCode: "+971",
        significantMobileNumber: "",
      },
      signatureStyle: {
        'background': 'rgba(3, 128, 194, 0.1)',
        'border': '1px solid #0380C2',
        'box-sizing': 'border-box',
        'border-radius': '8px',
      },
      skillList: [],
      requirementList: [],
      errors: {
        mainSign: false,
        guardianSign: false,
        guardianInfo: false,
        level: false

      }
    }
  },
  computed: {
    signitureEmpty() {
      return this.$refs.signaturePad;
    }
  },
  mounted() {
    this.skillList = this.waiverMeta.skillList
    this.requirementList = this.waiverMeta.requirementList
    this.selectedWaiver = this.waiverData
    this.mobileDetails = this.waiverData.mobileDetails
  },
  methods: {
    updateMobileDetails(e) {
      this.mobileDetails.regionCode = e.regionCode;
      this.mobileDetails.countryCode = e.countryCode;
      // this.selectedWaiver.mobileDetails.significantMobileNumber = e.significantMobileNumber
      this.setCompleteMobileNumber();
    },
    setCompleteMobileNumber() {
      this.selectedWaiver.mobile =
        `${this.mobileDetails.countryCode}${this.mobileDetails.significantMobileNumber}`.replace(
          /\s/g,
          ""
        );
    },
    guardianExpand(event) {
      this.guardianExpanded = event;
    },
    setMinimumRequirement(value) {
      this.selectedWaiver.minimum_requirements = value
    },
    selectGuardian(user, item) {
      this.selectedWaiver.guardian_id = user.id
      this.selectedWaiver.guardian_name = user.fullName || user.name
      this.selectedWaiver.guardian_birthday = user.date_of_birth || user.dateOfBirth
      if ((user.waivers || []).length)
        this.selectedWaiver.guardian_sign_value = user.waivers[0].sign_value

      this.openGuardianMenu = false
    },
    selectDate(event) {
      this.selectedWaiver.guardian_birthday = event.fullDate;
    },
    openSignModal(isGuardian = false) {
      this.showSignModal = true
      this.isGuardianModal = isGuardian
    },
    async submit() {

      if (this.showSkillErrorMessage) {
        this.showRequirementModal = true
        return;
      }
      this.errors = {
        mainSign: false,
        guardianSign: false,
        guardianInfo: false,
        minimumRequirements: false
      }
      this.$refs["waiver-form"].validate().then(async (res) => {
        if (res) {
          if (!this.selectedWaiver.sign_value) {
            this.errors.mainSign = true
            return;
          }
          if (this.user.age < 18) {
            if (!this.selectedWaiver.guardian_name || (this.selectedWaiver.guardian_name ? this.selectedWaiver.guardian_name : "").length === 0) {
              this.errors.guardianInfo = true
              return;
            }
            if (this.selectedWaiver.showNewGuardin)
              if (!this.selectedWaiver.guardian_sign_value || !this.selectedWaiver.guardian_name) {
                this.errors.guardianSign = true
                return;
              }
          }

          if (!this.user.parent_user_id && this.applyToAllGuest) {
            this.defaultEmergencyContact = {
              mobile: this.mobileDetails,
              emergency_contact_name: this.selectedWaiver.emergency_contact_name,
            }
          }

          if (!this.selectedWaiver.minimum_requirements) {
            this.errors.minimumRequirements = true
            return;
          }

          this.isSubmitLoading = true

          if (!this.selectedWaiver.mobile) {
            this.setCompleteMobileNumber()
          }

          let request = {
            'id': this.selectedWaiver.id || null,
            "emergency_contact_name": this.selectedWaiver.emergency_contact_name,
            "emergency_contact_phone": this.selectedWaiver.mobile,
            "minimum_requirements": this.selectedWaiver.minimum_requirements,
            "skill_level": this.selectedWaiver.skill_level,
            "guardian_sign_value": this.user.age >= 18 ? '' : this.selectedWaiver.guardian_sign_value,
            "sign_value": this.selectedWaiver.sign_value,
            "guardian_id": this.user.age >= 18 ? null : this.selectedWaiver.guardian_id,
            "guardian_name": this.user.age >= 18 ? '' : this.selectedWaiver.guardian_name,
            "guardian_birthday": this.user.age >= 18 ? null : !this.selectedWaiver.guardian_birthday ? null : this.selectedWaiver.guardian_birthday.length === 0 ? null : this.selectedWaiver.guardian_birthday,
            "user_id": this.selectedWaiver.user_id,
            "ticket_id": this.selectedWaiver.ticket_id,
            "order_id": this.selectedWaiver.order_id,
            "booking_id": this.selectedWaiver.reservation_code,
            status: 'approved'
          }
          let result = await this.$repositories.saveWaiver(request)
          if (result) {

            for (let i = 0; i < this.relatedTickets.length; i++) {
              let relatedRequest = request
              relatedRequest.ticket_id = this.relatedTickets[i].id
              await this.$repositories.saveWaiver(relatedRequest)
            }


            if (this.applyToAllGuest || this.applyToAllGuardian) {

              request.order_id = request.order_id ? request.order_id.toString() : ''
              request.apply_to_all_guests_emergency = this.applyToAllGuest;
              request.apply_to_all_guardian = this.applyToAllGuardian;
              request.user = {}
              request.user_id = this.user.parent_user_id ? this.user.parent_user_id : this.user.id
              request.user.id = this.selectedWaiver.user_id
              request.user.name = this.user.name || this.user.fullName || (this.user.first_name + ' ' + this.user.last_name)
              request.user.birthday = this.user.date_of_birth
              // request.emergency_contact_phone = request.emergency_contact_phone

              // if (!this.isUsersWaiver)
              await this.$repositories.applyInfo(request)
            }


            this.$emit('submit', {
              applyToAll: this.applyToAllGuest,
              data: {
                mobile: this.mobileDetails,
                emergency_contact_name: this.selectedWaiver.emergency_contact_name,
              },
              applyToAllGuardian: this.applyToAllGuardian,
              guardianData: Object.assign({}, this.user, this.selectedWaiver)
            })
            // this.showRequirementModal = true
            this.selectedWaiver = {}
          }
          this.isSubmitLoading = false
        }
      });
    },
    signSaved() {
      if (this.isGuardianModal) {
        this.selectedWaiver.guardian_sign_value = this.$refs.signaturePad.saveSignature().data
      } else {
        this.selectedWaiver.sign_value = this.$refs.signaturePad.saveSignature().data
      }

      // this.showSignModal = false
      this.isGuardianModal = false
      this.signed = true
      this.$forceUpdate()
    },
    undoClearSignature(type) {
      if (type === 1) {
        this.$refs.signaturePad.undoSignature();
      } else if (type === 2) {
        this.$refs.signaturePad.clearSignature();
      }
    },
    skillChanged() {
      if (this.selectedWaiver.skill_level.toString() === "1") {
        this.showSkillErrorMessage = true
      } else {
        this.showSkillErrorMessage = false
      }
    },
    newGuardian() {
      this.selectedWaiver.showNewGuardin = true
      this.selectedWaiver.guardian_id = null
      this.selectedWaiver.guardian_name = null
      this.selectedWaiver.guardian_birthday = null
      this.selectedWaiver.guardian_sign_value = null
      this.openGuardianMenu = false
      this.$forceUpdate()
    },
    checkUserAge(user) {
      let dateString = user.dateOfBirth
      var today = new Date();
      var birthDate = new Date(dateString);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
  },
}
</script>

<style scoped lang="scss">
@import "waiver.scss";

.error {
  border: 1px red dashed !important;
}
</style>
