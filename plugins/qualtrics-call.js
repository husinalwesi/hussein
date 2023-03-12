/* eslint-disable no-undef */
function interceptLoaded() {
  if(QSI!==undefined && !!QSI) {
    if(QSI.API) {
      return true;
    } else {
      return false;
    }
  }else
  return false;
}

export function showIntercept() {
  setTimeout(() => {
    if (QSI!==undefined && !!QSI) {
      const isLoaded=interceptLoaded();
      if(isLoaded && QSI.API) {
        QSI.API.unload();
        QSI.API.load();
        QSI.API.run();
      }
    }  },1000)
}
export default ({ app }, inject) => {
  // Inject QSI in Vue
  inject('callQSI', showIntercept)
}
