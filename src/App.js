import './App.css';
import WeatherInfo from './WeatherInfo';
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { newLonLat,newCity } from './features/city'
import { getWeatherInfos } from './features/weatherInfos'
 
function App() {
  const [cityName,setCityName] = useState('')
  const {city,lon,lat} = useSelector((state) => state.city)
  const {temperature,weather,wind} = useSelector((state) => state.weatherInfos)
  const dispatch = useDispatch()
  const LOGOS = {
    'Rain': require('./images/rain.png'),
    'Snow': require('./images/snowflake.png'),
    'Clear': require('./images/sun.png'),
    'Clouds': require('./images/cloud.png'),
    'Thunderstorm': require('./images/thunderstorm.png')
  }
  const [showWeather,setShowWeather] = useState(false)
  const [loading,setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=84ce225763f54a37a11f320da0706b48`)
    .then(res => {
      if(!res.ok) {
        throw Error
      }
      return res.json()
    })
    .then(data => dispatch(newLonLat({lon : data[0].lon,lat : data[0].lat}))) 
    .catch(() => {
      dispatch(newCity({city: 'ERROR : invalid city name'}))
      setShowWeather(false)
      document.getElementById("image").src = ''
      document.getElementById("image").alt = ''
    })
  },[city])

  useEffect(() => {
    if(lon) {fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=84ce225763f54a37a11f320da0706b48&units=metric`)
    .then(res => res.json())
    .then(data => {
      dispatch(getWeatherInfos({temperature: data.main.temp,weather: data.weather[0].main ,wind :data.wind.speed}))
      setLoading(false)
      setShowWeather(true)
      const weatherState = data.weather[0].main
      document.getElementById("image").src = LOGOS[weatherState];
    })
  }},[lon])

  return (
    <div className="App">
      <div className='weather-box'>
        <div className="search-bar">
          <input className='search-pad' placeholder='city' onChange={(e) => setCityName(e.target.value)}></input>
          <button onClick={() => dispatch(newCity({city: cityName}))} className='search-btn'>Search</button>
        </div>
        <div className="city">
          <img id='image' src='' alt='Loading...' />
          <h1>{city}</h1>
        </div>
        <div className="weather-infos">
          {showWeather && <><WeatherInfo title="Temperature" quantity={temperature+'°'}></WeatherInfo>
          <WeatherInfo title="Weather" quantity={weather}></WeatherInfo>
          <WeatherInfo title="Wind" quantity={wind+' Km/h'}></WeatherInfo></>}
          {loading && <h3 className='loading'>Loading...</h3>} 
        </div>
      </div>
    </div>
  );
}

export default App;
