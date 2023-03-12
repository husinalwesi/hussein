export default {
    SET_CARDS: (state, cards) => {
        state.cards = cards;
    },
    SET_FUTURE_STATUS: (state, saveForFuture) => {
        state.saveForFutureTemp = saveForFuture;
    },
}
