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

async function getDailyCurrency(requestDatas) {
  if (document.querySelector('.table__row--daily')) {
    document.querySelector('.table__row--daily').remove();
  }
  startStopLoader()
  const exchangeRateList = [];
  for (let daysAgo = 1; daysAgo <= DAYS_COUNT; daysAgo++) {
    let date = getDate(daysAgo);
    let url = getUrl(REQUEST_TYPE.DAILY, date);
    let response = {};
    requestDatas.date = date;
    requestDatas.url = url;
    response.date = date;
    response.timecode = Date.now();
    const responseValue = await dailyCurrencyRequest(requestDatas);
    response.value = fillEmptyDatas(exchangeRateList, responseValue);
    exchangeRateList.unshift(response);
    await delay();
  }
  const responseDatas = {
    name: requestDatas.name,
    context: requestDatas.context,
    exchangeRateList: exchangeRateList
  }
  startStopLoader();
  dailyCurrencyRender(requestDatas.context, responseDatas);
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
      const valuteValue = valuteList[requestDatas.name].Value;
      return valuteValue;
    })
    .catch(() => {
      return {};
    })
}

function currentCurrencyRender(currencyDatas) {
  const currencyList = currencyDatas.Valute;
  let counter = 1;
  for (let item in currencyList) {
    addTableRow(currencyList[item], counter);
    counter++;
  }
}

function dailyCurrencyRender(rowItem, responseDatas) {
  const dailyDatas = createDailyList(responseDatas);
  rowItem.after(dailyDatas)
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

function fillEmptyDatas(exchangeRateList, responseValue) {
  let valuteValue = 0;
  if (typeof (responseValue) !== "object") {
    valuteValue = responseValue;
  } else {
    valuteValue = exchangeRateList[0].value;
  }
  console.log(valuteValue);
  return valuteValue;
}

function addTableRow(currency, counter) {
  const tableBody = document.querySelector('.table__body');
  const difference = ((Number(currency.Value) - Number(currency.Previous)) / Number(currency.Value) * 100).toFixed(2);
  const tableRow =
    `<tr class="table__row table__row--body" data-valute-name="${currency.CharCode}">
      <td class="table__cell table__cell--body">${counter}</td>
      <td class="table__cell table__cell--body">${currency.NumCode}</td>
      <td class="table__cell table__cell--body">${currency.CharCode}</td>
      <td class="table__cell table__cell--body">${currency.Value}</td>
      <td class="table__cell table__cell--body">${difference}</td>
    </tr>`;

  tableBody.insertAdjacentHTML('beforeend', tableRow);
  const lastTableRow = tableBody.lastElementChild;
  lastTableRow.addEventListener('click', (event) => {
    const rowItem = event.target.parentNode;
    const valuteName = rowItem.getAttribute('data-valute-name');
    getDailyCurrency({
      name: valuteName,
      context: rowItem
    });
  })
}

function createDailyList(responseDatas) {
  const tr = document.createElement('tr');
  const td = document.createElement('td');
  const ol = document.createElement('ol');
  const h3 = document.createElement('h3');
  tr.classList.add('table__row');
  tr.classList.add('table__row--daily');
  td.classList.add('table__cell');
  td.classList.add('table__cell--daily');
  td.setAttribute('colspan', '5');
  ol.classList.add('table__daily-list');
  h3.textContent = responseDatas.name;
  responseDatas.exchangeRateList.forEach((valute) => {
    const li = document.createElement('li');
    const date = document.createElement('time');
    const span = document.createElement('span');
    date.textContent = valute.date + ' - ';
    span.textContent = valute.value;
    li.appendChild(date);
    li.appendChild(span);
    ol.appendChild(li);
  })
  td.appendChild(h3);
  td.appendChild(ol);
  tr.appendChild(td);
  return tr;
}

function startStopLoader() {
  document.querySelector('.loader').classList.toggle('loader__active');
}

getCurrentCurrency();