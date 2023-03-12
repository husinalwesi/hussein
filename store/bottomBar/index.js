// holds your root state
export const state = () => ({
  ctas: {}
})

// contains your actions
export const actions = {
  setBottomBarData({commit}, value) {
    commit('setBottomBarData', value)
  }
}
// contains your mutations
export const mutations = {
  setBottomBarData(state, value) {
    state.ctas = value
  }
}
// your root getters
export const getters = {
  getCtas(state) {
    return state.ctas
  }
}
