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
        <td class="table__cell table__cell--tooltip">
          <span class="table__tooltip">${currency.Name}</span>
        </td>
      </tr>`;
    tableBody.insertAdjacentHTML('beforeend', tableRow);
  },

  dailyCurrencyList(dailyDatas) {
    const dailyList = render.createDailyList(dailyDatas);
  },

  createDailyList(dailyDatas) {
    const dailyRowTemplate =
      `<tr class="table__row table__row--daily">
        <td class="table__cell table__cell--daily" colspan="5">
          <h3>${dailyDatas.valuteName}</h3>
          <ol class="table__daily-list">
          </ol>
        </td>
      </tr>`;
    dailyDatas.context.insertAdjacentHTML('afterend', dailyRowTemplate);
    const dailyList = document.querySelector('.table__daily-list');
    dailyDatas.dailyCurrencyDatas.forEach((valute) => {
      const liItem = `<li><time>${valute.date} - </time><span>${valute.value}</span></li>`;
      dailyList.insertAdjacentHTML('beforeend', liItem);
    });
  },

  startStopLoader() {
    document.querySelector('.loader').classList.toggle('loader__active');
  }
}

export {
  render
}