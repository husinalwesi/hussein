<template>
  <section class="experience-activities-section" :class="classes">
    <div v-if="isWithBgLayer" class="bg-gray-layer" />

    <div class="content-container">
      <div class="header-container">
        <div v-if="experienceActivitiesData.title" class="title-wrapper">
          <h3 class="title" v-html="$splitTextToLines(experienceActivitiesData.title)" />
        </div>
        <div>
          <div class="description-wrapper">
            <p v-if="experienceActivitiesData.description" class="description">
              {{ experienceActivitiesData.description }}
            </p>
          </div>
          <template v-if="(experienceActivitiesData.cta || {}).url">
            <BaseButton
              :cta="experienceActivitiesData.cta"
              :btn-type="$isExternalLink(experienceActivitiesData.cta.url) ? 'externalLink' : 'link'"
              :text="experienceActivitiesData.cta.title"
              :path="experienceActivitiesData.cta.url"
              class-name="cta-link"
            />
          </template>
        </div>
      </div>

      <div
        v-if="
          experienceActivitiesData.activities &&
            !!experienceActivitiesData.activities.length
        "
        class="experience-activities-cards-container"
      >
        <div
          v-for="(
            rowActivities, rowIndex
          ) in experienceActivitiesData.activities"
          :key="rowIndex"
          class="row-container"
        >
          <PreviewCard
            v-for="(activity, activityIndex) in rowActivities"
            :id="activity.id"
            :key="activity.title + activityIndex"
            :card-data="activity"
            :card-is-fixed-width="(rowIndex + activityIndex) % 2 === 0 && !!rowActivities[activityIndex+1]"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BaseButton from "@/components/Shared/BaseUI/BaseButton";
import PreviewCard from "@/components/Shared/Cards/PreviewCard";
/* eslint-disable no-undef */

export default {
  components:{BaseButton,PreviewCard},
  props: {
    classes: {
      type: [String, Array],
      default: () => "",
    },
    experienceActivitiesData: {
      type: Object,
      default: () => ({})
    },
    isWithBgLayer: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
@import "./ExperienceActivities.scss";
</style>
