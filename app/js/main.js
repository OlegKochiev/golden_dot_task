function currencyRequest() {
  fetch('https://www.cbr-xml-daily.ru/daily_json.js')
    .then(response => response.json())
    .then(currencyDatas => {
      renderCurrencyDatas(currencyDatas);
    })
}


function renderCurrencyDatas(currencyDatas) {
  const ul = document.querySelector('.currency__list');
  const currencyList = currencyDatas.Valute;
  let counter = 0;
  for (let item in currencyList) {
    ul.appendChild(getLiItem(currencyList[item], counter))
    counter++;
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

  return liItem;
}
currencyRequest()











// const forecastsCount = 5;
// const apiKey = '1041b355b3b6422eb66d9f5e517f7b52';

// function doWeatherRequest(city, requestType) {
//   const url = getUrl(city, requestType);
//   return fetch(url)
//     .then(response => {
//       if (response.ok) {
//         return response.json()
//       } else {
//         throw new Error("Укажите верное название города!");
//       }
//     })
//     .then((weatherDatas) => {
//       switch (requestType) {
//         case REQUEST.WEATHER:
//           return {
//             city: weatherDatas.name,
//               temperature: Math.round(weatherDatas.main.temp - 273),
//               feels_like: Math.round(weatherDatas.main.feels_like - 273),
//               weather: weatherDatas.weather[0].main,
//               sunrise: weatherDatas.sys.sunrise,
//               sunset: weatherDatas.sys.sunset,
//               icon: weatherDatas.weather[0].icon,
//               isFavourite: false
//           };
//         case REQUEST.FORECAST:
//           return {
//             city: weatherDatas.city.name,
//               list: getForecastHourly(weatherDatas)
//           }
//       }
//     })
// }

// function getUrl(city, requestType) {
//   let url;
//   switch (requestType) {
//     case REQUEST.WEATHER:
//       url = `${URLS.WEATHER}?q=${city}&appid=${apiKey}`;
//       break;
//     case REQUEST.FORECAST:
//       url = `${URLS.FORECAST}?q=${city}&appid=${apiKey}&units=metric&cnt=${forecastsCount}`;
//       break;
//   }
//   return url;
// }

// function getForecastHourly(forecastDatas) {
//   let forecastHours = forecastDatas.list.map((item) => {
//     return {
//       date: (new Date(item.dt * 1000)).toString().substring(4, 11),
//       time: (new Date(item.dt * 1000)).toLocaleTimeString().substring(0, 5),
//       temperature: item.main.temp,
//       feelsLike: item.main.feels_like,
//       weather: item.weather[0].main,
//       icon: item.weather[0].icon
//     }
//   });
//   return forecastHours;
// }

// export {
//   doWeatherRequest
// }