import Vue from 'vue'
import 'moment-timezone';

Vue.filter('plural', (key, counter) => {
  key = key.toUpperCase();
  const pluralList = {
    ADULT: {
      one: 'ONE_ADULT',
      two: 'TWO_ADULT',
      threeToNine: 'THREE_TO_NINE_ADULT',
      minTen: 'MIN_TEN_ADULT',
    },
    CHILD: {
      one: 'ONE_CHILD',
      two: 'TWO_CHILD',
      threeToNine: 'THREE_TO_NINE_CHILD',
      minTen: 'MIN_TEN_CHILD',
    },
    JUNIOR: {
      one: 'ONE_JUNIOR',
      two: 'TWO_JUNIOR',
      threeToNine: 'THREE_TO_NINE_JUNIOR',
      minTen: 'MIN_TEN_JUNIOR',
    },
    GUEST: {
      one: 'ONE_GUEST',
      two: 'TWO_GUEST',
      threeToNine: 'THREE_TO_NINE_GUEST',
      minTen: 'MIN_TEN_GUEST',
    },
    TABLE: {
      one: 'ONE_TABLE',
      two: 'TWO_TABLE',
      threeToNine: 'THREE_TO_NINE_TABLE',
      minTen: 'MIN_TEN_TABLE',
    },
  };
  let instanceName = 'one';
  if (counter == 2) instanceName = 'two';
  else if (counter >= 3 && counter <= 9) instanceName = 'threeToNine';
  else if (counter > 9) instanceName = 'minTen';
  return pluralList[key.toUpperCase()][instanceName];
})

Vue.filter('activityName', (key) => {
  const activitiesList = {
    slopeAccess: "slope access",
    penguinEncounter: "penguin encounter",
    snowBullet: "snow bullet",
    slopeLesson: "slope lesson",
    skiLesson: "ski lesson",
    snowboardingLesson: "snowboarding lesson",
    snowParkAccess: "snow park access"
  };

  return activitiesList[key];
})

Vue.filter('fullDate', (date) => {
  if (!date) return "";
  date = new Date(date);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${date.getDate()} ${months[date.getMonth()]
  } ${date.getFullYear()}`;
})

Vue.filter('formatCardNumber', (cardNumber) => {
  if (!cardNumber) return "";
  if (cardNumber.length < 4) return cardNumber;
  return cardNumber.slice(cardNumber.length - 4);
})

Vue.filter('formatTime', (time) => {
  if (!time) return "";
  let timeArr = time.split(":");
  let hours = parseInt(timeArr[0]);
  let minutes = parseInt(timeArr[1]);
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let strTime = hours + ':' + minutes + ampm;
  return strTime;
})


Vue.filter('fullMonth', (date) => {
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // var d = new Date();
  var monthName = months[date.getMonth()]; // "July" (or current month)
  return monthName;
})

Vue.filter('shortMonth', (date) => {
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  // var d = new Date();
  var monthName = months[date.getMonth()]; // "July" (or current month)
  return monthName;
})

Vue.filter('fullYear', (date) => {
  return date.getFullYear();
})

Vue.filter('leadingDay', (date) => {
  return date.getDate();
})

Vue.filter('truncateTwoDicemal', (number) => {
  let appliedFix = Number(number).toFixed(2);
  if (appliedFix.indexOf(".00")) {
    return appliedFix.replace(".00", "");
  }
  return appliedFix;
})
