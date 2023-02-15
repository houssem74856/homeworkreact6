import "./App.css";
import WeatherInfo from "./WeatherInfo";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  //api infos
  const apiKey1 = "84ce225763f54a37a11f320da0706b48";
  const apiKey2 = "QjyKX0BtwdPIF8QRIRXrxnLxEZOgqemn6MkNxfPw";
  const endpoint1 = "https://api.openweathermap.org/";
  const endpoint2 = "https://api.api-ninjas.com/v1/city?";

  //state
  const [city, setCity] = useState("Algiers");
  const [searchBarValue, setSearchBarValue] = useState("");
  const [citysSuggestions, setCitysSuggestions] = useState([]);
  const [weatherInfos, setWeatherInfos] = useState({
    temperature: null ,
    weather : null,
    wind : null
  });

  //LOGOS
  const LOGOS = {
    Rain: require("./images/rain.png"),
    Snow: require("./images/snowflake.png"),
    Clear: require("./images/sun.png"),
    Clouds: require("./images/cloud.png"),
    Thunderstorm: require("./images/thunderstorm.png"),
  };

  const [showWeather, setShowWeather] = useState(false);
  const [loading, setLoading] = useState(true);

  //fetching weather infos
  const fetchWeatherInfos = async () => {
    const lonlatRes = await axios(
      `${endpoint1}geo/1.0/direct?q=${city}&appid=${apiKey1}`
    );
    if (lonlatRes.status !== 200) {
      throw Error;
    }
    const lat = await lonlatRes.data[0].lat;
    const lon = await lonlatRes.data[0].lon;
    const weatherInfsRes = await axios(
      `${endpoint1}data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey1}&units=metric`
    );
    return weatherInfsRes.data;
  };

  //fetching suggestions
  const fetchSuggestions = async (SearchBarValue) => {
    const res = await axios(`${endpoint2}name=${SearchBarValue}&limit=5`,{headers:{'X-Api-Key': `${apiKey2}`}});
    return res.data;
  };


  //after fetching
  useEffect(() => {
    document.getElementById("cityName").style.borderRadius = '8px'
    setLoading(true);
    setShowWeather(false);
    document.getElementById("cityName").value = "";
    fetchWeatherInfos()
      .then((data) => {
        setWeatherInfos({
          temperature: data.main.temp,
          weather: data.weather[0].main,
          wind: data.wind.speed,
        })
        setLoading(false);
        setShowWeather(true);

        const weatherState = data.weather[0].main;
        document.getElementById("image").src = LOGOS[weatherState];
      })
      .catch(() => {
        setCity("ERROR : invalid city name");
        setShowWeather(false);
        document.getElementById("image").src = "";
        document.getElementById("image").alt = "";
        document.getElementById("cityName").value = "";
      });
  }, [city]);

  function fetchSuggestionsAndOrgenizeLis(SearchBarValue) {
    if(SearchBarValue) {
      fetchSuggestions(SearchBarValue).then((data) => {
        var fillerArr = [];

        for (let i = 0; i < data.length; i++) {
          fillerArr[i] = {
            name: data[i].name,
            id: i,
          };
        }
        if(fillerArr.length !== 0 ) {
          document.getElementById("cityName").style.borderRadius = '8px 8px 0 0'
        }
        else {document.getElementById("cityName").style.borderRadius = '8px'}
        setCitysSuggestions(fillerArr);
      });
    }
    else {
      setCitysSuggestions([])
      document.getElementById("cityName").style.borderRadius = '8px'
    }
  }


  //handlers
  const handleChangeSearchBarValue = (e) => {
    setSearchBarValue(e.target.value);
    fetchSuggestionsAndOrgenizeLis(e.target.value);
  };

  const handleClickSuggestion = (citySuggestion) => {
    setCity(citySuggestion.charAt(0).toUpperCase() + citySuggestion.slice(1))
    document.getElementById("cityName").style.borderRadius = '8px'
    setCitysSuggestions([]);
  };

  const handleClickSearchBtn = (e) => {
    e.preventDefault();
    setCitysSuggestions([]);
    setCity(searchBarValue.charAt(0).toUpperCase() + searchBarValue.slice(1))
  };

  return (
    <div className="App">
      <div className="weather-box">
        <form className="search-bar">
          <label id="cityLabel" htmlFor="cityName">City Name :</label>
          <div className="modalAndSearchPad">
            <input className="search-pad" id="cityName" placeholder="city" onChange={e => handleChangeSearchBarValue(e)}></input>
            <div className="modal">
              {citysSuggestions.map(citySuggestion => {
                return (
                  <li key={citySuggestion.id} onClick={() => handleClickSuggestion(citySuggestion.name)}>{citySuggestion.name}</li>
                );
              })}
              {citysSuggestions.length>0 && <div className="bottomPadding"></div>}
            </div>
          </div>
          <button type="submit" onClick={e => handleClickSearchBtn(e)} className="search-btn">Search</button>
        </form>
        <div className="city">
          <img id="image" src="" alt="Loading..." />
          <h1>{city}</h1>
        </div>
        <div className="weather-infos">
          {showWeather && (
            <>
              <WeatherInfo title="Temperature" quantity={weatherInfos.temperature + "°"}></WeatherInfo>
              <WeatherInfo title="Weather" quantity={weatherInfos.weather}></WeatherInfo>
              <WeatherInfo title="Wind" quantity={weatherInfos.wind + " Km/h"}></WeatherInfo>
            </>
          )}
          {loading && <h3 className="loading">Loading...</h3>}
        </div>
      </div>
    </div>
  );
}

export default App;


//box sizing : border box 
//css .class1 + .class2 