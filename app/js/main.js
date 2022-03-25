import {
  currencyRequest
} from './get_currency_datas.js'

import {
  render
} from './render_UI.js'

async function main() {
  const currentCurrencyDatas = await currencyRequest.getCurrentDatas();
  render.currentCurrencyList(currentCurrencyDatas);

  const currencyRows = document.querySelectorAll('.table__row--body');
  for (let currencyRow of currencyRows) {
    currencyRow.addEventListener('click', async (event) => {
      const rowItem = event.target.parentNode;
      const valuteName = rowItem.getAttribute('data-valute-name');
      const dailyCurrencyDatas = await currencyRequest.getDailyDatas(valuteName);
      const dailyDatas = {
        valuteName: valuteName,
        context: rowItem,
        dailyCurrencyDatas: dailyCurrencyDatas
      }
      render.dailyCurrencyList(dailyDatas);
    })
  }
}

main();