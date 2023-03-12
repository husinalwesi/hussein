<template>
  <SkeletonTheme class="flex w-full items-center" color="#ffffff" highlight="#d9d9d9">
    <div class="text-container flex flex-col gap-1">
      <Skeleton height="10px" :count="1" />
      <Skeleton
        height="10px" width="50%"
        :count="1"
      />
    </div>
  </SkeletonTheme>
</template>

<script>
import Vue from "vue";
import {Skeleton, SkeletonTheme} from 'vue-loading-skeleton';

Vue.use(Skeleton)

export default {
  name: "HeroLoader",
  components: {
    Skeleton,
    SkeletonTheme
  }
}
</script>

<style scoped lang="scss">
.image-wrapper {
  height: 200px;
  padding-left: 20px;

  span {
    height: 100%;
    width: 100%;
  }
}
</style>
