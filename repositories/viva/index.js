import {CommonEvent} from "@/services/app-events";
import {AppConfig} from "@/const/variable";
import {Parser} from "xml2js";

import {globalHelpers} from "@/plugins/helpers";

import moment from "moment-timezone";

export default ({$axios, app}) => ({
  getVivaDateFormat(date) {
    // 2022-12-31
    let tempDate = app.$stringToDate(date);
    let day = tempDate.getDate();
    let dayLeadingZero = day >= 1 && day <= 9 ? `0${day}` : day;
    let month = tempDate.getMonth() + 1;
    let monthLeadingZero = month >= 1 && month <= 9 ? `0${month}` : month;
    let year = tempDate.getFullYear();
    let dateText = `${year}-${monthLeadingZero}-${dayLeadingZero}`;
    return dateText;
  },
  vivaAPIsHeader() {
    return {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      }
    };
  },
  async getCalendarAvailabilitySkiCamp(props) {
    let body = `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:WsAPIPerformacneIntf-IWsAPIPerformance" xmlns:ovw7="http://omniticket.network/ovw7">
                            <soapenv:Header/>
                            <soapenv:Body>
                            <urn:SearchCalendarAvailability soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                                <ovw7:SEARCHCALENDARAVAILABILITYREQ>
                                <PERFORMANCECATEGORYLIST xsi:type="ovw7:PERFORMANCECATEGORYLIST">`;

    for (let index = 0; index < props.codes.length; index++) {
      body += `<PERFORMANCECATEGORY xsi:type="ovw7:CATEGORY">
                                                <CODE xsi:type="xsd:string">${props.codes[index]}</CODE>
                                            </PERFORMANCECATEGORY>`;
    }

    body += `</PERFORMANCECATEGORYLIST>
                                <DATE xsi:type="ovw7:BASEDATEFILTER">
                                    <FROM xsi:type="xsd:date">${this.getVivaDateFormat(props.from)}</FROM>
                                    <TO xsi:type="xsd:date">${this.getVivaDateFormat(props.to)}</TO>
                                </DATE>
                                </ovw7:SEARCHCALENDARAVAILABILITYREQ>
                            </urn:SearchCalendarAvailability>
                            </soapenv:Body>
                        </soapenv:Envelope>`;
    let result = await $axios.post(
      `${process.env.SHARED_ENVS.APIGEE_BASE_URL}/viva/search-calender-availability`, body, this.vivaAPIsHeader()
    );

    let jsonResult = await xmlToJson(result.data);
    return jsonResult;
  },
  async getCalendarAvailabilitySki(props) {
    let body = `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:WsAPIPerformacneIntf-IWsAPIPerformance" xmlns:ovw7="http://omniticket.network/ovw7">
                            <soapenv:Header/>
                            <soapenv:Body>
                            <urn:SearchCalendarAvailability soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                                <ovw7:SEARCHCALENDARAVAILABILITYREQ>
                                <PERFORMANCECATEGORYLIST xsi:type="ovw7:PERFORMANCECATEGORYLIST">`;

    for (let index = 0; index < props.codes.length; index++) {
      body += `<PERFORMANCECATEGORY xsi:type="ovw7:CATEGORY">
                                                <CODE xsi:type="xsd:string">${props.codes[index]}</CODE>
                                            </PERFORMANCECATEGORY>`;
    }

    body += `</PERFORMANCECATEGORYLIST>
                                <DATE xsi:type="ovw7:BASEDATEFILTER">
                                    <FROM xsi:type="xsd:date">${this.getVivaDateFormat(props.from)}</FROM>
                                    <TO xsi:type="xsd:date">${this.getVivaDateFormat(props.to)}</TO>
                                </DATE>
                                </ovw7:SEARCHCALENDARAVAILABILITYREQ>
                            </urn:SearchCalendarAvailability>
                            </soapenv:Body>
                        </soapenv:Envelope>`;

    let result = await $axios.post(
      `${process.env.SHARED_ENVS.APIGEE_BASE_URL}/viva/search-calender-availability`, body, this.vivaAPIsHeader()
    );

    let jsonResult = await xmlToJson(result.data);
    let data = {
      isSuccess: true,
      slots: []
    };
    if (jsonResult.ERROR.CODE == 200) {
      let performance = [];
      if (jsonResult.DAYLIST) {
        performance = jsonResult.DAYLIST.DAY.PERFORMANCELIST.PERFORMANCE;
      }
      data.isSuccess = true;
      data.slots = this.getActiveSlots(Array.isArray(performance) ? performance : [performance]);
    } else {
      data.isSuccess = true;
      data.slots = [];
    }
    return data;
  },
  async getCalendarAvailabilitySkiCalendar(props) {
    let body = `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:WsAPIPerformacneIntf-IWsAPIPerformance" xmlns:ovw7="http://omniticket.network/ovw7">
                            <soapenv:Header/>
                            <soapenv:Body>
                            <urn:SearchCalendarAvailability soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                                <ovw7:SEARCHCALENDARAVAILABILITYREQ>
                                <PERFORMANCECATEGORYLIST xsi:type="ovw7:PERFORMANCECATEGORYLIST">`;

    for (let index = 0; index < props.codes.length; index++) {
      body += `<PERFORMANCECATEGORY xsi:type="ovw7:CATEGORY">
                                                <CODE xsi:type="xsd:string">${props.codes[index]}</CODE>
                                            </PERFORMANCECATEGORY>`;
    }

    body += `</PERFORMANCECATEGORYLIST>
                                <DATE xsi:type="ovw7:BASEDATEFILTER">
                                    <FROM xsi:type="xsd:date">${this.getVivaDateFormat(props.from)}</FROM>
                                    <TO xsi:type="xsd:date">${this.getVivaDateFormat(props.to)}</TO>
                                </DATE>
                                </ovw7:SEARCHCALENDARAVAILABILITYREQ>
                            </urn:SearchCalendarAvailability>
                            </soapenv:Body>
                        </soapenv:Envelope>`;

    let result = await $axios.post(
      `${process.env.SHARED_ENVS.APIGEE_BASE_URL}/viva/search-calender-availability`, body, this.vivaAPIsHeader()
    );
    let jsonResult = await xmlToJson(result.data);
    if (!jsonResult.DAYLIST) return [];
    let days = jsonResult.DAYLIST.DAY;
    let dates = [];

    if (!Array.isArray(days)) days = [days];
    let timezone = app.$getSiteConfig('timezone');
    for (let index = 0; index < days.length; index++) {
      if (this.isAvailableSlot(days[index])) {
        let date = globalHelpers.isCorrectFormat(days[index].DATE, "YYYY-MM-DD") ? moment(days[index].DATE, 'YYYY-MM-DD').tz(timezone).toDate() : new Date(days[index].DATE);
        let performances = this.getAvailablePerformances(days[index]);
        dates.push({
          id: date,
          date: date,
          is_active: true,
          maxAvailability: this.getMaxAvailability(performances),
          performances: this.getFormattedPerformances(performances),          
        });
      }
    }
    return dates;
  },
  isAvailableSlot(performanceObj) {
    let performances = performanceObj.PERFORMANCELIST.PERFORMANCE;
    if (!Array.isArray(performances)) performances = [performances];
    for (let index = 0; index < performances.length; index++) {
      if (performances[index].AVAILABILITY.AVAILABLE > 0 &&
        performances[index].STATUS == "2" && this.toBoolean(performances[index].SELLABLE)) return true;
    }
    return false;
  },
  async getCalendarAvailabilityCalendar(date, lastDayOfMonth, eventAK) {
    let body = `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:WsAPIPerformanceIntf-IWsAPIPerformance" xmlns:ovw7="http://omniticket.network/ovw7">
                            <soapenv:Header/>
                            <soapenv:Body>
                            <urn:GetCalendarAvailability soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                                <ovw7:GETCALENDARAVAILABILITYREQ>
                                    <EVENTAK xsi:type="xsd:string">${eventAK}</EVENTAK>
                                    <FROMDATE xsi:type="xsd:date">${this.getVivaDateFormat(date)}</FROMDATE>
                                    <TODATE xsi:type="xsd:date">${this.getVivaDateFormat(lastDayOfMonth)}</TODATE>
                                    <SELLABLE xsi:type="xsd:boolean">TRUE</SELLABLE>
                                </ovw7:GETCALENDARAVAILABILITYREQ>
                            </urn:GetCalendarAvailability>
                            </soapenv:Body>
                        </soapenv:Envelope>`;
    let result = await $axios.post(
      `${process.env.SHARED_ENVS.APIGEE_BASE_URL}/viva/calender-availability`, body, this.vivaAPIsHeader()
    );
    let jsonResult = await xmlToJson(result.data);
    if (!jsonResult.DAYLIST) return [];
    let days = jsonResult.DAYLIST.DAY;
    let dates = [];

    if (!Array.isArray(days)) days = [days];
    let timezone = app.$getSiteConfig('timezone');
    for (let index = 0; index < days.length; index++) {
      if (this.isAvailableSlot(days[index])) {
        let date = globalHelpers.isCorrectFormat(days[index].DATE, "YYYY-MM-DD") ? moment(days[index].DATE, 'YYYY-MM-DD').tz(timezone).toDate() : new Date(days[index].DATE);
        let performances = this.getAvailablePerformances(days[index]);        
        dates.push({
          id: date,
          date: date,
          is_active: days[index].AVAILABILITY.AVAILABLE > 0,
          maxAvailability: this.getMaxAvailability(performances),
          performances: this.getFormattedPerformances(performances),          
        });
      }
    }

    return dates;
  },
  async getCalendarAvailability(props) {
    let body = `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:WsAPIPerformanceIntf-IWsAPIPerformance" xmlns:ovw7="http://omniticket.network/ovw7">
                            <soapenv:Header/>
                            <soapenv:Body>
                            <urn:GetCalendarAvailability soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                                <ovw7:GETCALENDARAVAILABILITYREQ>
                                    <EVENTAK xsi:type="xsd:string">${props.eventAK}</EVENTAK>
                                    <FROMDATE xsi:type="xsd:date">${this.getVivaDateFormat(props.from)}</FROMDATE>
                                    <TODATE xsi:type="xsd:date">${this.getVivaDateFormat(props.to)}</TODATE>
                                    <SELLABLE xsi:type="xsd:boolean">TRUE</SELLABLE>
                                </ovw7:GETCALENDARAVAILABILITYREQ>
                            </urn:GetCalendarAvailability>
                            </soapenv:Body>
                        </soapenv:Envelope>`;
    let result = await $axios.post(
      `${process.env.SHARED_ENVS.APIGEE_BASE_URL}/viva/calender-availability`, body, this.vivaAPIsHeader()
    );

    let jsonResult = await xmlToJson(result.data);
    let data = {
      isSuccess: true,
      slots: []
    };
    if (jsonResult.ERROR.CODE == 200) {
      let performance = jsonResult.DAYLIST.DAY.PERFORMANCELIST.PERFORMANCE;
      data.isSuccess = true;
      data.slots = this.getActiveSlots(Array.isArray(performance) ? performance : [performance]);
    } else {
      data.isSuccess = true;
      data.slots = [];
    }
    return data;
  },
  getActiveSlots(performances = []) {
    let temp = [];
    for (let index = 0; index < performances.length; index++) {
      if (performances[index].AVAILABILITY.AVAILABLE > 0 &&
        performances[index].STATUS == "2" && this.toBoolean(performances[index].SELLABLE)) temp.push(performances[index]);
    }
    return temp;
  },
  async getCalendarAvailabilityCamp(props) {
    let body = `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:WsAPIPerformanceIntf-IWsAPIPerformance" xmlns:ovw7="http://omniticket.network/ovw7">
                            <soapenv:Header/>
                            <soapenv:Body>
                            <urn:GetCalendarAvailability soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                                <ovw7:GETCALENDARAVAILABILITYREQ>
                                    <EVENTAK xsi:type="xsd:string">${props.eventAK}</EVENTAK>
                                    <FROMDATE xsi:type="xsd:date">${this.getVivaDateFormat(props.from)}</FROMDATE>
                                    <TODATE xsi:type="xsd:date">${this.getVivaDateFormat(props.to)}</TODATE>
                                    <SELLABLE xsi:type="xsd:boolean">TRUE</SELLABLE>
                                </ovw7:GETCALENDARAVAILABILITYREQ>
                            </urn:GetCalendarAvailability>
                            </soapenv:Body>
                        </soapenv:Envelope>`;
    let result = await $axios.post(
      `${process.env.SHARED_ENVS.APIGEE_BASE_URL}/viva/calender-availability`, body, this.vivaAPIsHeader()
    );

    let jsonResult = await xmlToJson(result.data);
    return jsonResult;
  },
  async generateGuestJWT() {
    try {
      CommonEvent.$emit("global-loader", true);
      let personalDetails = app.store.state.bookingFlow.personalDetailsTab.guestInformation;
      let data = {
        "title": personalDetails.title,
        "email": personalDetails.email,
        "firstName": personalDetails.firstName,
        "lastName": personalDetails.lastName,
        "mobile": `${personalDetails.mobileDetails.countryCode}${personalDetails.mobileDetails.significantMobileNumber}`,
        dateOfBirth: '01-01-2000',
        country: personalDetails.country_of_residence,
        nationality: personalDetails.country_of_residence,
      };

      let config = {
        method: 'post',
        url: `${process.env.SHARED_ENVS.APIGEE_BASE_URL}/generate-token`,
        headers: {
          'Content-Type': 'application/json',
          'X-Apikey': 'qwyTRnqGsdv1nMcP04zsHQThBt87eLIu',
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*", // Allow from anywhere
          "Access-Control-Allow-Methods": "*" // Allow only GET request
        },
        data: JSON.stringify(data)
      };
      let result = await $axios(config);
      let jwt = result.data.data.token;
      app.store.commit("bookingFlow/SET_GUEST_JWT", jwt);
      CommonEvent.$emit("global-loader", false);
      return true;
    } catch (error) {
      // console.log(error);
      CommonEvent.$emit("global-loader", false);
      return false;
    }
  },
  getGuestJWT() {
    return app.store.state.bookingFlow.jwt;
  },
  isDatesRequiredNoPromise(product) {
    if (!app.$isEmptyObject(product || {})) {
      let dateFrom = this.toBoolean(product.WARNING.DATEFROM.REQUIRED);
      let dateTo = this.toBoolean(product.WARNING.DATETO.REQUIRED);
      return {
        from: dateFrom,//true
        to: dateTo,
      };
    }
    return {
      from: true,
      to: false,
    };
  },
  isAccountRequiredNoPromise(product) {
    if (!app.$isEmptyObject(product || {})) {
      return this.toBoolean(product.WARNING.ACCOUNT.REQUIRED);
    }
    return false;
  },
  isTimeBasedEventLocal(product, performanceAK = "") {
    if (!app.$isEmptyObject(product || {})) {
      let isEventExist = product.WARNING.PERFORMANCE.EVENTLIST !== undefined;
      let performanceAKArr = [];
      if (isEventExist) {
        let isArray = Array.isArray(product.WARNING.PERFORMANCE.EVENTLIST.EVENT);
        if (isArray) {
          for (let index = 0; index < product.WARNING.PERFORMANCE.EVENTLIST.EVENT.length; index++) {
            performanceAKArr.push({
              ak: product.WARNING.PERFORMANCE.EVENTLIST.EVENT[index].AK,
              code: product.WARNING.PERFORMANCE.EVENTLIST.EVENT[index].CODE
            });
          }
        } else {
          performanceAKArr.push({
            ak: product.WARNING.PERFORMANCE.EVENTLIST.EVENT.AK,
            code: product.WARNING.PERFORMANCE.EVENTLIST.EVENT.CODE
          });
        }
        if (performanceAK) {
          let index = this.getPerformanceAKIndex(performanceAKArr, performanceAK);
          if (index != -1) {
            performanceAKArr = this.removeIndexFromArray(performanceAKArr, index);
          }
        }
      }

      return {
        isSuccess: true,
        isTimeBased: performanceAKArr.length > 0,
        performanceAK: performanceAKArr.length > 0 ? performanceAKArr[0].ak : ""
      };
    }

    return {
      isSuccess: true,
      isTimeBased: false,
      performanceAK: ""
    };
  },
  async isTimeBasedEvent(productAK, performanceAK = "") {
    try {
      const result = app.store.state.appConfig.vivaProducts || [];

      if (result.length > 0) {
        let product = result.find(item => item.AK === productAK)

        if (product) {
          let isEventExist = product.WARNING.PERFORMANCE.EVENTLIST !== undefined;
          let performanceAKArr = [];
          if (isEventExist) {
            let isArray = Array.isArray(product.WARNING.PERFORMANCE.EVENTLIST.EVENT);
            if (isArray) {
              for (let index = 0; index < product.WARNING.PERFORMANCE.EVENTLIST.EVENT.length; index++) {
                performanceAKArr.push({
                  ak: product.WARNING.PERFORMANCE.EVENTLIST.EVENT[index].AK,
                  code: product.WARNING.PERFORMANCE.EVENTLIST.EVENT[index].CODE
                });
              }
            } else {
              performanceAKArr.push({
                ak: product.WARNING.PERFORMANCE.EVENTLIST.EVENT.AK,
                code: product.WARNING.PERFORMANCE.EVENTLIST.EVENT.CODE
              });
            }
            if (performanceAK) {
              let index = this.getPerformanceAKIndex(performanceAKArr, performanceAK);
              if (index != -1) {
                performanceAKArr = this.removeIndexFromArray(performanceAKArr, index);
              }
            }
          }

          return {
            isSuccess: true,
            isTimeBased: performanceAKArr.length > 0,
            performanceAK: performanceAKArr.length > 0 ? performanceAKArr[0].ak : ""
          };
        }
      }
      return {
        isSuccess: true,
        isTimeBased: false,
        performanceAK: ""
      };
    } catch (err) {
      // console.log(err);
      return {
        isSuccess: false,
        isTimeBased: false,
        performanceAK: ""
      };
    }
  },
  getPerformanceAKIndex(performanceAKArr, performanceAK) {
    for (let index = 0; index < performanceAKArr.length; index++) {
      if (performanceAKArr[index].ak == performanceAK) return index;
    }
    return -1;
  },
  async getAKEventTypeSki(data, code) {
    if (code) {
      if (code.indexOf(",") !== -1) {
        code = code.split(",");
      } else {
        code = [code];
      }
    }
    if (code.length == 0) {
      let calendarAvailabilityPayload = {
        eventAK: data.performanceAK,
        from: data.from,
        to: data.to,
      }
      let calendarAvailabilityResult = await this.getCalendarAvailability(calendarAvailabilityPayload);
      return {
        isSuccess: true,
        slots: calendarAvailabilityResult.slots
      };
    } else {
      let calendarAvailabilityResult = await this.getCalendarAvailabilitySki({
        from: data.from,
        to: data.to,
        codes: code
      });
      return {
        isSuccess: true,
        slots: calendarAvailabilityResult.slots
      };
    }
  },
  async getAKEventTypeSkiCamp(data, code, dates) {
    if (code) {
      if (code.indexOf(",") !== -1) {
        code = code.split(",");
      } else {
        code = [code];
      }
    }
    let calendarAvailabilityResult = {};
    if (data.from && data.to) {
      if (code.length == 0) {
        let calendarAvailabilityPayload = {
          eventAK: data.performanceAK,
          from: data.from,
          to: data.to,
        }
        calendarAvailabilityResult = await this.getCalendarAvailabilityCamp(calendarAvailabilityPayload);
      } else {
        calendarAvailabilityResult = await this.getCalendarAvailabilitySkiCamp({
          from: data.from,
          to: data.to,
          codes: code
        });
      }
    }

    let temp = [];
    let daysSlots = calendarAvailabilityResult && calendarAvailabilityResult.DAYLIST && calendarAvailabilityResult.DAYLIST.DAY && calendarAvailabilityResult.DAYLIST.DAY.length ? calendarAvailabilityResult.DAYLIST.DAY : [];
    for (let index = 0; index < daysSlots.length; index++) {
      let date = new Date(daysSlots[index].DATE);
      if (this.isMatchDates(dates, date)) {
        //
        let performances = daysSlots[index].PERFORMANCELIST.PERFORMANCE;
        if (!Array.isArray(performances)) performances = [performances];
        //
        for (let index2 = 0; index2 < performances.length; index2++) {
          if (performances[index2].TIME == data.time && Number(performances[index2].AVAILABILITY.AVAILABLE) >= Number(data.qty)) {
            temp.push(performances[index2].AK);
            break;
          }
        }
      }
    }
    return temp;
  },
  isMatchDates(dates, date) {
    for (let index = 0; index < dates.length; index++) {
      if (new Date(dates[index]).setHours(0, 0, 0, 0) == date.setHours(0, 0, 0, 0)) return true;
    }
    return false;
  },
  async getAKEventTypeSkiCalendar(data, code) {
    if (code) {
      if (code.indexOf(",") !== -1) {
        code = code.split(",");
      } else {
        code = [code];
      }
    }
    if (code.length == 0) {

      let calendarAvailabilityResult = await this.getCalendarAvailabilityCalendar(data.from, data.to, data.performanceAK);
      return {
        isSuccess: true,
        slots: calendarAvailabilityResult
      };

    } else {
      let calendarAvailabilityResult = await this.getCalendarAvailabilitySkiCalendar({
        from: data.from,
        to: data.to,
        codes: code
      });

      return {
        isSuccess: true,
        slots: calendarAvailabilityResult
      };
    }
  },
  async checkBasket(payload, isOnlyToCheck = true) {
    if (payload.lineItems.length == 1) {
      if (payload.lineItems[0].tickets.length == 0) {
        return {
          isSuccess: true,
          checkbasketProceed: false
        };
      }
    }

    let isThereMissingPerformance = !!(payload.lineItems.map(item => item.tickets.filter(ticket => ticket.isTimeBased && (!ticket.performanceList.length || !!ticket.performanceList.filter(performance => !performance.performance).length))).flat()).length;
    if (isThereMissingPerformance) {
      return {
        isSuccess: true,
        checkbasketProceed: false
      };
    }

    if (isOnlyToCheck) {
      let path = window.location.pathname;
      if (path.indexOf("buy-tickets") !== -1) isOnlyToCheck = false;
    }

    CommonEvent.$emit("global-loader", true);
    try {
      let data = {
        promoCode: payload.promoCode,
        lineItems: payload.lineItems,
        redeemAmount: payload.redeemAmount
      };
      let header = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*"
      };

      if (isOnlyToCheck) {
        header["operation"] = "check";
      } else if (!app.$isUserAuthenticated()) {
        header["X-Access-Token"] = this.getGuestJWT();
      }

      const currentEnv = app.$getSiteCurrentEnvironment(true, true);
      // TODO: change the 'oman' value to snow_oman when the BE team adds it.
      const locationVal = AppConfig[currentEnv].location;

      let config = {
        method: "post",
        url: `${process.env.SHARED_ENVS.APIGEE_BASE_URL}/order/check-basket?location=${locationVal}`,
        headers: header,
        data: JSON.stringify(data),
      };
      let result = await $axios(config);
      if (result && result.data && result.data.lineItemsSoap) {
        let jsonResult = await xmlToJson(result.data.lineItemsSoap);
        CommonEvent.$emit("global-loader", false);
        if (!isOnlyToCheck) {
          app.store.commit(
            "bookingFlow/SET_RESERVATION_CODE",
            result.data.cartId
          );
        }
        return {
          isSuccess: true,
          lineItemsOriginal: result.data.lineItems,
          lineItems: jsonResult,
          cartId: result.data.cartId,
          token: result.data.token,
          checkbasketProceed: true
        };
      } else {
        return {
          isSuccess: false,
          checkbasketProceed: true,
          lineItems: {
            ERROR: {
              CODE: 1000,
              TEXT: result.data.msg
            }
          },
        }
      }
    } catch (error) {
      CommonEvent.$emit("global-loader", false);
      let isErrorListFilled = error.response.data.productErrorList.length > 0;
      let errorCode = isErrorListFilled ? error.response.data.productErrorList[0].errorNumber : error.response.data.code;
      let errorText = isErrorListFilled ? error.response.data.productErrorList[0].errorDescription : error.response.data.errorMessage;
      return {
        isSuccess: false,
        checkbasketProceed: true,
        lineItems: {
          ERROR: {
            CODE: errorCode,
            TEXT: Number(errorCode) == 5035 ? app.i18n.t('BOOKINGFLOW_PAGE.SELECTED_TIMESLOTS_IS_BOOKED_NOW') : errorText
          }
        },
      }
    }
  },
  isLoginRequiredVivaNoPromise(product) {
    if (!app.$isEmptyObject(product || {})) return this.toBoolean(product.WARNING.ACCOUNT.REQUIRED);
    return true;
  },
  toBoolean(flag) {
    return String(flag) === 'true';
  },
  removeIndexFromArray(arr, index) {
    if (arr.length > 1) {
      arr.splice(index, 1);
      return arr;
    } else {
      return [];
    }
  },
  getAvailablePerformances(day){
    if(!day || !day.PERFORMANCELIST || !day.PERFORMANCELIST.PERFORMANCE) return [];
    let performances = day.PERFORMANCELIST.PERFORMANCE;
    performances = Array.isArray(performances) ? performances : [performances];
    return performances.filter((item) => (item.STATUS || '') === '2' && this.toBoolean(item.SELLABLE || false)) || [];
  },
  getFormattedPerformances(performances = []){
    return performances.map((performance) => {
      const result = {
        ak: performance.AK || '',
        available: +((performance.AVAILABILITY || {}).AVAILABLE || 0),
      };
      return result;
    });        
  },
  getMaxAvailability(performances = []){
    return Math.max(...performances.map(item => +((item.AVAILABILITY || {}).AVAILABLE || 0)), 0);
  },
})

export async function xmlToJson(xmlDocument) {
  // https://www.npmjs.com/package/xml2js
  try {
    return await new Promise((resolve, reject) => {
      const parser = new Parser({
        explicitArray: false,
        ignoreAttrs: true,
        trim: true
      });
      parser.parseString(xmlDocument, (error, result) => {
        if (!result["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["SOAP-ENV:Fault"]) {
          const soapResBody = result["SOAP-ENV:Envelope"]["SOAP-ENV:Body"];
          const urnAddress = Object.keys(soapResBody)[0];
          resolve(soapResBody[urnAddress]?.return);
        }
        resolve({
          ERROR: {
            CODE: "10000",
            TEXT: "an Error occurred",
            TYPE: "Managed"
          }
        });
      });
    });
  } catch (err) {
    return err;
  }
}
