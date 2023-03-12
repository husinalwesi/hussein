import {CommonEvent} from "@/services/app-events";

export default ({app}, inject) => {

  inject('getTablesCountDependsOnNumberOfGuest', (guestCount, max_number_per_table) => {
    return Math.ceil(guestCount / max_number_per_table);
  });

  inject('removeEmptyArrayCell', (array) => {
    return array.filter((n) => n);
  });

  inject('removeDublicateArrayCell', (array) => {
    return array.filter((item, index) => {
      return array.indexOf(item) == index;
    });
  });

  inject('getAgeRoles', () => {
    return {
      adult: {
        min: 14,
        max: 99,
      },
      junior: {
        min: 7,
        max: 13,
      },
      child: {
        min: 3,
        max: 6,
      },
    };
  });

  inject('isTicketNeedSupervision', (ticketRoleAge, ageType) => {
    if (ageType == "adult") return false;
    const ageRoles = app.$getAgeRoles();
    let currentRole = ageRoles[ageType];
    if (ageType == 'child' && Number(ticketRoleAge) == 2) currentRole.min = 2;
    return ticketRoleAge <= currentRole.max ? false : true;
  });

  inject('handleDDLScroll', () => {
    let cardsContainer = document.querySelector(".cards-container");
    if (!cardsContainer) return false;
    let activeDDL = document.querySelector(".drop-down-list.ddlEnabled");
    if (activeDDL) {
      let spaceBtweenDDLandParent = activeDDL.offsetTop;
      let bottomBar = document.querySelector(".bottom-bar-wrapper");
      if (!bottomBar) return false;
      let bottomBarHeight = bottomBar.offsetHeight;
      let activeDDLHeight = activeDDL.offsetHeight;
      let activeDDLOffsetTop =
        activeDDL.offsetParent.offsetTop + spaceBtweenDDLandParent;
      let currentPage = document.querySelector(".booking-flow-container");
      if (!currentPage) return false;
      let pageHeight = currentPage.offsetHeight;
      let activeDDLOffsetBottom = activeDDLOffsetTop + activeDDLHeight;
      if (activeDDL.classList.contains("payment-drop-down-list")) {
        let pageHWithoutFooter = pageHeight - bottomBarHeight;
        let offsetT = activeDDL.offsetParent.offsetTop + activeDDL.offsetParent.offsetParent.offsetTop + activeDDL.offsetParent.offsetParent.offsetParent.offsetTop + activeDDL.offsetParent.offsetParent.offsetParent.offsetParent.offsetTop + activeDDL.offsetParent.offsetParent.offsetParent.offsetParent.offsetParent.offsetTop;
        if ((offsetT + activeDDL.offsetHeight) > pageHWithoutFooter) {
          cardsContainer.offsetParent.offsetParent.style.paddingBottom = `${((offsetT + activeDDL.offsetHeight) - pageHWithoutFooter) + 32}px`;
        }
      } else {
        let isSummaryBox = activeDDL.closest(".summary-tickets-container");
        if (isSummaryBox) {
          let realActiveDDLOffsetBottom = (isSummaryBox ? isSummaryBox.offsetTop : 0) + activeDDLOffsetBottom;
          if (realActiveDDLOffsetBottom > (pageHeight - bottomBarHeight)) {
            let diff = `${(realActiveDDLOffsetBottom - (pageHeight - bottomBarHeight) + 16)}px`;
            cardsContainer.style.paddingBottom = diff;
          }
        } else {
          let pageHWithoutFooter = pageHeight - bottomBarHeight;
          let offsetT = activeDDL.offsetHeight + activeDDL.offsetParent.offsetTop + activeDDL.offsetParent.offsetParent.offsetTop + activeDDL.offsetParent.offsetParent.offsetParent.offsetTop + spaceBtweenDDLandParent;
          if (offsetT > pageHWithoutFooter) {
            let diff = `${(offsetT - pageHWithoutFooter) + 32}px`;
            cardsContainer.offsetParent.offsetParent.style.paddingBottom = diff;
          }
        }
      }
    } else {
      let currentPage = document.querySelector(".booking-flow-container");
      if (!currentPage) return false;
      let pageHeight = currentPage.offsetHeight;
      let bottomBar = document.querySelector(".bottom-bar-wrapper");
      if (!bottomBar) return false;
      let bottomBarHeight = bottomBar.offsetHeight;

      let pageHWithoutFooter = pageHeight - bottomBarHeight;
      let activeDDL = document.querySelector(".time-slot-table.ddlEnalbed");
      if (!activeDDL) return false;
      let offsetT = activeDDL.offsetHeight + activeDDL.offsetTop + activeDDL.offsetParent.offsetTop + activeDDL.offsetParent.offsetParent.offsetTop + activeDDL.offsetParent.offsetParent.offsetParent.offsetTop;
      if (offsetT > pageHWithoutFooter) {
        let diff = `${(offsetT - pageHWithoutFooter) + 32}px`;
        cardsContainer.offsetParent.offsetParent.style.paddingBottom = diff;
      }
    }
  });

  inject('restContainerPadding', () => {
    let cardsContainer = document.querySelector(".cards-container");
    cardsContainer.style.paddingBottom = null;
    cardsContainer.offsetParent.offsetParent.style.paddingBottom = null;
  });

  inject('deepCloneArray', (array) => {
    return JSON.parse(JSON.stringify(array));
  });

  inject('stringToDate', (date) => {
    return typeof date === "string" ? new Date(date) : date;
  });

  inject('isPastDate', (date) => {
    if (!date) return false;
    let dateValue = app.$stringToDate(date);
    let today = new Date().setHours(0, 0, 0, 0);
    if (dateValue.valueOf() < today.valueOf()) return true;
    return false;
  });

  inject('getNextDates', (date) => {
    const nextDateAfterTheSelectedDate = new Date(date);
    nextDateAfterTheSelectedDate.setDate(date.getDate() + 1);
    return nextDateAfterTheSelectedDate;
  });

  inject('getNextDayDate', () => {
    return app.$getNextDates(new Date());
  });

  inject('updateAkAndRoute', async (id, bookingBarExperienceID, cardType, passesData = {}) => {
    if (!passesData) return false;

    let membershipUserID = passesData.userID;
    let bookingRoute = "add-ons";
    if (cardType == "membership") {
      bookingRoute = "personal-details";
      membershipUserID = passesData.userID;
      if (membershipUserID) {
        let ageType = passesData.ageType;
        app.store.commit("bookingBar/setFilterData", {
          "experience": {
            "title": "SNOW PARK",
            "value": "slopeAccess",
            "route": "snowpark",
            "ski_school_experience_category_type": 0,
            "id": "a6bc5555-045f-47bb-b70b-918d1a6af8cf"
          },
          "date": {
            "fullDate": "",
            "shortDate": "",
            "selectedDate": new Date()
          },
          people: {
            adult: ageType == 'adult' ? 1 : 0,
            junior: ageType == 'junior' ? 1 : 0,
            child: ageType == 'child' ? 1 : 0,
          },
          "age": {
            "id": 0,
            "title": 0
          },
          "level": {
            "id": 0,
            "title": 0
          }
        });
      }
      //
    } else if (cardType == "passes") {
      if (passesData.max_number_per_table > 0 || passesData.is_movie || !app.$isEmptyObject(passesData.upgrade_ticket || {})) {
        bookingRoute = "add-activity";
      } else if (passesData.tickets && passesData.tickets[0]) {
        let cardTypeChecker = await app.$repositories.isTimeBasedEvent(passesData.tickets[0].adult_ak);
        let isTimeBased = cardTypeChecker.isTimeBased;
        bookingRoute = isTimeBased ? "add-activity" : "add-ons";
      }
    } else if (cardType == "lessons") {
      bookingRoute = "add-activity";
    } else {
      //
      if (passesData.tickets.length > 1) {
        bookingRoute = "add-activity";
      } else {
        if (!app.$isEmptyObject(passesData.upgrade_ticket || {})) {
          bookingRoute = "add-activity";
        } else {
          let cardTypeChecker = await app.$repositories.isTimeBasedEvent(passesData.tickets[0].adult_ak);
          let isTimeBased = cardTypeChecker.isTimeBased;
          bookingRoute = isTimeBased ? "add-activity" : "add-ons";
        }
      }
    }
    //
    let bookingBarData = app.$deepCloneArray(app.store.state.bookingBar.data);
    if (!app.$isEmptyObject(bookingBarData || {})) {
      if (!app.$isEmptyObject(bookingBarData.date || {})) {
        let date = new Date(bookingBarData.date.selectedDate);
        if (app.$isPastDate(date)) {
          bookingBarData["date"] = {
            "fullDate": "",
            "shortDate": "",
            "selectedDate": new Date()
          };
          app.store.commit("bookingBar/setFilterData", bookingBarData);
        }
      }
    }
    //
    let path = window.location.pathname + window.location.search;
    let data = {
      id: id,
      path: path,
      bookingBarExperienceID: bookingBarExperienceID,
      cardType: cardType,
      membershipUserID: membershipUserID,
      parent_card_id: passesData.parent_id
    };
    //
    app.store.commit("bookingFlow/SET_TEMP_CARD", data);
    app.router.push(app.localePath(`/booking/${bookingRoute}`));
  });

  inject('calculatePackageAddOnsTotalPrice', (packageDetails) => {
    let addOnsSelection = packageDetails["addOnsSelection"] || [];
    let total = 0;
    for (let index = 0; index < addOnsSelection.length; index++) {
      total += addOnsSelection[index].counter * addOnsSelection[index].amount;
    }
    return total;
  });

  inject('isUpgradedTicket', (packageDetails) => {
    return (packageDetails && packageDetails.upgradeSelection && packageDetails.upgradeSelection.isUpgradeEnabled) || false;
  });

  inject('calculatePackageTotalPrice', (packageDetails) => {
    let price = packageDetails.card.price;
    if (packageDetails.card.is_table) {
      let adult = packageDetails.people.adult;
      let junior = packageDetails.people.junior;
      let child = packageDetails.people.child;
      let totalGuest = adult + junior + child;
      return price * totalGuest;
    } else if (packageDetails.cardType == "packages") {
      let guestCount = 0;
      let adult = packageDetails.people.adult.length;
      let child = packageDetails.people.child.length;
      let junior = packageDetails.people.junior.length;
      guestCount = adult + child + junior;

      return price * guestCount;
    } else if (packageDetails.cardType == "passes") {
      let adult = packageDetails.people.adult;
      let junior = packageDetails.people.junior;
      let child = packageDetails.people.child;
      let totalGuest = adult + junior + child;
      let isUpgradeEnabled = app.$isUpgradedTicket(packageDetails);
      return (isUpgradeEnabled ? packageDetails.upgrade_ticket.price : price) * totalGuest;
    } else if (packageDetails.cardType == "lessons") {
      let adult = packageDetails.people.adult;
      let junior = packageDetails.people.junior;
      let child = packageDetails.people.child;
      let totalGuest = adult + junior + child;
      //
      if (packageDetails.card.every_range_of_booking === 1 || packageDetails.card.every_range_of_booking === 2) {
        // camp
        let days_of_booking = packageDetails.card.days_of_booking === 0 ? 1 : packageDetails.card.days_of_booking;
        //
        return (price * totalGuest) * days_of_booking;
        //
      } else {
        if (packageDetails.tickets[0].additional_ak) {
          let additional_price = packageDetails.card.additional_price;
          return price + ((totalGuest - 1) * additional_price);
        } else {
          return price * totalGuest;
        }
      }
      //
    }
    return 0;
  });

  inject('isPackageAlreadyInStore', (cardID, date) => {
    let bookingData = app.store.state.bookingFlow.bookingData;
    for (let index = 0; index < bookingData.length; index++) {
      if (bookingData[index].cardID == cardID) {
        if (app.$stringToDate(bookingData[index].date).setHours(0, 0, 0, 0) === app.$stringToDate(date).setHours(0, 0, 0, 0)) return true;
      }
    }
    return false;
  });

  inject('isPackageAlreadyInStoreByUniqeID', (uniqueID) => {
    let bookingData = app.store.state.bookingFlow.bookingData;
    for (let index = 0; index < bookingData.length; index++) {
      if (
        bookingData[index].uniqueID == uniqueID
      ) return true;
    }
    return false;
  });

  inject('getPackageIndexInStoreByUniqeID', (uniqueID) => {
    let bookingData = app.store.state.bookingFlow.bookingData;
    for (let index = 0; index < bookingData.length; index++) {
      if (bookingData[index].uniqueID == uniqueID) return index;
    }
    return -1;
  });

  inject('clearBookingSession', () => {
    app.store.dispatch("bookingFlow/clearCartAndBookingFlowInfo");
    app.store.dispatch("bookingFlow/clearBookingSessionTimer");
    app.store.commit("paymentCards/SET_CARDS", []);
    sessionStorage.removeItem('token')
  });

  inject('isTherePackagesInStore', () => {
    let bookingData = app.store.state.bookingFlow.bookingData;
    return !!bookingData.length > 0;
  });

  inject('firstPackageToStartSession', () => {
    if (!app.$isTherePackagesInStore()) {
      app.store.dispatch("bookingFlow/startBookingSession");
    }
  });

  inject('setDataToStore', (data) => {
    app.store.commit("bookingFlow/SET_BOOKING_DATA", data);
    app.store.commit("bookingFlow/SET_TEMP_CARD", {});
  });

  inject('preparePackage', (packageDetails) => {
    let data = {};
    if (packageDetails.card) {
      data["title"] = packageDetails.card.title;
      data["booking_bar_experience"] = packageDetails.booking_bar_experience;
      data["uniqueID"] = packageDetails.uniqueID;
      data["price"] = packageDetails.card.price;
      data["dates"] = packageDetails.dates;
      data['item'] = packageDetails
      if (packageDetails.people) data["people"] = packageDetails.people;

      if (packageDetails.cardType == "passes") {
        if (packageDetails.isPassTimebased) {
          data["isPassTimebasedSelection"] = packageDetails.isPassTimebasedSelection;
        } else if (packageDetails.upgradeSelection) {
          data["upgradeSelection"] = packageDetails.upgradeSelection;
        }
      }

      if (packageDetails.cardType == "lessons") {
        if (packageDetails.isPassTimebased) {
          data["isPassTimebasedSelection"] = packageDetails.isPassTimebasedSelection;
        }
      }

      if (packageDetails.guestSelection)
        data["guestSelection"] = packageDetails.guestSelection;
      if (packageDetails.bonus_ticketSelection)
        data["bonus_ticketSelection"] = packageDetails.bonus_ticketSelection;
      if (packageDetails.bonusSelection)
        data["BonusTicketViewModel"] = packageDetails.bonusSelection;
      if (packageDetails.date) data["date"] = packageDetails.date;
      if (packageDetails.tableSelection)
        data["tableSelection"] = packageDetails.tableSelection;
      if (packageDetails.card) data["cardID"] = packageDetails.card.id;
      data["addOnsSelection"] = packageDetails.addOnsSelection;

      if (packageDetails.assignedUsers) data["assignedUsers"] = packageDetails.assignedUsers;

      data["booking_bar"] = packageDetails.booking_bar;


      data['cardType'] = packageDetails.cardType
      data['localizedTitle'] = packageDetails.localizedTitle
    }
    return data;
  });

  inject('saveCurrentPackage', (packageDetails) => {
    // This case happens when no package or pass is selected so there is no changes, and we should escape this point.
    if (app.$isEmptyObject(packageDetails || {})) return true;

    if (!app.$isPackageAlreadyInStore(packageDetails.card.id, packageDetails.date)) {
      app.$repositories.addToCartEvent(packageDetails);
    }

    app.$firstPackageToStartSession();
    let tempPackage = app.$preparePackage(packageDetails);
    if (app.$isTherePackagesInStore()) {
      let bookingData = app.$deepCloneArray(
        app.store.state.bookingFlow.bookingData
      );
      if (app.$isPackageAlreadyInStoreByUniqeID(packageDetails.uniqueID)) {
        let packageIndex = app.$getPackageIndexInStoreByUniqeID(
          packageDetails.uniqueID
        );
        let booking_bar_old = bookingData[packageIndex].booking_bar;
        bookingData[packageIndex] = tempPackage;
        bookingData[packageIndex].booking_bar = booking_bar_old;
        app.$setDataToStore(bookingData);
      } else {
        bookingData.unshift(tempPackage);
        app.$setDataToStore(bookingData);
      }
    } else {
      app.$setDataToStore([tempPackage]);
    }
  });

  inject('getNumber', (data) => {
    return typeof data === "object" ? data.length : data;
  });

  inject('completePurchase', (reservationCode, isUnCertain = false) => {
    app.store.commit("bookingBar/setFilterData", {});
    let token = app.$repositories.getGuestJWT()
    app.$clearBookingSession();

    CommonEvent.$emit('global-loader', false)
    let query = '?fromBooking=true'
    if (token) {
      query += `&token=${token}`
    }

    if (isUnCertain) {
      query += `&isUnCertain=true`;
    }

    setTimeout(() => {
      app.router.push(app.localePath(`/booking-confirmed/${reservationCode}${query}`));
    });
  });

  inject('preCheckout', async (data, paymentType) => {
    data["returnUrl"] = `${location.origin}${app.localePath("/booking-redirect")}`;
    data["cartId"] = app.store.state.bookingFlow.reservationCode;
    try {
      let header = {
        "Payment-Type": paymentType,
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*", // Allow from anywhere
        "Access-Control-Allow-Methods": "*", // Allow only GET request
      };

      if (app.$isUserAuthenticated()) {
        data.isIgnoreCachedToken = true;
      } else {
        header["X-Access-Token"] = app.$repositories.getGuestJWT();
      }

      let config = {
        method: "post",
        url: `${process.env.SHARED_ENVS.APIGEE_BASE_URL}/order/checkout`,
        headers: header,
        data: data,
      };

      let response = await app.$axios(config);

      return response;
    } catch (error) {
      return error.response;
    }
  });

  inject('getPromoCode', (discount) => {
    for (let index = 0; index < discount.length; index++) {
      if (discount[index].discountType == "PromoCode")
        return discount[index].couponCode;
    }
    return "";
  });

  inject('isThereAPromoCode', (discount) => {
    for (let index = 0; index < discount.length; index++) {
      if (discount[index].discountType == "PromoCode") return true;
    }
    return false;
  });

  inject('getShareAmount', (discount) => {
    for (let index = 0; index < discount.length; index++) {
      if (discount[index].discountType == "share")
        return discount[index].aedAmount;
    }
    return 0;
  });

  inject('isThereAShareApplied', (discount) => {
    for (let index = 0; index < discount.length; index++) {
      if (discount[index].discountType == "share") return true;
    }
    return false;
  });

}
