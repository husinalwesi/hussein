<template>
  <div class="meet-penguin">
    <div v-if="data.title" class="title-wrapper">
      <h2 class="title">
        {{ data.title }}
      </h2>
    </div>
    <div class="description-wrapper">
      <p class="description">
        {{ data.description }}
      </p>
    </div>

    <div v-if="data.categories && data.categories.length" class="lg:mt-16 mt-8">
      <div v-if="$globalData.isDesktopDevice" class="flex gap-x-4 px-4 xl:px-0">
        <ul class="tabs-list" vue-dragscroll>
          <li
            v-for="tab in data.categories"
            :key="tab.id"
            class="tab"
            :class="{
              active: selectedTab.id === tab.id,
            }"
            @click="onTabChange(tab)"
          >
            {{ tab.category_title }}
          </li>
        </ul>

        <div v-if="selectedTab" class="penguin-content desktop">
          <div class="white-container" />
          <div v-if="selectedTab.image" class="image-wrapper">
            <img
              :src="selectedTab.image.image_url"
              :alt="selectedTab.image.alt_text"
              :title="selectedTab.image.title"
              width="424"
              height="424"
              class="penguin-image"
            >

            <img
              src="~assets/images/speak-penguin/white-rectangle.png"
              alt="white rectangle"
              title="white rectangle"
              class="white-rectangle"
              :class="{hidden: !$globalData.isDesktopDevice && !$globalData.isMobileDevice}"
            >
          </div>
          <div class="info-container">
            <div v-if="selectedTab.title" class="title">
              {{ selectedTab.title }}
            </div>
            <div v-if="selectedTab.description" class="description mt-8">
              {{ selectedTab.description }}
            </div>
            <div
              v-if="selectedTab.extra_title || selectedTab.extra_description"
              class="mt-8"
            >
              <div v-if="selectedTab.extra_title" class="extra-info-title">
                {{ selectedTab.extra_title }}
              </div>
              <div
                v-if="selectedTab.extra_description"
                class="description mt-2"
              >
                {{ selectedTab.extra_description }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="penguin-content mobile-tablet">
        <div
          v-for="(penguinData, penguinIndex) in data.categories"
          :key="penguinIndex"
          class="mt-[3rem]"
        >
          <div class="relative flex flex-col px-4">
            <div v-if="penguinData.image" class="image-wrapper">
              <img
                :src="penguinData.image.image_url"
                :alt="penguinData.image.alt_text"
                :title="penguinData.image.title"
                width="424"
                height="424"
                class="penguin-image"
              >

              <img
                src="~assets/images/speak-penguin/white-rectangle.png"
                alt="white rectangle"
                title="white rectangle"
                class="white-rectangle"
              >
            </div>
            <div class="mt-4 mx-4">
              <div v-if="penguinData.category_title" class="cat-title">
                {{ penguinData.category_title }}
              </div>

              <div class="mt-4">
                <div
                  v-if="penguinData.title"
                  class="title"
                >
                  {{ penguinData.title }}
                </div>
                <div v-if="penguinData.description" class="description mt-8">
                  {{ penguinData.description }}
                </div>
                <div
                  v-if="penguinData.extra_title || penguinData.extra_description"
                  class="mt-8"
                >
                  <div v-if="penguinData.extra_title" class="extra-info-title">
                    {{ penguinData.extra_title }}
                  </div>
                  <div
                    v-if="penguinData.extra_description"
                    class="description mt-2"
                  >
                    {{ penguinData.extra_description }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => ({}),
    }
  },
  data() {
    return {
      lastActiveTab: { offsetLeft: 0 },
      selectedTab: {},
    };
  },
  mounted() {
    if (this.data && this.data.categories && this.data.categories.length)
      this.selectedTab = this.data.categories[0];
  },
  methods: {
    onTabChange(tab) {
      this.selectedTab = tab;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./MeetPenguin.scss";
</style>
