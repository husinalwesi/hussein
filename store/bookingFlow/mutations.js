export default {
    SET_GUEST_FORM_VALIDTY: (state, guestFormValidtyStatus) => {
        state.personalDetailsTab.guestFormIsValid = guestFormValidtyStatus;
    },
    SET_GUEST_FORM_Information: (state, info) => {
        state.personalDetailsTab.guestInformation = info;
    },
    CLEAR_GUEST_INFORMATION: (state) => {
        state.personalDetailsTab = {
            guestFormIsValid: false,
            guestInformation: null
        };
        state.jwt = "";
    },
    SET_END_TIME: (state) => {
        const currentDate = new Date();
        const time = new Date(currentDate.getTime() + 30 * 60000);
        const hours = time.getHours() > 12 ? time.getHours() % 12 : time.getHours() % 12 ? time.getHours() : 12;
        const minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
        const timeOfDay = time.getHours() < 12 ? 'AM' : 'PM';

        state.bookingSessionTimer.endDateTime = time;
        state.bookingSessionTimer.isStart = true;
        state.bookingSessionTimer.timeOfDay = timeOfDay;
        state.bookingSessionTimer.endTimeStringFormat = hours + ':' + minutes;
    },
    SET_CURRENT_STEP_INFO(state, currStep) {
        state.currentStep.type = currStep.type;
        state.currentStep.btnHandlerText = currStep.btnHandlerText;
    },
    CLEAR_CART_BOOKING_FLOW_INFO: (state) => {
        state.personalDetailsTab = {
            guestFormIsValid: false,
            guestInformation: null
        };
        state.tempCard = {};
        state.bookingData = [];
        state.selectedPackageIndex = 0;
        state.discount = [];
        state.accountAK = "";
        state.jwt = "";
        state.reservationCode = "";
    },
    CLEAR_BOOKING_SESSION_TIMER: (state) => {
        state.bookingSessionTimer = {
            isStart: false,
            endTimeStringFormat: null,
            endDateTime: null,
            timeOfDay: ""
        }
    },
    SET_TEMP_CARD: (state, data) => {
        state.tempCard = data;
    },
    SET_BOOKING_DATA: (state, data) => {
        state.bookingData = data;
    },
    SET_SELECTED_PACKAGE_INDEX: (state, selectedPackageIndex) => {
        state.selectedPackageIndex = selectedPackageIndex;
    },
    SET_DISCOUNT: (state, discount) => {
        state.discount = discount;
    },
    SET_TOTAL_AMOUNT: (state, amount) => {
        state.totalAmount.NET = amount.NET;
        state.totalAmount.TAX = amount.TAX;
        state.totalAmount.GROSS = amount.GROSS;
        state.totalAmount.shareDiscount = amount.shareDiscount;
    },
    SET_GUEST_JWT: (state, jwt) => {
        state.jwt = jwt;
    },
    SET_RESERVATION_CODE: (state, reservationCode) => {
        state.reservationCode = reservationCode;
    },
}
