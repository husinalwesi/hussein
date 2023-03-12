export default {
    saveGuestFormValidtyStatus: ({ commit }, isValid) => {
        commit('SET_GUEST_FORM_VALIDTY', isValid);
    },
    saveGuestInformation: ({ commit }, guestInformation) => {
        commit('SET_GUEST_FORM_Information', guestInformation)
    },
    startBookingSession: ({ commit }) => {
        commit('SET_END_TIME');
    },
    clearCartAndBookingFlowInfo: ({ commit }) => {
        commit('CLEAR_CART_BOOKING_FLOW_INFO');
    },
    clearBookingSessionTimer: ({ commit }) => {
        commit('CLEAR_BOOKING_SESSION_TIMER');
    }
}