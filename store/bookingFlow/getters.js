export default {
  guestFormIsValid: state => {
    return state.personalDetailsTab.guestFormIsValid
  },
  guestInformation: state => {
    return state.personalDetailsTab.guestInformation
  },
  bookingSessionTimer: state => {
    return {
      isStart: state.bookingSessionTimer.isStart,
      endTimeStringFormat: state.bookingSessionTimer.endTimeStringFormat,
      endDateTime: state.bookingSessionTimer.endDateTime,
      timeOfDay: state.bookingSessionTimer.timeOfDay
    }
  },
  bookingData: state => {
    return state.bookingData
  },
  totalAmount: state => {
    return state.totalAmount;
  }
}
