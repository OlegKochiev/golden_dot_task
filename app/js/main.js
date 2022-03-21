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
  const currencyList = currencyDatas.Valute;
  let counter = 1;
  for (let item in currencyList) {
    addTableRow(currencyList[item], counter);
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
    move();
    const rowItem = event.target.parentNode;
    const valuteName = rowItem.getAttribute('data-valute-name');
    getDailyCurrency({
      valuteName: valuteName
    });
  })
}

getCurrentCurrency();


function move(i = 0) {
  if (i == 0) {
    i = 1;
    var elem = document.querySelector(".progress__bar");
    console.log(elem);
    var width = 1;
    var id = setInterval(frame, 10);

    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }
}