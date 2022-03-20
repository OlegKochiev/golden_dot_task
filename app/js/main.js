const REQUEST_URL = 'https://www.cbr-xml-daily.ru/currency-date/daily_json.js';

const DAYS_COUNT = 10;

const REQUEST_TYPE = {
  CURRENT: 'current',
  DAILY: 'daily'
}

const DELAY_MS = 200;

async function getCurrentCurrency() {
  const currencyDatas = await currentCurrencyRequest({
    type: REQUEST_TYPE.CURRENT
  })
  currentCurrencyRender(currencyDatas);
}

function currentCurrencyRequest(requestDatas) {
  const url = getUrl(requestDatas.type);
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Request error');
      }
    });
}

function currentCurrencyRender(currencyDatas) {
  const ul = document.querySelector('.currency__list');
  const currencyList = currencyDatas.Valute;
  let counter = 1;
  for (let item in currencyList) {
    ul.appendChild(getLiItem(currencyList[item], counter))
    counter++;
  }
}

async function getDailyCurrency(requestDatas) {
  const exchangeRateList = [];
  for (let daysAgo = 1; daysAgo <= DAYS_COUNT; daysAgo++) {
    let date = getDate(daysAgo);
    let url = getUrl(REQUEST_TYPE.DAILY, date);
    requestDatas.date = date;
    requestDatas.url = url;
    exchangeRateList.unshift(await dailyCurrencyRequest(requestDatas));
    await delay();
  }
  const responseDatas = {
    name: requestDatas.valuteName,
    context: requestDatas.context,
    exchangeRateList: exchangeRateList
  }
  console.log(responseDatas);
}

function dailyCurrencyRequest(requestDatas) {
  return fetch(requestDatas.url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return new Error('Error');
      }
    })
    .then((dailyDatas) => {
      const valuteList = dailyDatas['Valute'];
      return {
        date: requestDatas.date,
        valuteValue: valuteList[requestDatas.valuteName].Value,
        timecode: Date.now()
      };
    })
    .catch(() => {
      return {};
    })
}

function delay() {
  return new Promise(resolve => setTimeout(resolve, DELAY_MS));
}

function getDate(day) {
  const currentDate = new Date().getTime();
  const dayAgoDate = new Date(currentDate - 1000 * 3600 * 24 * day);
  return dayAgoDate.toLocaleDateString('en-ca').replaceAll('-', '/');
}

function getUrl(requestType, date) {
  if (requestType === REQUEST_TYPE.CURRENT) {
    return REQUEST_URL.replace('/currency-date', '');
  } else {
    return REQUEST_URL.replace('/currency-date', `/archive/${ date }`)
  }
}

function getLiItem(currency, counter) {
  const liItem = document.createElement('li');
  const spanCount = document.createElement('span');
  const spanCode = document.createElement('span');
  const spanName = document.createElement('span');
  const spanValue = document.createElement('span');
  const spanDiff = document.createElement('span');
  const spanTooltip = document.createElement('span');
  const different = ((Number(currency.Value) - Number(currency.Previous)) / Number(currency.Value) * 100).toFixed(2);

  liItem.classList.add('currency__item');
  spanCount.classList.add('currency__count');
  spanCode.classList.add('currency__code');
  spanName.classList.add('currency__name');
  spanValue.classList.add('currency__value');
  spanDiff.classList.add('currency__diff');
  spanTooltip.classList.add('currency__tooltip');

  spanCount.innerHTML = counter;
  spanCode.innerHTML = currency.NumCode
  spanName.innerHTML = currency.CharCode
  spanValue.innerHTML = currency.Value
  spanDiff.innerHTML = different
  spanTooltip.innerHTML = currency.Name

  liItem.appendChild(spanCount);
  liItem.appendChild(spanCode);
  liItem.appendChild(spanName);
  liItem.appendChild(spanValue);
  liItem.appendChild(spanDiff);
  liItem.appendChild(spanTooltip);

  liItem.addEventListener('click', (event) => {
    getDailyCurrency({
      context: event.target,
      valuteName: currency.CharCode
    })
  })
  return liItem;
}

getCurrentCurrency();