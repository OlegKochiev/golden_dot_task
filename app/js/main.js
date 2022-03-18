function currencyRequest() {
  fetch('https://www.cbr-xml-daily.ru/daily_json.js')
    .then(response => response.json())
    .then(currencyDatas => {
      document.querySelector('.test').innerHTML = currencyDatas.toString();
      console.log(currencyDatas);
      renderCurrencyDatas(currencyDatas);
    })
}


function renderCurrencyDatas(currencyDatas) {
  const ul = document.querySelector('.currency__list');
  const valuteList = currencyDatas.Valute
  for (let item in valuteList) {
    const different = ((Number(valuteList[item].Value) - Number(valuteList[item].Previous)) / Number(valuteList[item].Value) * 100).toFixed(2);
    let li =
      `
      <li class="currency__item">
        <span class="currency__count"></span>
        <span class="currency__code">${ valuteList[item].NumCode }</span>
        <span class="currency__name">${ valuteList[item].CharCode }</span>
        <span class="currency__value">${ valuteList[item].Value }</span>
        <span class="currency__diff">${ different }%</span>
        <span class="currency__tooltip">${ valuteList[item].Name }</span>
      </li>
    `;
    ul.innerHTML += li;
    const lastLi = ul.lastChild.previousSibling;
    lastLi.addEventListener('click', (event) => {

    })
  }

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