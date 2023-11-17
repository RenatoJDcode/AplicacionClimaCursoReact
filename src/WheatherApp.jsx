import React from 'react'
import { useState } from 'react'

const WheatherApp = () => {

    const urlCity = 'http://api.openweathermap.org/geo/1.0/direct'
    const urlBase = 'https://api.openweathermap.org/data/2.5/weather'
    const API_KEY = 'ae71b332f986ef7b7657459967d8c9c7'
    const difKelvin = 273.15

    const [ciudad, setCiudad] = useState('')
    const [latLong, setLatLong] = useState([])
    const [dataClima, setDataClima] = useState(null)
    let latitud = 0
    let longitud = 0

    const handleCambioCiudad = (e) => {
        setCiudad(e.target.value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (ciudad.length > 0) {
            try {
                await fetchCoordenadas();
                fetchClima();
            } catch (error) {
                console.error('Ocurrió un problema:', error);
            }
        }
    }

    const fetchCoordenadas = async()=> {
        try {
            // http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}
            const response = await fetch (`${urlCity}?q=${ciudad}&appid=${API_KEY}`)
            const dataCityCoordenates  = await response.json()
            // setLatLong([dataCityCoordenates[0].lat,dataCityCoordenates[0].lon])
            latitud=dataCityCoordenates[0].lat
            longitud=dataCityCoordenates[0].lon
        } catch (error) {
            console.log('Ocurrio el siguiente problema',error);
        }
    }

    const fetchClima = async()=> {
        try {
            // https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
            // const response = await fetch (`${urlBase}?lat=${latLong[0]}&lon=${latLong[1]}&appid=${API_KEY}`)
            const response = await fetch (`${urlBase}?lat=${latitud}&lon=${longitud}&appid=${API_KEY}`)
            const dataCity  = await response.json()
            setDataClima(dataCity)
        } catch (error) {
            console.log('Ocurrio el siguiente problema',error);
        }
    }

  return (
    <div className='container'>
        
        <h1>Aplicacion de clima</h1>

        <form onSubmit={handleSubmit}>
            <input 
            type="text"
            value = {ciudad} 
            onChange={handleCambioCiudad}/>
            <button type="submit">Buscar el boton</button>
        </form>

        {
            dataClima &&
            <div>
                <h1>{dataClima.name}</h1>
                <p>Temperatura: {parseInt(dataClima?.main?.temp -difKelvin)}°C </p>
                <p>Condicion Meteorologica: {dataClima.weather[0].description} </p>
                <img src={`https://openweathermap.org/img/wn/${dataClima.weather[0].icon}@2x.png`}/>
            </div>
        }

    </div>
  )
}

export default WheatherApp