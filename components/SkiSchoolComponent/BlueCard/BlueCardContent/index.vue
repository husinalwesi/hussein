<template>
  <div class="ski-card-content">
    <div class="card-title lg:block hidden">
      {{ data.lesson_details.title }}
    </div>
    <div class="card-subtitle">
      {{ data.lesson_details.description }}
    </div>
    <div v-if="data.lesson_details" class="mt-8 relative">
      <img
        v-if="data.lesson_details.image&&(data.lesson_details.video_link?data.lesson_details.video_link.length===0:true)"
        class="video-js mb-4"
        :src="data.lesson_details.image.image_url"
      >
      <video-player
        v-if="data.lesson_details.video_link"
        player-styles="video-js mobiles:w-100" :src="data.lesson_details.video_link"
      />
    </div>

    <div class="flex justify-start mt-6 mobiles:flex-col">
      <div
        v-for="(section,i) in data.lesson_details.under_video_sections" :key="i"
        class="description-section mobiles:w-full"
        :class="{'mobiles:pt-4 mobiles:pb-8':i>0}"
      >
        <div class="section-title">
          {{ section.title }}
        </div>
        <div class="section-body">
          <div v-for="(item,index) in section.items" :key="index">
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPlayer from 'nuxt-video-player'

export default {
  components: {
    VideoPlayer
  },
  props: {
    data: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      title: 'Beginner',
      subtitle: 'With a Beginners’ Lesson, you’ll learn the basics of skiing from the safety of the beginners’ slope. Our instructors will teach you how to turn on your skis or board and take you through how to slide and stop safely.',
    }
  },
}
</script>

<style lang="scss" scoped>
@import "CardContent";
@import "video";

</style>

<style lang="scss">

.v-player {
  iframe {
    width: 536px;
    height: 304px;
    @screen mobiles {
      width: 100%;
    }
  }
}

</style>
