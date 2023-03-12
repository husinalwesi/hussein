import * as braze from "@braze/web-sdk";

// initialize the SDK
braze.initialize('3ee79e41-df41-4966-b2b6-83d94db6adb2', {
  baseUrl: "sdk.fra-01.braze.eu"
});

// optionally show all in-app messages without custom handling
braze.automaticallyShowInAppMessages();

// optionally set the current user's External ID
// if (isLoggedIn){
//   braze.changeUser(userIdentifier);
// }

// if you use Content Cards
// braze.subscribeToContentCardsUpdates(function(cards){
//   // cards have been updated
// });

// Be sure to call `openSession` after `automaticallyShowInAppMessages`
braze.openSession();

export default ({ app }, inject) => {
  inject('braze', braze);
};
