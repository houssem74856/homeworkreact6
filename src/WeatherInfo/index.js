import "./index.css"

export default function WeatherInfo({title,quantity}) {
    return (
        <div className="weather-info">
            <p>{title}</p>
            <h2>{quantity}</h2>
        </div>
    )
}