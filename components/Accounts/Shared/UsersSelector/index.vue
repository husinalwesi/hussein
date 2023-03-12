<template>
  <ul class="users-list">
    <li
      v-for="user in usersList"
      :key="user.id"
      class="user"
      :class="[selectedUserDetails.id === user.id&&!isDisabled?'selected':'',isDisabled?'disabled':'']"
      @click="$emit('setSelectedUserDetails', user)"
    >
      {{ user.firstName }}
    </li>

    <li v-if="showAddBtn" class="ltr:ml-4 rtl:mr-4">
      <button
        type="button"
        aria-label="add user"
        @click.prevent="$emit('onAddBtnClick')"
      >
        <AddBtnDropDown width="24" height="24" bg-color="#FAD903" />
      </button>
    </li>
  </ul>
</template>

<script>
import AddBtnDropDown from "@/components/SVGElements/AddBtnDropDown.vue";

export default {
  name: "UsersSelector",
  components: { AddBtnDropDown },
  props: {
    usersList: {
      type: Array,
      default: () => [],
    },
    selectedUserDetails: { type: Object, default: () => ({}) },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    showAddBtn: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['setSelectedUserDetails', 'onAddBtnClick'],
};
</script>

<style lang="scss" scoped>
.users-list {
  // TODO: change this when the carousel is implemented.
  scroll-snap-type: x mandatory;
  @apply overflow-x-auto flex list-none h-14 items-center px-[31px] rounded-tr-3xl rounded-tl-3xl bg-dark-blue;

  .user {
    scroll-snap-align: center;
    @apply lg:cursor-pointer flex ltr:font-druk-text-wide-bold rtl:font-adapter items-center opacity-50 leading-4 pb-1 text-[13px] text-white uppercase h-full;

    &.selected {
      @apply border-b-4 border-solid border-light-yellow pb-0 opacity-100;
    }
    &:not(:first-child) {
      @apply ltr:ml-8 rtl:mr-8;
    }

    &.disabled {
      @apply lg:cursor-not-allowed
    }
  }

  &::-webkit-scrollbar {
    @apply hidden;
  }
}
</style>
