export default {
    saveUserInformation: ({commit}, user) => {
        let userObj = null;
        if (user.info) {
            userObj = user.info;
        }

        commit('SET_USER_INFO', {userObj});
    },
    updateUserInformation: ({commit}, updatedUserInfo) => {
        commit('UPDATE_USER_INFO', updatedUserInfo);
    },
    clearUserInformation: ({commit}) => {
        commit('CLEAR_USER_INFORMATION');
    },
    updateSpecificEntityInfo:({commit}, data)=>{
        commit('UPDATE_SPECIFIC_ENTITY', data);
    }
}