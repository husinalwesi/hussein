export const lookups = {
  LESSON_TYPE: [
    {
      title: 'All Lessons',
      id: 0
    },
    {
      title: 'Groups',
      id: 1
    },
    {
      title: 'Private',
      id: 2
    },
    {
      title: 'Camps',
      id: 3
    }, {
      title: 'Offers',
      id: 4
    }, {
      title: 'Academic',
      id: 5
    }
  ],
  SKI_AGE_TYPE:  (lang = 'en') =>{
    return [
      {
        title: lang === 'en' ? 'All Ages' : 'الكل',
        id: 0,
        localized_title: {
          en: "All Ages",
          ar: "الكل"
        }
      },
      {
        title: lang === 'en' ? 'Adult 14+' : 'بالغ 14+',
        id: 1,
        localized_title: {
          en: "Adult 14+",
          ar: "بالغ 14+"
        }
      },
      {
        title: lang === 'en' ? 'Junior 7-13' : 'طفل 7 - 13',
        id: 2,
        localized_title: {
          en: "Junior 7-13",
          ar: "طفل 7 - 13"
        }
      },
      {
        title: lang === 'en' ? 'Child 3-6' : 'طفل صغير 3 - 6',
        id: 4,
        localized_title: {
          en: "Child 3-6",
          ar: "طفل صغير 3 - 6"
        }
      }
    ]
  },
  SNOW_BOARD_AGE_TYPE:  (lang = 'en')=> {
    return [
      {
        title: lang === 'en' ? 'All' : 'الكل',
        id: 0,
        localized_title: {
          en: "All",
          ar: "الكل"
        }
      },
      {
        title: lang === 'en' ? 'Adult 14+' : 'بالغ 14+',
        id: 1,
        localized_title: {
          en: "Adult 14+",
          ar: "بالغ 14+"
        }
      },
      {
        title: lang === 'en' ? 'Junior 8-13' : 'طفل 8 - 13',
        id: 3,
        localized_title: {
          en: "Junior 8-13",
          ar: "طفل 8 - 13"
        }
      }
    ]
  },
  PASSPORT_TYPE: [
    {
      title: 'Ski',
      id: 1
    },
    {
      title: 'Snowboard',
      id: 2
    },
  ],
  PASSPORT_QUESTION_STATE: [
    {
      title: 'Passed',
      id: 1
    },
    {
      title: 'Need Reassessment',
      id: 2
    },
    {
      title: 'Not Assessed',
      id: 3
    },
  ],
  contactFormsTypes: {
    general: 1,
    birthdays: 2,
    schools: 3,
    company: 4
  },
  GUEST_BOOKING_FORM_MODALS_TYPES: {
    BOOKING_MODAL: 1,
    TERMS_CONDITIONS_MODAL: 2
  }
}


export const newsletterTypes = {
  PASS_ANNOUNCEMENT: "pass_announcement_event",
  JOIN_NEWSLETTER: "join_our_newsletter",
  JOIN_COMMUNITY: "join_our_community"
}
