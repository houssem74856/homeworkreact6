import "./index.css"

export default function WeatherInfo({title,quantity}) {
    return (
        <div className="weather-info">
            <p className="title">{title}</p>
            <h2 className="quantity">{quantity}</h2>
        </div>
    )
}