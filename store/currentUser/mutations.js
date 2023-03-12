export default {
  SET_USER_INFO: (state, user) => {
    state.userInformation = user.userObj;
    window.localStorage.setItem('logged_in', 'login' + new Date());
  },
  UPDATE_USER_INFO: (state, updatedUserInfo) => {
    if (!updatedUserInfo.update) state.userInformation = updatedUserInfo;
    else {
      state.userInformation.fullName = updatedUserInfo.data.fullName;
      state.userInformation.firstName = updatedUserInfo.data.firstName;
      state.userInformation.gender = updatedUserInfo.data.gender;
      state.userInformation.lastName = updatedUserInfo.data.lastName;
      state.userInformation.mobile = updatedUserInfo.data.mobile;
      state.userInformation.country_of_residence = updatedUserInfo.data.country_of_residence;
      state.userInformation.dateOfBirth = updatedUserInfo.data.dateOfBirth;
      state.userInformation.title = updatedUserInfo.data.title;
      state.userInformation.mobileDetails = updatedUserInfo.data.mobileDetails;
      state.userInformation.countryName = updatedUserInfo.data.countryName;
      state.userInformation.nationalityCountryName = updatedUserInfo.data.nationalityCountryName;
      state.userInformation.nationality = updatedUserInfo.data.nationality;
      state.userInformation.age = updatedUserInfo.data.age;
    }
  },
  CLEAR_USER_INFORMATION: (state) => {
    state.userInformation = null;
  },
  UPDATE_SPECIFIC_ENTITY: (state, data) => {
    state.userInformation[data.entityName] = data.entityValue;
  }
}
