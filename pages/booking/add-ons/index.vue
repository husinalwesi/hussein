<template>
  <CardContainer>
    <template #card-content>
      <div id="add-ons">
        <div v-if="isLoading || isFullPageLoaderEnabled" class="py-8">
          <div class="loader-container">
            <CircleLoader />
          </div>
        </div>
        <template
          v-if="!$isEmptyObject(addOnsData.supervision) && isSupervisionEnabled"
        >
          <p v-if="labels.supervision.title" class="title">
            {{ labels.supervision.title }}
          </p>
          <p v-if="labels.supervision.subTitle" class="sub-title mt-4 lg:mt-6">
            {{ labels.supervision.subTitle }}
          </p>
          <div class="px-4 lg:px-8 mt-4">
            <ul class="addons-ul">
              <li>
                <AddOnsItem
                  id="add-ons-counter-supervision"
                  :data="addOnsData.supervision"
                  :package-details="packageDetails"
                  add-ons-type="supervision"
                  @addOnsCounterChange="
                    addOnsCounterChangeHandler($event, 'supervision')
                  "
                />
              </li>
            </ul>
          </div>
          <div class="dashed-line" />
        </template>
        <template v-if="addOnsData.mainAddOns.length > 0">
          <p v-if="labels.mainAddOns.title" class="title mb-2">
            {{ labels.mainAddOns.title }}
          </p>
          <p v-if="labels.mainAddOns.subTitle" class="sub-title mb-4 lg:mb-6">
            {{ labels.mainAddOns.subTitle }}
          </p>
          <AddOnsContainer
            :data="addOnsData.mainAddOns"
            :package-details="packageDetails"
            add-ons-type="mainAddOns"
            key-ref="mainAddOns"
            @addOnsCounterChange="
              addOnsCounterChangeHandler($event, 'mainAddOns')
            "
          />
          <div class="dashed-line" />
        </template>
        <template v-if="addOnsData.christmasFoodBeverages.length > 0">
          <p v-if="labels.christmasFoodBeverages.title" class="title mb-2">
            {{ labels.christmasFoodBeverages.title }}
          </p>
          <p
            v-if="labels.christmasFoodBeverages.subTitle"
            class="sub-title mb-4 lg:mb-6"
          >
            {{ labels.christmasFoodBeverages.subTitle }}
          </p>
          <AddOnsContainer
            :data="addOnsData.christmasFoodBeverages"
            :package-details="packageDetails"
            add-ons-type="christmasFoodBeverages"
            key-ref="christmasFoodBeverages"
            @addOnsCounterChange="
              addOnsCounterChangeHandler($event, 'christmasFoodBeverages')
            "
          />
        </template>
      </div>
    </template>
  </CardContainer>
</template>

<script>
import AddOnsItem from "@/components/BookingFlow/addOnsItem";
import AddOnsContainer from "@/components/BookingFlow/addOnsContainer";

