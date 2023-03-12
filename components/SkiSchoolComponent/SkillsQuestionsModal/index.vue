<template>
  <div id="skills-questions-container">
    <BaseModal
      :classes="[isFinished ? 'finished-modal' : 'unfinished-modal', 'shared']"
      :show-modal="showModal"
      :show-close-icon="isFinished && $globalData.isDesktopDevice"
      :is-loading="isLoading"
      text-close-color="black"
      close-modal-color="bg-[#FFFFFF]"
      close-icon-width="16"
      close-icon-height="16"
      content-wrapper-classes="m-0"
      @closeModal="closeModal"
    >
      <template v-if="!isFinished" #header>
        <h1 class="modal-title">
          {{ (data || {}).title }}
        </h1>
        <div class="modal-subtitle-wrapper">
          <h2 class="modal-subtitle">
            {{ (data || {}).subtitle }}
          </h2>
        </div>
      </template>

      <template slot="content">
        <template v-if="!isFinished">
          <div
            v-for="question_section in data.question_sections"
            :key="question_section.id"
            class="mt-6"
          >
            <h3 class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold  text-base text-[#191919]">
              {{ question_section.question_section_title }}
            </h3>

            <BaseCheckbox
              v-for="(question_level, ql_index) in question_section.question_level"
              :id="`ql-${question_section.id}-${ql_index}`"
              :key="question_level.id"
              v-model="question_level.value"
              :label="question_level.question_title"
              :checkbox-wrapper-classes="[
                'border-1 border-[#00000014] w-full border-solid rounded-2xl p-4',
                {'text-white bg-[#142b73]': question_level.value},
                ql_index === 0 ? 'mt-2 md:mt-4' : 'mt-2'
              ]"
              :classes="[
                `ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-[0.75rem] leading-4 ${
                  !question_level.value ? 'text-[#606060]' : 'text-[#ffffff]'
                }`
              ]"
              @input="onSkillToggle(question_section.id, question_level)"
            />
          </div>

          <div class="flex items-center justify-end mt-6">
            <BaseButton
              btn-type="button"
              :text="$t('COMMON.CLOSE')"
              class-name="btn-close"
              @onBtnClick="closeModal"
            />
            <BaseButton
              btn-type="button"
              :text="$t('COMMON.CONFIRM')"
              :b-t-ndisabled="!selectedSkill.level"
              class-name="btn-submit"
              @onBtnClick="isFinished = true"
            />
          </div>
        </template>

        <template v-else>
          <SkillResult
            :general-data="data.check_skill_level_result_popup"
            :selected-skill="{ ...selectedSkill }"
            @searchLessons="updateFilterAndSearchLessons"
            @closeModal="closeModal"
          />
        </template>
      </template>
    </BaseModal>
  </div>
</template>

<script>
import SkillResult from "../SkillResult/index.vue";
import {endPoints} from "@/const/api";
import BaseModal from "@/components/Shared/BaseUI/BaseModal";
import BaseButton from "@/components/Shared/BaseUI/BaseButton";
import BaseCheckbox from "@/components/Shared/BaseUI/FormElements/BaseCheckbox/index.vue";

export default {
  components: {
    SkillResult,
    BaseModal,
    BaseButton,
    BaseCheckbox
  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    qaType: {
      type: Number,
      default: 1, // ski
    },
    isAPICall: {
      type: Boolean,
      default: true,
    },
    preparedData: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["close-modal"],
  data() {
    return {
      isLoading: false,
      isFinished: false,
      data: {},
      activeLevelHolderId: "",
      selectedSkill: {},
      selectedSkills: [],
    };
  },
  mounted() {
    if (this.isAPICall) this.getData();
    else this.initData(this.preparedData);
  },
  methods: {
    resetValues() {
      // TODO: Get back here.
      const flattendData = this.data;

      if (flattendData && flattendData.question_sections && flattendData.question_sections.length)
        for (let i = 0; i < flattendData.question_sections.length; i++) {
          for (let j = 0; j < flattendData.question_sections[i].question_level.length; j++) {
            if (flattendData.question_sections[i].question_level[j].value) flattendData.question_sections[i].question_level[j].value = false;
          }
        }
    },
    closeModal() {
      this.resetValues();
      this.$emit("close-modal", false);
    },
    onSkillToggle(levelHolderId, toggledSkill) {
      if (this.activeLevelHolderId !== levelHolderId) {
        this.activeLevelHolderId = levelHolderId;
        this.selectedSkills = [];
        this.selectedSkills.push(toggledSkill);

        const flattendData = this.data;

        for (let i = 0; i < flattendData.question_sections.length; i++) {
          if (flattendData.question_sections[i].id !== levelHolderId)
            for (let j = 0; j < flattendData.question_sections[i].question_level.length; j++) {
              if (flattendData.question_sections[i].question_level[j].value)
                flattendData.question_sections[i].question_level[j].value = false;
            }
        }

        this.data = flattendData;
      } else {
        const isSkillSelectedBefore = this.selectedSkills.find((skill) => skill.id === toggledSkill.id);

        if (isSkillSelectedBefore) this.selectedSkills = this.selectedSkills.filter((skill) => skill.id !== toggledSkill.id);
        else this.selectedSkills.push(toggledSkill);
      }

      const topSkill = this.selectedSkills.sort((a, b) => b.level - a.level)[0];

      if (!topSkill) this.selectedSkill = {};
      else if (topSkill.id !== this.selectedSkill.id) this.selectedSkill = {...topSkill};
    },
    updateFilterAndSearchLessons() {
      const skill = {
        id: this.selectedSkill.level,
        title: this.selectedSkill.level_result_text || "",
      };

      this.resetValues();
      this.$emit("update-filter", skill);
    },
    initData(res) {
      if (res.question_sections && res.question_sections.length) {
        this.activeLevelHolderId = res.question_sections[0].id;
      }
      this.data = {...res};
    },
    async getData() {
      try {
        this.isLoading = true;

        const {data: res} = await this.$axios.get(
          endPoints.GET_SKILL_DATA + `?categoryType=${this.qaType}`,
          {
            params: {
              lang: "en",
              timeZone: this.$getSiteConfig('timezone'),
            },
          }
        );

        if (res && res.Result) {
          this.initData(res.Result);
        } else this.data = {};

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        console.log({err});
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./SkillsQuestionsModal.scss";
</style>
