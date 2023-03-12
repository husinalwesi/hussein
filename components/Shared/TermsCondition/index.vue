<template>
  <div class="terms-text">
    I agree and have read the
    <span class="underline" @click="showModal=true">Terms and Conditions,</span>
    and fully understand its content. I confirm that the information provided is true and accurate. I am aware that this is a release of liability and a contract. I sign it of my own free will.
    <BaseModal
      :classes="[`max-w-[40rem] mobiles:max-w-[343px]`]" :show-close-icon="true" :show-modal="showModal"
      @closeModal="showModal=false"
    >
      <h2 slot="header" class="modal-header">
        Terms and Conditions
      </h2>
      <div slot="content">
        <div>
          I hereby agree to sign the following release and waiver of liability (the “Release and Waiver”) in favor of Majid Al Futtaim Properties LLC and Majid Al Futtaim Leisure & Entertainment LLC, their affiliates companies, directors. officers, employees, volunteers and agents (collectively "MAF") and execute freely and voluntarily, without duress, the Release and Waiver and take action for myself, my executors, administrators, heirs, next of kin, successors, and assigns, under the following terms:
        </div>
        <div class="mt-12">
          <div class="font-semibold">
            Waiver and Release
          </div>
          I do hereby fully waive, release, discharge and hold harmless MAF form any and all liabilities, claims, obligations, damages and causes of action whatsoever, including but not limited to, liability arising from the negligence or fault of the entities of persons released, for my death, disability, illness, personal injury, property damage, property theft, or actions of any kind which may hereafter occur to me while exercising the Activity. I understand MAF does not assume any responsibility or obligation to provide financial or other assistance, including, but not limited to medical, health or disability insurance, in the event of injury, illness, death or property damage.
        </div>
        <div class="mt-12">
          <div class="font-semibold">
            Physical Condition/Medical Authorization
          </div>

          I hereby certify that I am physically fit for participation in the Activity, I am free from any adverse medical conditions, have the skill level required in conjunction with the Activity, and have not been advised otherwise. I agree that before I participate in the Activity, I will inspect all related facilities and equipment. In connection with any injury sustained or illness or medical conditions experienced during my attendance in connection with the Activity, I authorize any emergency first aid, medication, medical treatment or surgery deemed necessary by the attending medical personnel if I am not able to act on my own behalf. Additionally, I authorize medical treatment for me, at my cost, if the need arises; however, I acknowledge that MAF shall have no duty, obligation or liability arising out of the provision of, or failure to provide, medical treatment. Except as otherwise agreed to by MAF in writing, I hereby release and forever discharge MAF from any claim whatsoever which arises or may hereafter arise on account of any first–aid or and/or medical authorization and/or physical condition.
        </div>
        <div class="mt-12">
          <div class="font-semibold">
            Indemnity
          </div>

          I indemnify, hold harmless and promise not to sue MAF or any related persons from any and all liabilities or claims made as a result of participation in the Activity managed by MAF or within MAF premises, whether caused by the negligence of MAF or otherwise.
        </div>
        <div class="mt-12">
          <div class="font-semibold">
            Equipment and Facilitation Inspection
          </div>
          I will immediately advise the manager on duty of any unsafe condition that I observe and will refuse to participate in the Activity until all unsafe conditions observed by me have been remedied. I also undertake to comply with ahh signs or other directions of MAF and understand that MAF may suspend or cancel my access to the Activity in its absolute discretion for noncompliance with these conditions, or for reckless or careless conduct.
        </div>
        <div class="mt-12">
          <div class="font-semibold">
            Assumption of Risks
          </div>
          I recognize and understand that the Activity may be hazardous to me or lead to serious consequences and hence I hereby expressly and specifically assume the risk of injury or harm in the Activity and release MAF from all liability for injury, illness, death or property damage resulting from or in relation with the Activity.
        </div>
        <div class="mt-12">
          <div class="font-semibold">
            Validity
          </div>
          This Release and Waiver shall be valid as of its date and shall remain valid until it is specifically terminated in writing by the Participant or his/her Parent/Guardian (as the case may be) by addressing a formal letter to MAF in this respect.
        </div>
        <div class="mt-12">
          <div class="font-semibold">
            Governing Law
          </div>

          This Release and Waiver shall be governed by the laws of the United Arab Emirates, and any legal action relating to or arising out of this Release and Waiver shall be commenced exclusively in the Courts of Dubai. If any part or provision is determined by a Court to be invalid or unenforceable, all other parts and provisions shall still be given full legal force and effect.
        </div>
      </div>
      <div slot="extra-element">
        <div class="section-border mt-4" />
        <div class="flex justify-end mt-4">
          <BaseButton
            class-name="accept-btn"
            text="Close" btn-type="button"
            @onBtnClick="closeTerms"
          />
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script>
export default {
  name: "TermsCondition",
  data() {
    return {
      showModal: false,
    }
  },methods:{
    closeTerms(){
      this.showModal=false;
    }
  }

};
</script>

<style lang="scss">
 .terms-text{
   @apply ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-[0.75rem] leading-6 text-[#1A1A1A];
    margin: 16px 0px;
  }
.accept-btn{
  @apply bg-[#142B73] h-8 w-[86px] ltr:font-inter-bold rtl:font-noto-sans-arabic-bold text-base leading-4 text-white rounded-lg;
  padding: 6px 16px 4px;
}
</style>
