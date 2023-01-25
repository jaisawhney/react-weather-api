interface props {
    code: number,
    msg: string
    temp: number,
    feelsLike: number,
    description: string,
    icon: string,
}

export default function WeatherData(props: props) {
    const {code, msg, temp, feelsLike, description, icon} = props;

    if (code !== 200) return (
        <div className={'APIErrorMsg'}>
            <h1>{code}</h1>
            <p>{msg}</p>
        </div>
    )

    return (
        <div className={'WeatherData'}>
            <div style={{alignSelf: 'center'}}>
                <h1>{temp}</h1>
                <p>{description}</p>
                <small>Feels like {feelsLike}</small>
            </div>
            <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={'Weather Icon'}/>
        </div>
    );
}

