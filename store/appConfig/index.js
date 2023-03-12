// holds your root state
export const state = () => ({
    vivaProducts: [],
    bookingMessages: {},
})

export const mutations = {
    SET_VIVA_PRODUCTS(state, products) {
        state.vivaProducts = products
    },
    SET_BOOKING_MESSAGES(state, messages) {
        state.bookingMessages = messages;
    }
}
