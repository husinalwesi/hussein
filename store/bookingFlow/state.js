export default () => ({
    personalDetailsTab: {
        guestFormIsValid: false,
        guestInformation: null
    },
    bookingSessionTimer: {
        isStart: false,
        endTimeStringFormat: null,
        endDateTime: null,
        timeOfDay: ''
    },
    tempCard: {},
    bookingData: [],
    selectedPackageIndex: 0,
    discount: [],
    totalAmount: {
        NET: 0,
        TAX: 0,
        GROSS: 0,
        shareDiscount: 0
    },
    jwt: '',
    reservationCode: ''
})
