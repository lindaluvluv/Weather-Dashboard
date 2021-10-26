const API_KEY = `78abf1645c10d4d2a08a11c2dedbd37f`;

const getUVIColor = (uvi) => {
  if (uvi <= 4) {
    return "green";
  } else if (uvi <= 7) {
    return "orangered";
  } else {
    return "red";
  }
};

const getCityWeathers = async (city) => {
  let res, data, lat, lon;
  // get lat, lon of city
  res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
  );
  data = await res.json();
  lat = data.coord.lat;
  lon = data.coord.lon;
  // get current weather and future weathers
  res = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&exclude=hourly,minutely`
  );
  data = await res.json();
  return data;
};

const getCityDataFromLocal = () => {
  try {
    const datas = JSON.parse(localStorage.getItem("history"));
    return datas || [];
  } catch (err) {
    return [];
  }
};

const saveCityData = (city) => {
  let cityData = getCityDataFromLocal();
  const oldCity = cityData.find((item) => item.name === city.name);
  if (!oldCity) {
    cityData.push(city);
  }
  cityData = cityData.map((item) => {
    item.activated = item.name === city.name;
    return item;
  });

  localStorage.setItem("history", JSON.stringify(cityData));
};

const hasCity = (cityName) => {
  const cityData = getCityDataFromLocal();
  const cityExist = cityData.find((item) => item.name === cityName);
  return cityExist;
};

const handleClickSearch = async () => {
  try {
    const weathers = await getCityWeathers(city);

    saveCityData({ name: city, weathers });
  } catch (err) {
    alert(err);
  }
};

const handleClickOldCity = (cityName) => {
  const cityData = getCityDataFromLocal();
  if (!cityData) return;
  cityData.forEach((item) => {
    item.activated = item.name === cityName;
  });
  localStorage.setItem("history", JSON.stringify(cityData));
  render();
};

const renderHistory = () => {
  const historyDom = document.getElementById("history");
  const cityData = getCityDataFromLocal();
  if (Array.isArray(cityData)) {
    let innerHTML = "";
    cityData.forEach((city) => {
      innerHTML += `<button onclick="handleClickOldCity('${city.name}')" class='btn btn-success'>${city.name}</button>`;
    });
    historyDom.innerHTML = innerHTML;
  }
};
const renderCityToHtml = (
  cityName,
  temputure,
  humidity,
  windSpeed,
  uvi,
  icon,
  date
) => {
  return `
<div class="card" style="width: 300px">
  <div class="card-body">
    <h5 class="card-title">
      ${cityName ? `<span>${cityName}</span>` : ""}
      <img
        class="icon"
        src="http://openweathermap.org/img/wn/${icon}@2x.png"
      />
      <small>${new Date(date).toLocaleDateString()}</small>
    </h5>
    <p class="card-text">Temputure: <span id="temputure">${temputure}</span>°C</p>
    <p class="card-text">Humidity: <span id="humidity">${humidity}</span>%rh</p>
    <p class="card-text">
      Wind Speed: <span id="wind-speed">${windSpeed}</span>km/h
    </p>
    <p class="card-text">
      UVI: <span id="uvi">${uvi}</span>mW/㎡<span class="circle" style="background: ${getUVIColor(
    uvi
  )}"></span>
    </p>
  </div>
</div>`;
};
const renderWeathers = () => {
  const cityData = getCityDataFromLocal();
  const activatedCity = cityData.find((item) => item.activated);
  if (activatedCity) {
    const weathers = activatedCity.weathers;

    const futureWeathers = weathers.daily.slice(1, 6);
    // render current weather
    let innerHTML = renderCityToHtml(
      activatedCity.name,
      Math.ceil(weathers.current.temp / 10),
      weathers.current.humidity,
      weathers.current.wind_speed,
      weathers.current.uvi,
      weathers.current.weather[0].icon,
      weathers.current.dt * 1000
    );
    document.getElementById("current-weather").innerHTML = innerHTML;
    // render future weathers
    innerHTML = "";
    futureWeathers.forEach((item) => {
      innerHTML += renderCityToHtml(
        null,
        Math.ceil(item.temp.day / 10),
        item.humidity,
        item.wind_speed,
        item.uvi,
        item.weather[0].icon,
        new Date(item.dt * 1000)
      );
    });
    document.getElementById("future-weather").innerHTML = innerHTML;
  }
};

const render = () => {
  renderHistory();
  renderWeathers();
};

const setUp = () => {
  render();
};
setUp();

let city = "San Diego";

document.getElementById("fetch-button").addEventListener("click", async () => {
  await handleClickSearch();
  render();
});
document
  .getElementById("searchInput")
  .addEventListener("change", (e) => (city = e.target.value));
