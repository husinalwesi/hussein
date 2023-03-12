<template>
  <CardContainer>
    <template #card-content>
      <template v-if="isLoading">
        <snowflake-loader loader-wrapper-classes="bg-[#ffffff6e] h-52 rounded-3xl" />
      </template>

      <div v-else class="user-details-box">
        <template v-if="usersList && usersList.length">
          <UsersSelector
            :users-list="usersList"
            :selected-user-details="selectedUserDetails"
            :is-disabled="isAddNewUser"
            @onAddBtnClick="isAddNewUser = true"
            @setSelectedUserDetails="setSelectedUserDetails($event)"
          />

          <EditUserProfile
            v-if="isAddNewUser"
            :add-new-user="isAddNewUser"
            :site-default-mobile-details="siteDefaultMobileDetails"
            @toggleCurrentComponent="toggleCurrentComponent($event)"
          />
          <component
            :is="component"
            v-else-if="selectedUserDetails"
            :key="selectedUserDetails.id"
            :user-details="selectedUserDetails"
            :site-default-mobile-details="siteDefaultMobileDetails"
            @toggleCurrentComponent="toggleCurrentComponent($event)"
          />
        </template>
        <template v-else>
          <NoDataFound
            :no-data-text="$t('COMMON.ERROR_MESSAGES.DATA_ERROR')"
            container-classes="my-8"
            @fetchData="$emit('fetchData')"
          />
        </template>
      </div>
    </template>
  </CardContainer>
</template>

<script>
import UsersSelector from "@/components/Accounts/Shared/UsersSelector";
import UserProfile from "./UserProfile";
import EditUserProfile from "./EditUserProfile";
import AddBtnDropDown from "@/components/SVGElements/AddBtnDropDown.vue";
import NoDataFound from "@/components/Accounts/Shared/NoDataFound";

export default {
  components: {
    UsersSelector,
    UserProfile,
    EditUserProfile,
    AddBtnDropDown,
    NoDataFound,
  },
  props: {
    selectedUserDetails: {type: Object, default: () => ({})},
    usersList: {
      type: Array,
      default: () => [],
    },
    isError: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['fetchData', 'selectedUserDetails', 'updateUsers'],
  data() {
    const {iso2, dialCode} = this.$getSiteConfig("countryDetails");

    return {
      component: "UserProfile",
      isAddNewUser: false,
      siteDefaultMobileDetails: {
        regionCode: iso2,
        countryCode: dialCode,
        significantMobileNumber: ""
      }
    };
  },
  methods: {
    setSelectedUserDetails(user) {
      this.$emit("selectedUserDetails", user);
      if (this.component !== "UserProfile") this.component = "UserProfile";
    },
    toggleCurrentComponent(data = null) {
      if (!data)
        if (this.isAddNewUser) {
          this.isAddNewUser = false;
          this.component = "UserProfile";
        } else if (this.component === "UserProfile")
          this.component = "EditUserProfile";
        else this.component = "UserProfile";
      else {
        this.$emit("updateUsers", data);
        if (this.isAddNewUser) this.isAddNewUser = false;
        this.component = "UserProfile";
      }
    },
  },
};
</script>
