var fetchButton = document.getElementById('fetch-button');

function getApi() {
    var requestUrl = 'http://api.openweathermap.org/data/2.5/weather?q=seattle&appid=78abf1645c10d4d2a08a11c2dedbd37f';
  
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
          var date = document.createElement('h3');
          var temp = document.createElement('p');
          var wind = document.createElement('p');
          var humidity = document.createElement('p');
          var uv = document.createElement('p');
          date.textContent = data[i].daily.dt;  
          temp.textContent = data[i].main.temp;
          wind.textContent = data[i].wind.speed;
          humidity.textContent = data[i].main.humidity;
          uv.textContent = data[i].current.uvi;
          console.log(date);
          console.log(temp);
          console.log(wind);
          console.log(humidity);
          console.log(uv);

        //   usersContainer.append(userName);
        //   usersContainer.append(userUrl);
        }
      });
  }
  fetchButton.addEventListener('click', getApi);
  