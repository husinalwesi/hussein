<template>
  <div
    class="relative w-full max-w-[1024px]"
  >
    <div ref="santaSection" class="santa-section">
      <img
        v-if="data && data.left_icon && data.left_icon.image_url"
        :src="data.left_icon.image_url" width="80" height="80"
        class="cherry-icon" :alt="data.right_icon.alt_text" :title="data.right_icon.title"
      >
      <template v-if="isCounterView">
        <div class="santa-counter-section">
          <div class="santa-counter-title">
            <p>
              {{ data && data.title ? data.title : '' }}
            </p>
          </div>
          <div class="santa-counter-container">
            <div v-if="counter.days">
              <div class="numbers-container">
                <span class="numbers">{{ counter.days }}</span>
              </div>
              <div class="numbers-text-container">
                <span>{{ $pluralTextHandler(+counter.days, 'DAYS') }}</span>
              </div>
            </div>
            <div>
              <div class="numbers-container">
                <span>{{ counter.hours }}</span>
              </div>
              <div class="numbers-text-container">
                <span>{{ $pluralTextHandler(+counter.hours, 'HOURS') }}</span>
              </div>
            </div>
            <div>
              <div class="numbers-container">
                <span>{{ counter.minutes }}</span>
              </div>
              <div class="numbers-text-container">
                <span>{{ $pluralTextHandler(+counter.minutes, 'MINUTES') }}</span>
              </div>
            </div>
            <div v-if="!counter.days">
              <div class="numbers-container">
                <span>{{ counter.seconds }}</span>
              </div>
              <div class="numbers-text-container">
                <span>{{ $pluralTextHandler(+counter.seconds, 'SECONDS') }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="santa-here-container">
          <nuxt-link
            :to="localePath(data && data.cta_after_countdown && data.cta_after_countdown.url ? data.cta_after_countdown.url : '/')"
            class="santa-here"
          >
            {{ data && data.cta_after_countdown && data.cta_after_countdown.title ? data.cta_after_countdown.title : '' }}
          </nuxt-link>
        </div>
      </template>
      <img
        v-if="data && data.right_icon && data.right_icon.image_url"
        :src="data.right_icon.image_url" width="118" height="121"
        class="santa-face" :alt="data.right_icon.alt_text" :title="data.right_icon.title"
      >
    </div>
  </div>
</template>

<script>
import moment from "moment-timezone";
import BezierEasing from "bezier-easing";
import gsap from "gsap";

export default {
    name: "CountDownChristmas",
    props: {
        data: {
            type: Object,
            default: () => ({}),
        }
    },
    data() {
        return {
            counter: {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            },
            currentEnvTimezone: ''
        }
    },
    computed: {
        isCounterView(){
            return this.counter.days || this.counter.hours || this.counter.minutes || this.counter.seconds;
        }
    },
    mounted(){
        this.currentEnvTimezone = this.$getSiteConfig('timezone');
        this.startTimer();
        this.animateSanta();
    },
    methods: {
      animateSanta(){
        let santaSection = this.$refs.santaSection;
        gsap
          .to(
            santaSection,
            {
              opacity: 1,
              duration: 0.67,
              ease: BezierEasing(0.33, 0, 0, 1),
            })
            .delay(this.$globalData.isDesktopDevice ? 1.7 : 3);
      },
      startTimer(){
        if(!this.data.start_countdown || !this.data.end_countdown) return false;
        let startCountdown = moment.utc(this.data.start_countdown).subtract({hours: 4}).tz(this.currentEnvTimezone);
        let endCountdown = moment.utc(this.data.end_countdown).subtract({hours: 4}).tz(this.currentEnvTimezone);
        if(moment().tz(this.currentEnvTimezone).isAfter(startCountdown) && moment().tz(this.currentEnvTimezone).isBefore(endCountdown)){
          this.updateCounterAndGetTimeDifference(endCountdown);
          let timer = setInterval(() => {
              if (this.updateCounterAndGetTimeDifference(endCountdown) < 0) clearInterval(timer);
          }, 1000);
        }
      },
      updateCounterAndGetTimeDifference(endCountdown){
        let timeDifference = endCountdown.valueOf() - moment().tz(this.currentEnvTimezone).valueOf();
        this.counter = {
            days: timeDifference >= 0 ? Math.floor(timeDifference / (1000 * 60 * 60 * 24)) : 0,
            hours: timeDifference >= 0 ? Math.floor((timeDifference % (1000 * 60 * 60 * 24))/(1000 * 60 * 60)) : 0,
            minutes: timeDifference >= 0 ? Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)) : 0,
            seconds: timeDifference >= 0 ? Math.floor((timeDifference % (1000 * 60)) / 1000) : 0
        };
        return timeDifference;
      }
    }
};
</script>

<style lang="scss" scoped>
@import "./CountDownChristmas.scss";
</style>
