<template>
  <div>
    <ValidationObserver ref="guest-form-observer" v-slot="{ invalid }">
      <CredentialsForm
        :form-data="formData"
        :invalid="invalid"
        :show-title-selector="true"
        @selectCountry="selectCountry"
        @setCompleteMobileNumber="setCompleteMobileNumber"
        @updateMobileDetails="updateMobileDetails"
      >
        <div
          v-if="((guestDataObject || {}).check_boxes || []).length" slot="extraFields"
          class="mt-6 min-550:mt-8 min-550:mb-2"
        >
          <BaseCheckbox
            v-for="(checkbox, idx) in guestDataObject.check_boxes"
            :id="'check-box-' + idx"
            :key="'check-box-' + idx"
            v-model="formData.checkboxes[idx]"
            :i-n-pname="guestDataObject.check_boxes[idx].popup_link_label"
            :label="guestDataObject.check_boxes[idx].label"
            :underlined-text="guestDataObject.check_boxes[idx].popup_link_label"
            :rules="{checkboxReq: true}"
            @onUnderlineTextClick="setActiveModalData(checkbox)"
          />
        </div>
      </CredentialsForm>
    </ValidationObserver>

    <BookingInformationModal
      :show-modal="activeModalData.typeId === modalsTypesIds.BOOKING_MODAL"
      :data="activeModalData"
      @closeModal="activeModalData.typeId = -1"
    />
    <TermsConditionsModal
      :show-modal="activeModalData.typeId === modalsTypesIds.TERMS_CONDITIONS_MODAL"
      :data="activeModalData"
      @closeModal="activeModalData.typeId = -1"
    />
  </div>
</template>

<script>
import CredentialsForm from "@/components/Shared/CredentialsForm";
import BookingInformationModal from "./Modals/BookingInformationModal.vue";
import TermsConditionsModal from "./Modals/TermsConditionsModal.vue";

import {lookups} from "@/const/enum";
import {mapGetters} from "vuex";

export default {
  components: {
    CredentialsForm,
    BookingInformationModal,
    TermsConditionsModal
  },
  props: {
    guestDataObject: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      guestFormObserver: null,
      formData: {
        firstName: "",
        lastName: "",
        mobileDetails: {
          regionCode: "ae",
          countryCode: "+971",
          significantMobileNumber: "",
        },
        mobile: "",
        email: "",
        country_of_residence: "",
        countryName: "",
        title: "",
        checkboxes: []
      },
      activeModalData: {
        typeId: -1,
        title: '',
        highlitedNotes: '',
        notes: []
      },
      modalsTypesIds: {...lookups.GUEST_BOOKING_FORM_MODALS_TYPES}
    };
  },
  computed: {
    ...mapGetters("bookingFlow", ["guestInformation"])
  },
  mounted() {
    this.guestFormObserver = this.$refs["guest-form-observer"];

    if (this.guestInformation) {
      this.formData = {
        ...this.guestInformation,
        mobileDetails: {...this.guestInformation.mobileDetails},
        checkboxes: [...this.guestInformation.checkboxes]
      };

      this.$nextTick(() => {
        this.checkGuestFormValidity();
      });
    } else {
      const {iso2, dialCode} = this.$getSiteConfig("countryDetails");
      this.formData.mobileDetails = {
        regionCode: iso2,
        countryCode: dialCode,
        significantMobileNumber: ""
      };
    }

    this.$root.$on("validatePersonalDetailsGuestForm", () => {
      this.guestFormObserver.validate().then((status) => {
        let bookingData = this.$store.getters['bookingFlow/bookingData']
        let items = this.$repositories.getBookingGtmItems(bookingData)
        let purchaseCategory = []

        bookingData.map(card => {
          let cardType = this.$repositories.getCardType(card.cardType)
          if (!purchaseCategory.includes(cardType)) {
            purchaseCategory.push(cardType)
          }
        })

        if (status) {
          this.$repositories.addUserInfoEvent(purchaseCategory, items)

          this.$store.dispatch("bookingFlow/saveGuestInformation", {
            ...this.formData,
            mobileDetails: {...this.formData.mobileDetails},
            checkboxes: [...this.formData.checkboxes]
          });
        }
      });
    });
  },
  methods: {
    selectCountry(country) {
      this.formData.country_of_residence = country.iso3;
      this.formData.countryName = country.name;
    },
    setCompleteMobileNumber() {
      this.formData.mobile = `${this.formData.mobileDetails.countryCode}${this.formData.mobileDetails.significantMobileNumber}`.replace(/\s/g, "");
    },
    updateMobileDetails(e) {
      this.formData.mobileDetails.regionCode = e.regionCode;
      this.formData.mobileDetails.countryCode = e.countryCode;
      this.setCompleteMobileNumber();
    },
    setActiveModalData(selectedCheckboxData) {
      this.activeModalData = {
        typeId: +selectedCheckboxData.type_id,
        title: selectedCheckboxData.popup_title,
        highlitedNotes: selectedCheckboxData.notes_highlighted,
        notes: selectedCheckboxData.notes
      };
    },
    checkGuestFormValidity() {
      this.guestFormObserver.validate({silent: true}).then((status) => {
        const isEmpty = () => {
          for (var key in this.formData) {
            if (this.formData[key] === null || this.formData[key] === "")
              return true;
          }

          return false;
        };

        if (status && !isEmpty()) {
          this.$store.dispatch("bookingFlow/saveGuestFormValidtyStatus", true);
        } else this.$store.dispatch("bookingFlow/saveGuestFormValidtyStatus", false);
      });
    }
  }
};
</script>
