import uniqBy from 'lodash/uniqBy';

export default ({app}) => ({
  getGtmProduct(card) {
    const siteConfig = app.$getSiteConfig();
    let cardType = this.getCardType(card.card_type_id === 2 ? "Package" : 'Passes');
    let cardTitle = card.localized_title ? card.localized_title.en : card.title;
    let gtmCategory = card.gtm && card.gtm.gtm_category ? card.gtm.gtm_category : {}
    return {
      item_id: (card.card_details_id || card.id || card.ak || '').toLowerCase(), //Type: String
      item_name: cardTitle, //Type: String
      affiliation: window.location.origin, //Type: String
      coupon: "", //Type: String
      currency: siteConfig.currency('en'), //Type: String
      discount: 0, //Type: Float
      index: 1, //Type: Integer, Desciption: Position in the list
      item_brand: siteConfig.title, //Type: String
      item_category: gtmCategory.category_one || cardType, //Type: String, Description: Main category of the product
      item_category2: gtmCategory.category_two || cardTitle, //Type: String, Description: Type of the product
      item_category3: gtmCategory.category_three || '', //Type: String, Description: Category of the product
      item_category4: gtmCategory.category_four || '', //Type: String, Description: Level of expertise
      item_category5: gtmCategory.category_five || '', //Type: Integer, Description:  Age groups
      item_list_id: (card.parent_id || card.id || '').toLowerCase(), //Type: String
      item_list_name: cardTitle, //Type: String
      item_variant: card.description || '', //Type: String, Description: Type of activities
      age_category: card.label_text || card.age || '', //Type: String
      exp_category: cardType, //Type: String
      number_of_lessons: 0, //Type: Integer
      lesson_type: "", //Type: String
      location_id: "", //Type: String
      price: parseFloat(app.$decimalPlaces(card.price)), //Type: Float
      quantity: card.quantity ? card.quantity : 1 //Type: Integer
    }
  },
  /**
   * Fire When a user add guest and after click the "Save and continue" button
   *
   * @param {string} bookingReference
   * @param {Array} eventDates
   */
  assignGuestEvent(bookingReference, eventDates) {
    let gtmRequest = {
      'event': 'custom_event',
      'event_category': 'booking_funnel',
      'event_action': 'add_guest',
      'event_label': bookingReference,
      'event_non_interaction': false,
      'booking_reference': bookingReference,
      'booking_visit_date': eventDates[0] ? eventDates[0] : ''
    }
    app.$sendGtmEvent(gtmRequest)
  },
  /**
   * Fire When a user add gear and after click the "Save and continue" button
   *
   * @param {string} bookingReference
   * @param {string} gears all selected gear for users
   * @param {string} equipments all selected equipments for users
   * @param {Array} eventDates
   */
  addGearEvent(bookingReference, gears, equipments, eventDates) {

    let gtmRequest = {
      'event': 'custom_event',
      'event_category': 'booking_funnel',
      'event_action': 'add_gear',
      'event_label': equipments,
      'event_non_interaction': false,
      'booking_gear': gears,
      'booking_reference': bookingReference,
      'booking_visit_date': eventDates[0] ? eventDates[0] : ''
    }
    app.$sendGtmEvent(gtmRequest)
  },
  /**
   * Fire on All Done Page When the user complete the booking successfully
   *
   * @param {string} bookingReference
   * @param {Array} eventDates
   */
  bookingCompleteEvent(bookingReference, eventDates) {
    let gtmRequest = {
      'event': 'custom_event',
      'event_category': 'booking_funnel',
      'event_action': 'booking_complete',
      'event_label': true,
      'event_non_interaction': false,
      'booking_complete': true,
      'booking_reference': bookingReference,
      'booking_visit_date': eventDates[0] ? eventDates[0] : ''
    }
    app.$sendGtmEvent(gtmRequest)
  },
  /**
   * Fire When the user comes to review and sign step
   *
   * @param {string} bookingReference
   * @param {Array} eventDates
   */
  addWaiverEvent(bookingReference, eventDates) {
    let gtmRequest = {
      'event': 'custom_event',
      'event_category': 'booking_funnel',
      'event_action': 'sign_waiver',
      'event_label': null,
      'event_non_interaction': false,
      'booking_reference': bookingReference,
      'booking_visit_date': eventDates[0] ? eventDates[0] : ''
    }
    app.$sendGtmEvent(gtmRequest)
  },
  /**
   * Fire When user clicks a menu item
   *
   * @param {string} cat1  ex:passes and packages (item category)
   * @param {string} cat2  ex:membership (item category)
   * @param {string} cat3  ex:ski snowboard (item category)
   * @param {string} type  ex:header, hamburger, footer
   */
  menuEvent(cat1, cat2, cat3, type) {
    const event = {
      'event': 'custom_event',
      'event_category': 'click',
      'event_action': app.$detectMobile ? 'hamburger_menu' : 'header',
      'event_label': cat1 ? cat1.toLowerCase() : '',
      'event_non_interaction': false,
      'menu_type': type,
      'menu_cat1': cat1 ? cat1.toLowerCase() : '',
      'menu_cat2': cat2 ? cat2.toLowerCase() : '',
      'menu_cat3': cat3 ? cat3.toLowerCase() : '',
    }
    app.$sendGtmEvent(event)
  },
  /**
   * Fire When user add item to cart
   *
   * @param {Array} packageDetails  ex:passes and packages (item)
   */
  addToCartEvent(packageDetails) {
    app.$sendGtmEvent({ecommerce: null});

    let item = packageDetails.card
    item.quantity = item.people ? item.people.adult + item.people.junior + item.people.child : 1

    const gtmRequest = {
      event: "ecom_event",
      event_category: "ecommerce",
      event_action: "add_to_cart",
      event_label: null,
      event_non_interaction: false,
      ecommerce: {
        items: [this.getGtmProduct(item)]
      },
    };
    app.$sendGtmEvent(gtmRequest);
  },
  /**
   * Fire When user clicks app install icons
   *
   * @param {string} type  ex:app store, play store
   */
  installAppEvent(type) {
    const event = {
      'event': 'custom_event',
      'event_category': 'click',
      'event_action': 'app_install',
      'event_label': type,
      'event_non_interaction': false,
      'app_store_name': type
    }

    app.$sendGtmEvent(event)
  },
  /**
   * Fire When user add info in booking flow (booking bar button)
   *
   * @param {Array} purchaseCategory  ex:passes,packages
   * @param {Array} items
   */
  addUserInfoEvent(purchaseCategory, items) {
    app.$sendGtmEvent({ecommerce: null})
    const currency = app.$getSiteConfig('currency', 'en')
    let gtmRequest = {
      event: "ecom_event",
      event_category: "ecommerce",
      event_action: "add_user_info",
      event_label: null,
      event_non_interaction: true,
      ecommerce: {
        currency: currency, //Type: String
        value: parseFloat(app.$decimalPlaces(app.store.getters['bookingFlow/totalAmount'] ? app.store.getters['bookingFlow/totalAmount'].GROSS : 0)), //Type: Float
        purchase_category: purchaseCategory.join(' and '),
        items: items
      }
    }
    app.$sendGtmEvent(gtmRequest)
  },
  /**
   * Fire When user click on go to details page btn
   *
   * @param {Object} card  selected card
   * @param {Array} packagesData   Package under the selected tab
   */
  selectItemEvent(card, packagesData) {
    const siteConfig = app.$getSiteConfig();

    const currency = siteConfig.currency('en')
    const locationTitle = siteConfig.title

    let cardTitle = card.localized_title ? card.localized_title.en : card.title
    let gtmCategory = card.gtm && card.gtm.gtm_category ? card.gtm.gtm_category : {}

    let data = {
      item_id: packagesData.id, //Type: String
      item_name: cardTitle, //Type: String
      affiliation: process.env.SHARED_ENVS.WEB_BASE_URL, //Type: String
      coupon: "", //Type: String
      currency: currency, //Type: String
      discount: 0, //Type: Float
      index: 1, //Type: Integer, Desciption: Position in the list
      item_brand: locationTitle, //Type: String
      item_category: gtmCategory.category_one || (card.card_type_id === 2 ? "Package" : "Passes"), //Type: String, Description: Main category of the product
      item_category2: gtmCategory.category_two || cardTitle, //Type: String, Description: Type of the product
      item_category3: gtmCategory.category_three || '', //Type: String, Description: Category of the product
      item_category4: gtmCategory.category_four || '', //Type: String, Description: Level of expertise
      item_category5: gtmCategory.category_five || '', //Type: Integer, Description:  Age groups
      item_list_id: packagesData.parent_id || card.id, //Type: String
      item_list_name: cardTitle, //Type: String
      item_variant: "", //Type: String, Description: Type of activities
      age_category: "", //Type: String
      exp_category: "", //Type: String
      number_of_lessons: card.is_membership ? 1 : 0, //Type: Integer
      lesson_type: cardTitle, //Type: String
      location_id: "", //Type: String
      price: parseFloat(app.$decimalPlaces(card.price)), //Type: Float
      quantity: 1, //Type: Integer
    };
    let gtmRequest = {
      event: "ecom_event",
      event_category: "ecommerce",
      event_action: "select_item",
      event_label: null,
      event_non_interaction: true,
      ecommerce: {
        items: [data],
      },
    };
    app.$sendGtmEvent(gtmRequest);
  },
  /**
   * Fire When user clicks a social media button
   * @param {Object} item ex:facebook, twitter, instagram, whatsapp
   **/
  socialMediaEvent(item) {
    const event = {
      event: "custom_event",
      event_category: "click",
      event_action: "social_media_icon",
      event_label: (item.icon.title ? item.icon.title : '').toLowerCase(),
      event_non_interaction: false,
      social_media_icon_name: (item.icon.title ? item.icon.title : '').toLowerCase(),
    };
    app.$sendGtmEvent(event);
  },
  /**
   * Fire When user click onView Cart
   **/
  viewCartEvent(cartItems) {
    app.$sendGtmEvent({ecommerce: null});
    let items = [];
    const siteConfig = app.$getSiteConfig();
    const currency = siteConfig.currency('en')
    const locationTitle = siteConfig.title

    cartItems.forEach((item) => {
      let cardType = this.getCardType(item.cardType)
      let cardTitle = item.localized_title ? item.localized_title.en : item.title

      items.push({
        item_id: item.cardID, //Type: String
        item_name: cardTitle, //Type: String
        affiliation: process.env.SHARED_ENVS.WEB_BASE_URL, //Type: String
        coupon: "", //Type: String
        currency: currency, //Type: String
        discount: 0, //Type: Float
        index: 1, //Type: Integer, Desciption: Position in the list
        item_brand: locationTitle, //Type: String
        item_category: cardType, //Type: String, Description: Main category of the product
        item_list_id: item.cardID, //Type: String
        item_list_name: cardType, //Type: String
        item_variant: "", //Type: String, Description: Type of activities
        age_category: "", //Type: String
        exp_category: "", //Type: String
        number_of_lessons: 1, //Type: Integer
        lesson_type: "", //Type: String
        location_id: "", //Type: String
        price: parseFloat(app.$decimalPlaces(item.price)), //Type: Float
        quantity: item.people ? item.people.adult + item.people.junior + item.people.child : 1,
      });
    });
    let gtmRequest = {
      event: "ecom_event",
      event_category: "ecommerce",
      event_action: "view_cart",
      event_label: null,
      event_non_interaction: true,
      ecommerce: {
        items: items,
      },
    };
    app.$sendGtmEvent(gtmRequest);
  },
  /**
   * Fire When user click logout
   **/
  logoutEvent() {
    const event = {
      event: "custom_event",
      event_category: "click",
      event_action: 'membership',
      event_label: "logout",
      event_non_interaction: false,
    };

    app.$sendGtmEvent(event);
  },
  /**
   * Fire When user click logout
   **/
  addPaymentInfoEvent(packages, cardBrand, amount) {
    let purchaseCategory = [];
    let items = [];

    const siteConfig = app.$getSiteConfig();

    const currency = siteConfig.currency('en')
    const locationTitle = siteConfig.title

    packages.map((item, index) => {
      let cardType = this.getCardType(item.cardType)
      if (!purchaseCategory.includes(cardType)) {
        purchaseCategory.push(cardType);
      }

      let cardTitle = item.card.localized_title ? item.card.localized_title.en : item.card.title

      if (item.cardType === 'packages') {
        for (let k in item.people) {
          for (let i = 0; i < item.people[k].length; i++) {

            let card = {...item.card}
            card.id = item.people[k][i].id
            card.parent_id = item.card.id
            card.age = k === 'adult' ? "age 14+" : k === 'child' ? `age 3-7` : 'age 7-14'
            let gtmCategory = card.gtm && card.gtm.gtm_category ? card.gtm.gtm_category : {}

            items.push({
              item_id: card.id, //Type: String
              item_name: cardTitle, //Type: String
              affiliation: process.env.SHARED_ENVS.WEB_BASE_URL, //Type: String
              coupon: "", //Type: String
              currency: currency, //Type: String
              discount: 0, //Type: Float
              index: index, //Type: Integer, Desciption: Position in the list
              item_brand: locationTitle, //Type: String
              item_category: gtmCategory.category_one || cardType, //Type: String, Description: Main category of the product
              item_category2: gtmCategory.category_two || cardTitle, //Type: String, Description: Type of the product
              item_category3: gtmCategory.category_three || '', //Type: String, Description: Category of the product
              item_category4: gtmCategory.category_four || '', //Type: String, Description: Level of expertise
              item_category5: gtmCategory.category_five || '', //Type: Integer, Description:  Age groups
              item_list_id: card.parent_id, //Type: String
              item_list_name: cardTitle, //Type: String
              item_variant: "", //Type: String, Description: Type of activities
              age_category: card.age, //Type: String
              exp_category: "", //Type: String
              number_of_lessons: 0, //Type: Integer
              lesson_type: "", //Type: String
              location_id: "", //Type: String
              price: parseFloat(app.$decimalPlaces(item.card.price)), //Type: Float
              quantity: 1, //Type: Integer
            });
          }
        }
      } else {
        let gtmItem = {...item.card}
        gtmItem.id = item.tickets[0].id
        gtmItem.parent_id = item.card.id
        let gtmCategory = gtmItem.gtm && gtmItem.gtm.gtm_category ? gtmItem.gtm.gtm_category : {}

        items.push({
          item_id: gtmItem.id, //Type: String
          item_name: cardTitle, //Type: String
          affiliation: process.env.SHARED_ENVS.WEB_BASE_URL, //Type: String
          coupon: "", //Type: String
          currency: currency, //Type: String
          discount: 0, //Type: Float
          index: index, //Type: Integer, Desciption: Position in the list
          item_brand: locationTitle, //Type: String
          item_category: gtmCategory.category_one || cardType, //Type: String, Description: Main category of the product
          item_category2: gtmCategory.category_two || '', //Type: String, Description: Type of the product
          item_category3: gtmCategory.category_three || '', //Type: String, Description: Category of the product
          item_category4: gtmCategory.category_four || '', //Type: String, Description: Level of expertise
          item_category5: gtmCategory.category_five || '', //Type: Integer, Description:  Age groups
          item_list_id: gtmItem.parent_id, //Type: String
          item_list_name: cardTitle, //Type: String
          item_variant: "", //Type: String, Description: Type of activities
          age_category: "", //Type: String
          exp_category: "", //Type: String
          number_of_lessons: 0, //Type: Integer
          lesson_type: "", //Type: String
          location_id: "", //Type: String
          price: parseFloat(app.$decimalPlaces(item.card.price)), //Type: Float
          quantity: 1, //Type: Integer
        });
      }
    });
    let gtmRequest = {
      event: "ecom_event",
      event_category: "ecommerce",
      event_action: "add_payment_info",
      event_label: null,
      event_non_interaction: true,
      ecommerce: {
        currency: currency, //Type: String
        value: parseFloat(app.$decimalPlaces(amount.GROSS)), //Type: Float
        coupon: "", //Type: String
        payment_type: cardBrand, //Type: String
        checkout_type: app.$isUserAuthenticated() ? "member" : "guest", //Type: String, Description: Guest, Member
        purchase_category: purchaseCategory.join(" and "),
        items: items,
      },
    };
    app.$sendGtmEvent(gtmRequest);
  },
  /**
   * Fire When go to details page
   * @param {Object} data page data
   **/
  viewItemEvent(data) {
    app.$gtm.push({ecommerce: null});

    const packageItem = data.passes_and_packages_card || data.ski_school_card;
    const product = this.getGtmProduct(packageItem);
    const price = app.$getPackagePrice(packageItem);

    product.price = parseFloat(app.$decimalPlaces(price));

    let gtmRequest = {
      event: "ecom_event",
      event_category: "ecommerce",
      event_action: "view_item",
      event_label: null,
      event_non_interaction: true,
      ecommerce: {
        items: [product],
      },
    };
    app.$sendGtmEvent(gtmRequest);
  },
  /**
   * Fire When user remove items from cart
   * @param {Object} card selected card need to remove
   * @param {Object} packageItem selected package/ticket need to remove
   **/
  removeFromCartEvent(card, packageItem) {
    app.$sendGtmEvent({ecommerce: null});
    let items = [];
    const siteConfig = app.$getSiteConfig();

    const currency = siteConfig.currency('en')
    const locationTitle = siteConfig.title

    let cardType = this.getCardType(packageItem.cardType)
    let cardTitle = card.localized_title ? card.localized_title.en : card.title

    items.push({
      item_id: card.id, //Type: String
      item_name: cardTitle, //Type: String
      affiliation: process.env.SHARED_ENVS.WEB_BASE_URL, //Type: String
      coupon: "", //Type: String
      currency: currency, //Type: String
      discount: 0, //Type: Float
      index: 1, //Type: Integer, Desciption: Position in the list
      item_brand: locationTitle, //Type: String
      item_category: cardType, //Type: String, Description: Main category of the product
      item_list_id: card.id, //Type: String
      item_list_name: cardType, //Type: String
      item_variant: "", //Type: String, Description: Type of activities
      age_category: "", //Type: String
      exp_category: cardType, //Type: String
      number_of_lessons:
        packageItem.cardType !== "lessons" ? 0 : 1, //Type: Integer
      lesson_type: "", //Type: String
      location_id: "", //Type: String
      price: parseFloat(app.$decimalPlaces(card.price)), //Type: Float
      quantity: packageItem.people
        ? packageItem.people.adult +
        packageItem.people.junior +
        packageItem.people.child
        : 1,
    });
    let gtmRequest = {
      event: "ecom_event",
      event_category: "ecommerce",
      event_action: "remove_from_cart",
      event_label: null,
      event_non_interaction: false,
      ecommerce: {
        items: items,
      },
    };
    app.$sendGtmEvent(gtmRequest);
  },
  /**
   * Fire When user click login
   **/
  loginEvent() {

    let user = app.store.getters["currentUser/userInformation"] ? app.store.getters["currentUser/userInformation"] : {}
    const event = {
      event: "custom_event",
      event_category: "membership",
      event_action: "login",
      event_label: null,
      event_non_interaction: false,
      user: {
        'id': user.mafid,
        'hashed_email': user.email,
        'hashed_phone': user.mobile,
        'registration_date': '',
        'registration_timestamp': 0,
        'type': user.mafid ? 'existing member' : 'guest',
        'country': user.country_of_residence,
        'city': '',
        'gender': user.title,
        'firstName': user.firstName,
        'lastName': user.lastName,
        'dob': user.dateOfBirth,
        'nationality': user.nationality,
        'membership_status': true,
        'share_id': ((user.share || {}).memberID || '').toString()
      },
    };

    app.$sendGtmEvent(event);
  },
  /**
   * Fire When user select any content tab
   * @param {Object} tab selected tab
   * @param {Array} tabData selected packages/passes under the tab
   * @param {string} type category type
   * @param {string} level item level
   **/
  viewItemListEvent(detectedTab, tabData, type = '', level = '') {
    let items = [];
    let index = 0;

    if (tabData && tabData.length > 0) {
      const siteConfig = app.$getSiteConfig();

      const currency = siteConfig.currency('en')
      const locationTitle = siteConfig.title

      const tab = detectedTab || {};

      tabData.forEach((item) => {
        if (item.cards) {
          item.cards.map((card) => {
            if (card.id) {
              let cardTitle = card.localized_title ? card.localized_title.en : card.title
              const price = app.$getPackagePrice(card);
              let gtmCategory = card.gtm && card.gtm.gtm_category ? card.gtm.gtm_category : {}

              let data = {
                item_id: (card.id || '').toLowerCase(), //Type: String
                item_name: cardTitle, //Type: String
                affiliation: process.env.SHARED_ENVS.WEB_BASE_URL, //Type: String
                coupon: "", //Type: String
                currency: currency, //Type: String
                discount: 0, //Type: Float
                index: index, //Type: Integer, Desciption: Position in the list
                item_brand: locationTitle, //Type: String
                item_category: gtmCategory.category_one || (type.length > 0 ? type : tab.section_cards_type_id === 2 ? "Package" : "Passes"),
                item_category2: gtmCategory.category_two || tab.title, //Type: String, Description: Type of the product
                item_category3: gtmCategory.category_three || type, //Type: String, Description: Category of the product
                item_category4: gtmCategory.category_four || level, //Type: String, Description: Level of expertise
                item_category5: gtmCategory.category_five || '', //Type: Integer, Description:  Age groups
                item_list_id: (tab.id || '').toLowerCase(), //Type: String
                item_list_name: tab.title, //Type: String
                item_variant: "", //Type: String, Description: Type of activities
                age_category: card.label_text, //Type: String
                exp_category: tab.title || tab.name, //Type: String
                number_of_lessons: card.is_membership ? 1 : 0, //Type: Integer
                lesson_type: cardTitle || tab.name, //Type: String
                location_id: "", //Type: String
                price: parseFloat(price ? app.$decimalPlaces(price) : app.$decimalPlaces(card.price)), //Type: Float
                quantity: 1, //Type: Integer
              };
              items.push(data);
              index += 1;
            }
          });
        } else {
          if (item && item.id) {
            let card = item
            let cardTitle = card.localized_title ? card.localized_title.en : card.title
            const price = app.$getPackagePrice(card);
            let gtmCategory = card.gtm && card.gtm.gtm_category ? card.gtm.gtm_category : {}
            let data = {
              item_id: (card.id || '').toLowerCase(), //Type: String
              item_name: cardTitle, //Type: String
              affiliation: process.env.SHARED_ENVS.WEB_BASE_URL, //Type: String
              coupon: "", //Type: String
              currency: currency, //Type: String
              discount: 0, //Type: Float
              index: index, //Type: Integer, Desciption: Position in the list
              item_brand: locationTitle, //Type: String
              item_category: gtmCategory.category_one || (type.length > 0 ? type : tab.section_cards_type_id === 2 ? "Package" : "Passes"),
              item_category2: gtmCategory.category_two || tab.title, //Type: String, Description: Type of the product
              item_category3: gtmCategory.category_three || type, //Type: String, Description: Category of the product
              item_category4: gtmCategory.category_four || level, //Type: String, Description: Level of expertise
              item_category5: gtmCategory.category_five || '', //Type: Integer, Description:  Age groups
              item_list_id: (tab.id || '').toLowerCase(), //Type: String
              item_list_name: tab.title, //Type: String
              item_variant: "", //Type: String, Description: Type of activities
              age_category: card.label_text, //Type: String
              exp_category: tab.title || tab.name, //Type: String
              number_of_lessons: card.is_membership ? 1 : 0, //Type: Integer
              lesson_type: cardTitle || tab.name, //Type: String
              location_id: "", //Type: String
              price: parseFloat(price ? app.$decimalPlaces(price) : app.$decimalPlaces(card.price)), //Type: Float
              quantity: 1, //Type: Integer
            };
            items.push(data);
            index += 1;
          }
        }
      });

      let gtmRequest = {
        event: "ecom_event",
        event_category: "ecommerce",
        event_action: "view_item_list",
        event_label: null,
        event_non_interaction: true,
        ecommerce: {
          items: uniqBy(items, 'item_id'),
        },
      };
      app.$sendGtmEvent(gtmRequest);
    }
  },
  /**
   * Fire When user start booking flow
   **/
  beginCheckoutEvent(packages) {
    let items = []
    let purchaseCategory = [];
    packages.forEach((item) => {
      let cardType = this.getCardType(item.cardType)
      if (!purchaseCategory.includes(cardType)) {
        purchaseCategory.push(cardType);
      }
    });

    items = this.getBookingGtmItems(packages, true, true)

    app.$sendGtmEvent({ecommerce: null});

    let ecommerce_value = app.store.state.bookingFlow.totalAmount
      ? app.store.state.bookingFlow.totalAmount.GROSS
      : 0.0;
    ecommerce_value = parseFloat(app.$decimalPlaces(ecommerce_value));
    const currency = app.$getSiteConfig('currency', 'en')

    const gtmRequest = {
      event: "ecom_event",
      event_category: "ecommerce",
      event_action: "begin_checkout",
      event_label: null,
      event_non_interaction: true,
      ecommerce: {
        currency: currency, //Type: String
        value: ecommerce_value, //Type: Float
        purchase_category: purchaseCategory.join(" and "),
        items: items,
      },
    };
    app.$sendGtmEvent(gtmRequest);
  },
  /**
   * Fire When user complete the booking flow
   **/
  purchaseEvent(discount, trxReference, total, totalTax, paymentMethod, purchaseCategory, items, eventDate) {
    const currency = app.$getSiteConfig('currency', 'en')

    let event = {
      event: "ecom_event",
      event_category: "ecommerce",
      event_action: "purchase",
      event_label: null,
      event_non_interaction: false,
      ecommerce: {
        transaction_id: trxReference, //Type: String
        affiliation: process.env.SHARED_ENVS.WEB_BASE_URL, //Type: String
        value: total, //Type: Float
        tax: totalTax, //Type: Float
        shipping: 0.00, //Type: Float
        currency: currency, //Type: String
        coupon: discount ? discount.couponCode || discount : '', //Type: String
        checkout_type: app.$isUserAuthenticated() ? 'member' : "guest", //Type: String, Description: Guest, Member
        payment_type: paymentMethod || '', //Type: String
        purchase_category: purchaseCategory.join(' and '),
        items: items,
        booking_visit_date: eventDate
      }
    }
    app.$sendGtmEvent(event)
  },
  getCardType(type) {
    if (!type) return ''
    type = type.toLowerCase()
    if (type === 'lessons' || type === 'ski_school') {
      return 'ski school'
    } else if (type === 'pass') {
      return 'passes'
    }

    return type
  },
  sendPvEvent() {
    let user = app.store.getters["currentUser/userInformation"] ? app.store.getters["currentUser/userInformation"] : {}

    let locale = app.i18n.locale
    let path = window.location.pathname.split(`/${locale}/`).filter(item => item.length > 0)
    let category = ''

    if (window.location.pathname === `/${locale}`) {
      category = 'home'
    } else {
      category = path[0].split('/')[0].replace('/', '')
    }
    let title = document.title || ''
    let pvEvent = {
      'event': 'virtual_pv',
      'user': {
        'id': user.mafid,
        'hashed_email': user.email,
        'hashed_phone': user.mobile,
        'registration_date': '',
        'registration_timestamp': 0,
        'type': user.mafid ? 'existing member' : 'guest',
        'country': user.country_of_residence,
        'city': '',
        'gender': user.title,
        'firstName': user.firstName,
        'lastName': user.lastName,
        'dob': user.dateOfBirth,
        'nationality': user.nationality,
        'membership_status': true,
        'share_id': ((user.share || {}).memberID || '').toString()
      },
      'page': {
        'path': window.location.pathname,
        // eslint-disable-next-line no-undef
        'url': process.env.SHARED_ENVS.WEB_BASE_URL + window.location.pathname,
        'referral': process.env.SHARED_ENVS.WEB_BASE_URL + window.location.pathname,
        'location': process.env.SHARED_ENVS.WEB_BASE_URL + window.location.pathname,
        'type': '',
        'category': category,
        'title': title,
        'description_length': 148,
        'breadcrumb': '',
        'device': (navigator && navigator.userAgentData) ? navigator.userAgentData.platform : '',
        'platform': window.navigator.platform || 'web'
      }
    }
    app.$gtm.push(pvEvent)
  },
  getBookingGtmItems(packageDetails, flatItem = false, isBeginCheckout = false) {
    let items = []
    let savedItem = [...packageDetails]
    savedItem.map(item => {
      if (item.cardType === 'packages') {
        if (!isBeginCheckout) {
          for (let k in item.people) {
            for (let i = 0; i < item.people[k].length; i++) {
              let card = {...(flatItem ? item.card : item.item.card)}
              card.id = item.people[k][i].id
              card.parent_id = flatItem ? item.card.id : item.cardID
              card.age = k === 'adult' ? "age 14+" : k === 'child' ? `age 3-7` : 'age 7-14'
              card.quantity = item.people ? item.people.adult + item.people.junior + item.people.child : 1
              items.push(this.getGtmProduct(card))
            }
          }
        } else {
          for (let i = 0; i < item.tickets.length; i++) {
            let card = {...(flatItem ? item.card : item.item.card)}
            card.id = item.tickets[i].id
            card.parent_id = flatItem ? item.card.id : item.cardID
            card.age = item.tickets[i].minimum_age >= 14 ? "age 14+" : item.tickets[i].minimum_age < 7 ? `age 3-7` : 'age 7-14'
            items.push(this.getGtmProduct(card))
          }
        }
      } else {
        let gtmItem = {...(flatItem ? item.card : item.item.card)}
        gtmItem.id = flatItem ? item.tickets[0].id : item.item.tickets[0].id
        gtmItem.parent_id = flatItem ? item.card.id : item.cardID
        gtmItem.quantity = item.people ? item.people.adult + item.people.junior + item.people.child : 1
        items.push(this.getGtmProduct(gtmItem))
      }
    })

    return items
  },
  contactUsSubmitEvent() {
    app.$sendGtmEvent({
      'event': 'custom_event',
      'event_category': 'contact_us',
      'event_non_interaction': false
    })
  },
  updatesNewsletterEvent(email = '') {
    app.$sendGtmEvent({
      'event': 'custom_event',
      'event_category': 'get_updates',
      'email': email,
      'event_non_interaction': false
    })
  },
  shareRedeemPointEvent(redeemPoints, sharePointsBalance) {
    const gtmRequest = {
      'event': 'custom_event',
      'event_category': 'click',
      'event_action': 'redeem_points',
      'event_label': parseFloat(app.$decimalPlaces(redeemPoints)),
      'event_non_interaction': false,
      'redeem_points': parseFloat(app.$decimalPlaces(redeemPoints)),
      'share_point_balance': parseFloat(app.$decimalPlaces(sharePointsBalance))
    }
    app.$sendGtmEvent(gtmRequest)
  }
})
