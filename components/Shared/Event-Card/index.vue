<template>
  <div
    :class="[
      direction !== 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row',
      customContainerClasses,
    ]"
    class="event-card-container"
  >
    <div class="card-details-container">
      <div class="title-wrapper">
        <div
          v-if="data.title"
          class="title"
          :data-note-title="data.note_title"
          v-html="$splitTextToLines(data.title)"
        />
        <div v-if="data.subtitle" class="subtitle">
          {{ data.subtitle }}
        </div>
        <div v-if="data.note_title" class="note-title">
          {{ data.note_title }}
        </div>
      </div>

      <div
        v-if="data.description_highlighted"
        class="description"
        v-html="data.description_highlighted"
      />

      <div v-if="showEventButton && data.cta" class="btn-wrapper">
        <BaseButton
          btn-type="button"
          :cta="data"
          :class-name="
            customButtonClass
              ? customButtonClass
              : 'gs-base-button-default-styles'
          "
          :text="data.cta.title"
          :path="data.cta.link || data.cta.url"
          @onBtnClick="goTo()"
        />
      </div>
    </div>
    <div v-if="data.image" class="image-container">
      <img
        :src="data.image.image_url"
        :alt="data.image.alt_text"
        :title="data.image.title"
        width="450"
        height="256"
        class="card-img"
      >
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/Shared/BaseUI/BaseButton";

export default {
  name: "EventCard",
  components:{
    BaseButton
  },
  props: {
    data: {
      type: Object,
      default: () => {
      },
    },
    package: {
      type: Object,
      default: () => {
      },
    },
    direction: {
      type: String,
      default: () => "right",
    },
    showEventButton: {
      type: Boolean,
      default: true,
    },
    customButtonClass: {
      type: String,
      default: () => "",
    },
    customContainerClasses: {
      type: String,
      default: () => "",
    },
    cardType: {
      type: String,
      default: () => "passes",
    }
  },
  methods: {
    checkButtonType(item) {
      return item && (item.includes("https") || item.includes("http"))
        ? "externalLink"
        : "link";
    },
    goTo() {
      if (
        (!(this.data.cta.link || this.data.cta.url) ||
          (this.data.cta.link || this.data.cta.url).length === 0) &&
        (this.package || {}).id
      ) {
        this.$updateAkAndRoute(
          this.package.id,
          this.package.id,
          this.cardType,
          this.package
        );
      } else {
        if (
          this.checkButtonType(this.data.cta.link || this.data.cta.url) ===
          "externalLink"
        ) {
          window.open(
            this.data.cta.link || this.data.cta.url,
            "_blank" // <- This is what makes it open in a new window.
          );
        } else {
          this.$router.push(this.localePath(this.data.cta.link || this.data.cta.url));
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "event-card.scss";
</style>
