import './App.css';
import WeatherInfo from './WeatherInfo';
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { newCity } from './features/city'
import { getWeatherInfos } from './features/weatherInfos'
import axios from 'axios'
 
function App() {

  const appid1 = '84ce225763f54a37a11f320da0706b48'
  const appid2 = '5f12f40a549244caa448571b19ae8b18'
  const endpoint1 = 'https://api.openweathermap.org/'
  const endpoint2 = 'https://api.geoapify.com/v1/geocode/search'
  const [cityName,setCityName] = useState('')
  const {city} = useSelector((state) => state.city)
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
  const [citys,setCitys] = useState([])

  const settingweather = async () => {
    const lonlatRes = await axios(`${endpoint1}geo/1.0/direct?q=${city}&appid=${appid1}`)
    if(lonlatRes.status !== 200) {
      throw Error
    }
    const lat = await lonlatRes.data[0].lat
    const lon = await lonlatRes.data[0].lon
    const weatherInfsRes = await axios(`${endpoint1}data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appid1}&units=metric`)
    return weatherInfsRes.data
  }

  useEffect(() => {
    settingweather()
    .then(data => {
      dispatch(getWeatherInfos({temperature: data.main.temp,weather: data.weather[0].main ,wind :data.wind.speed}))
      setLoading(false)
      setShowWeather(true)
      const weatherState = data.weather[0].main
      document.getElementById("image").src = LOGOS[weatherState];
      document.getElementById("cityName").value = ''
    })
    .catch(() => {
      dispatch(newCity({city: 'ERROR : invalid city name'}))
      setShowWeather(false)
      document.getElementById("image").src = ''
      document.getElementById("image").alt = ''
      document.getElementById("cityName").value = ''
    })
  },[city])

  const autocomplete = async (autocompleteCity) => {
    const res = await axios(`${endpoint2}?text=${autocompleteCity}&limit=5&type=city&apiKey=${appid2}`)
    return res.data.features
  }

  function consoleCity(autocompleteCity) {
    autocomplete(autocompleteCity)
    .then(res => {
      var citysmod = []
      
      for(let i=0;i<res.length;i++) {
        citysmod[i]={
          name : res[i].properties.address_line1,
          id : i
        }
      }

      setCitys(citysmod)
    })
  }
   
  return (
    <div className="App">
      <div className='weather-box'>
        <form className="search-bar">
          <label id="cityLabel" htmlFor="cityName">City Name :</label>
          <input className='search-pad' id='cityName' placeholder='city' onChange={(e) => {
            setCityName(e.target.value)
            if(e.target.value) consoleCity(e.target.value)}}>
          </input>
          <button type="submit" onClick={(e) => {
            e.preventDefault()
            setCitys([])
            dispatch(newCity({city : cityName.charAt(0).toUpperCase() + cityName.slice(1)}))
          }} className='search-btn'>Search</button>
        </form>
        <div className="modal">
          {citys.map(city => {
            return (
              <li key={city.id} onClick={() => {
                dispatch(newCity({city : city.name.charAt(0).toUpperCase() + city.name.slice(1)}))
                setCitys([])
              }}>{city.name}</li>
            )
          })}
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
