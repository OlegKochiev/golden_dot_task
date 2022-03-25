import {
  currencyRequest
} from './get_currency_datas.js'

const render = {
  currentCurrencyList(currencyDatas) {
    const currencyList = currencyDatas;

    let counter = 1;
    for (let item in currencyList) {
      render.addTableRow(currencyList[item], counter);
      counter++;
    }
  },

  addTableRow(currency, counter) {
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
  },

  dailyCurrencyList(dailyDatas) {
    const dailyList = render.createDailyList(dailyDatas);
    dailyDatas.context.after(dailyList);
  },

  createDailyList(dailyDatas) {
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
    h3.textContent = dailyDatas.valuteName;
    dailyDatas.dailyCurrencyDatas.forEach((valute) => {
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
  },

  startStopLoader() {
    document.querySelector('.loader').classList.toggle('loader__active');
  }
}

export {
  render
}