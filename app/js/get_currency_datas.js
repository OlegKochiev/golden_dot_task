import {
  REQUEST_TYPE,
  REQUEST_URL,
  DAYS_COUNT,
  DELAY_MS
} from './consts.js'

import {
  render
} from './render_UI.js'

const currencyRequest = {

  async getCurrentDatas() {
    const url = currencyRequest.getUrl(REQUEST_TYPE.CURRENT, '');
    const currencyDatas = await currencyRequest.doCurrentRequest(url);
    return currencyDatas;
  },

  async getDailyDatas(valuteName) {
    render.startStopLoader();
    const exchangeRateList = [];
    for (let daysAgo = 1; daysAgo <= DAYS_COUNT; daysAgo++) {
      let date = currencyRequest.getDate(daysAgo);
      let url = currencyRequest.getUrl(REQUEST_TYPE.DAILY, date);
      const response = {};
      response.date = date;
      response.timecode = Date.now();
      const responseValue = await currencyRequest.doDailyRequest(url, valuteName);
      response.value = currencyRequest.fillEmptyDatas(exchangeRateList, responseValue);
      exchangeRateList.unshift(response);
      await currencyRequest.delay();
    }
    const responseDatas = exchangeRateList;
    render.startStopLoader();
    return responseDatas;
  },

  doCurrentRequest(url) {
    return fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request error');
        }
      })
      .then((currentDatas) => {
        return currentDatas['Valute'];
      })
  },

  doDailyRequest(url, valuteName) {
    return fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return new Error('Error');
        }
      })
      .then((dailyDatas) => {
        const valuteList = dailyDatas['Valute'];
        return valuteList[valuteName].Value;
      })
      .catch(() => {
        return {};
      })
  },

  delay() {
    return new Promise(resolve => setTimeout(resolve, DELAY_MS));
  },

  getDate(day) {
    const currentDate = new Date().getTime();
    const dayAgoDate = new Date(currentDate - 1000 * 3600 * 24 * day);
    return dayAgoDate.toLocaleDateString('en-ca').replaceAll('-', '/');
  },

  getUrl(requestType, date) {
    if (requestType === REQUEST_TYPE.CURRENT) {
      return REQUEST_URL.replace('/currency-date', '');
    } else {
      return REQUEST_URL.replace('/currency-date', `/archive/${ date }`)
    }
  },

  fillEmptyDatas(exchangeRateList, responseValue) {
    let valuteValue = 0;
    if (typeof (responseValue) !== "object") {
      valuteValue = responseValue;
    } else {
      valuteValue = exchangeRateList[0].value;
    }
    return valuteValue;
  }
}

export {
  currencyRequest
}