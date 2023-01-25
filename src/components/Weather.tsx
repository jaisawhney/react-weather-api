import './Weather.css';
import {FormEvent, useEffect, useState} from 'react';
import WeatherData from './WeatherData';

interface weatherData {
    code: number,
    msg: string,
    temp: number,
    feelsLike: number,
    description: string,
    icon: string
}

export default function Weather() {
    const [zip, setZip] = useState<string>('');
    const [unit, setUnit] = useState<string>('imperial');
    const [data, setData] = useState<weatherData | null>(null);

    // Fetch the weather from the API
    async function fetchWeather(path: string) {
        try {
            // Your OpenWeather API key here
            const key = '';

            const url = new URL(path)
            url.searchParams.append('appid', key);

            const res = await fetch(url.toString());
            const json = await res.json();

            setData({
                code: json.cod,
                msg: json.message,
                temp: json.main?.temp,
                feelsLike: json.main?.feels_like,
                description: json.weather?.[0].description,
                icon: json.weather?.[0].icon
            });
        } catch (err) {
            throw err;
        }
    }

    // Handle form submit
    function weatherFormSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        fetchWeather(`https://api.openweathermap.org/data/2.5/weather?zip=${zip}&units=${unit}`);
    }

    // Get the Geolocation of the visitor
    function getGeolocation(): Promise<{ coords: { latitude: number, longitude: number } }> {
        return new Promise((res, rej) => {
            navigator.geolocation.getCurrentPosition(res, rej);
        });
    }

    // Initially display the weather based on Geolocation
    useEffect(() => {
        const fetchGeoWeather = async () => {
            const position = await getGeolocation();
            const {latitude, longitude} = position.coords;

            const path = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial`;
            fetchWeather(path)
        }
        fetchGeoWeather()
    }, []);

    return (
        <div className={'weather'}>
            {data && <WeatherData {...data} />}
            <form onSubmit={weatherFormSubmit}>
                <input
                    placeholder={'Enter a zip code'}
                    value={zip}
                    maxLength={10}
                    onChange={e => setZip(e.target.value)}
                    required={true}
                />

                <select
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                >
                    <option value={'imperial'}>Fahrenheit</option>
                    <option value={'metric'}>Celsius</option>
                    <option value={'standard'}>Kelvin</option>
                </select>

                <button type={'submit'}>Submit</button>
            </form>
        </div>
    );
}

