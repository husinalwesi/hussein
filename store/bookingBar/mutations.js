export default {
    setFilterData(state, data) {
        state.data = data;
    },
    setAk(state, ak) {
        state.ak = ak;
    },
    setBookingBarDetails(state, data) {
        state.bookingBarDetails = data;
    },
    setTempExpercienceData(state, data) {
        state.tempExpercienceData = data;
    },
    CLEAR_BOOKING_BAR_DATA: (state) => {
        state.tempExpercienceData = {};
        state.data = {};
        state.ak = '';
        state.bookingBarDetails = {};
    },
}