export default {
  name: "AddOns",
  components: {
    AddOnsItem,
    AddOnsContainer
  },
  props: {
    packageDetails: {
      type: Object,
      default: () => ({}),
    },
    isFullPageLoaderEnabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['addOnsCounterChange'],
  data() {
    return {
      isLoading: true,
      addOnsData: {
        supervision: {},
        mainAddOns: [],
        christmasFoodBeverages: [],
      },
      labels: {
        supervision: {
          title: "",
          subTitle: "",
        },
        mainAddOns: {
          title: "",
          subTitle: "",
        },
        christmasFoodBeverages: {
          title: "",
          subTitle: "",
        },
      },
    };
  },
  head() {
    return this.$seoGenerator({}, this.$t("PAGES_TITLE.BOOKING.ADD_ONS"));
  },
  computed: {
    isSupervisionEnabled() {
      for (const ageType in this.packageDetails.people) {
        let ageTypeData = this.packageDetails.people[ageType];
        if (typeof ageTypeData === "object") {
          // snow premium, snow daycation..
          for (let index = 0; index < ageTypeData.length; index++) {
            //
            if (ageType == "adult") {
              if (ageTypeData[index].isSelected) return false;
            } else {
              if (ageTypeData[index].isSelected) {
                let ticket = this.searchTicketByID(ageTypeData[index].id);
                if (ticket.requires_adult_supervision) return true;
              }
            }
          }
        } else {
          if (ageType == "adult") {
            if (ageTypeData > 0) return false;
          } else {
            if (this.packageDetails.tickets[0].requires_adult_supervision)
              return true;
          }
        }
      }
      return false;
    },
  },
  watch: {
    packageDetails() {
      this.prepareAddOnsData();
    },
  },
  mounted() {
    this.prepareAddOnsData();
  },
  methods: {
    isThereAdultSelectedToTheSameTicket(ticketID, adultData) {
      for (let index = 0; index < adultData.length; index++) {
        if (adultData[index].id == ticketID && adultData[index].isSelected)
          return true;
      }
      return false;
    },
    searchTicketByID(id) {
      for (let index = 0; index < this.packageDetails.tickets.length; index++) {
        if (this.packageDetails.tickets[index].id == id)
          return this.packageDetails.tickets[index];
      }
      return {};
    },
    prepareAddOnsData() {
      let add_ons = this.$deepCloneArray(this.packageDetails.add_ons || {});
      if (!this.$isEmptyObject(add_ons)) {
        if (!this.$isEmptyObject(add_ons["supervision_add_on"])) {
          let data = add_ons["supervision_add_on"];
          this.addOnsData.supervision = data.add_on_item || {};
          this.labels.supervision.title = data.title || "";
          this.labels.supervision.subTitle = data.subtitle || "";
        }
        if (!this.$isEmptyObject(add_ons["main_add_ons"])) {
          let data = add_ons["main_add_ons"];
          this.addOnsData.mainAddOns = data.add_ons_items || [];
          this.labels.mainAddOns.title = data.title || "";
          this.labels.mainAddOns.subTitle = data.subtitle || "";
        }
        if (!this.$isEmptyObject(add_ons["other_add_ons"])) {
          let data = add_ons["other_add_ons"];
          this.addOnsData.christmasFoodBeverages = data.add_ons_items || [];
          this.labels.christmasFoodBeverages.title = data.title || "";
          this.labels.christmasFoodBeverages.subTitle = data.subtitle || "";
        }
        this.isLoading = false;
      }
      //
      let supervisionArr = [this.addOnsData.supervision];
      if (supervisionArr.length > 0) {
        this.addOnsData.supervision = this.mapAddOnsData(supervisionArr)[0];
      }
      this.addOnsData.mainAddOns = this.mapAddOnsData(
        this.addOnsData.mainAddOns
      );
      this.addOnsData.christmasFoodBeverages = this.mapAddOnsData(
        this.addOnsData.christmasFoodBeverages
      );
    },
    mapAddOnsData(addOnArray) {
      return addOnArray.map((res) => {
        const result = {
          id: res.id,
          ak: res.ak,
          title: res.title || "",
          subTitle1: res.first_subtitle || "",
          subTitle2: res.second_subtitle || "",
          localized_title: res.localized_title || "",
          amount: res.price || 0,
          counter: this.getAddonsSelectionCounter(res.id),
          img: res.image,
          max_number_of_order: res.max_number_of_order || 0,
        };
        return result;
      });
    },
    getAddonsSelectionCounter(addonsID) {
      if (this.$isEmptyObject(this.packageDetails)) return 0;
      if (this.$isEmptyObject(this.packageDetails.addOnsSelection)) return 0;
      for (
        let index = 0;
        index < this.packageDetails.addOnsSelection.length;
        index++
      ) {
        if (this.packageDetails.addOnsSelection[index].id == addonsID)
          return this.packageDetails.addOnsSelection[index].counter;
      }
      //
      return 0;
    },
    addOnsCounterChangeHandler(data, addOnsType) {
      if (addOnsType == "supervision") {
        this.addOnsData.supervision.counter = data.counter;
      } else {
        this.addOnsData[addOnsType][data.index].counter = data.counter;
      }
      //
      let temp = data;
      temp["addOnsType"] = addOnsType;
      this.$emit("addOnsCounterChange", temp);
    },
  }
};
</script>
<style scoped lang="scss">
@import "./add-ons.scss";
</style>
