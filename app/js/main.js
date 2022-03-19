const REQUEST_URL = 'https://www.cbr-xml-daily.ru/currency-date/daily_json.js';

const DAYS_COUNT = 10;

const REQUEST_TYPE = {
  CURRENT: 'current',
  DAILY: 'daily'
}

const EXCHANGE_RATE_LIST = [];

function currencyRequest(requestDatas) {
  const url = getUrl(requestDatas.type, requestDatas.date);
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Request error');
      }
    })
}

function renderCurrentCurrency(currencyDatas) {
  const ul = document.querySelector('.currency__list');
  const currencyList = currencyDatas.Valute;
  let counter = 1;
  for (let item in currencyList) {
    ul.appendChild(getLiItem(currencyList[item], counter))
    counter++;
  }
}

function renderDailyCurrency(currencyDatas, requestDatas) {
  const valute = currencyDatas['Valute'];

  EXCHANGE_RATE_LIST.unshift({
    date: requestDatas.date,
    charCode: valute[requestDatas.valuteCharCode]['CharCode'],
    value: valute[requestDatas.valuteCharCode]['Value']
  })

  console.log(requestDatas.date + ' -> ' + valute[requestDatas.valuteCharCode]['CharCode'] + ' - ' + valute[requestDatas.valuteCharCode]['Value']);
}

function extractExchangeRate(currencyDatas) {
  const exchangeRate = {

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

  liItem.addEventListener('click', function () {
    const currencyRequestArray = [];
    const valuteCharCode = this.querySelector('.currency__name').textContent;
    for (let dayAgo = 1; dayAgo <= DAYS_COUNT; dayAgo++) {
      const date = getDate(dayAgo);
      const requestDatas = {
        type: REQUEST_TYPE.DAILY,
        date: date,
        valuteCharCode: valuteCharCode
      }
      setTimeout(currencyRequest, 250 * dayAgo, requestDatas);
    }
  })
  return liItem;
}

function getUrl(requestType, date) {
  if (requestType === REQUEST_TYPE.CURRENT) {
    return REQUEST_URL.replace('/currency-date', '');
  } else {
    return REQUEST_URL.replace('/currency-date', `/archive/${ date }`)
  }
}

function getDate(day) {
  const currentDate = new Date().getTime();
  const dayAgoDate = new Date(currentDate - 1000 * 60 * 60 * 24 * day);
  return dayAgoDate.toLocaleDateString('en-ca').replaceAll('-', '/');
}



function getCurrentCurrency() {
  currencyRequest({
      type: REQUEST_TYPE.CURRENT
    })
    .then(currencyDatas => {
      renderCurrentCurrency(currencyDatas);
    })
}

getCurrentCurrency();