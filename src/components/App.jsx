import React, { useEffect, useState, useMemo, useCallback } from 'react';
import * as YA from 'react-yandex-maps';
// styles:
import "shards-ui/dist/css/shards.min.css"
import { Button } from 'shards-react'



const App = () => {
    const [issData, setIssData] = useState(null)
    const [issPullOfCoords, setPullOfCoords] = useState([])


    const getRealISSPos = useCallback(async () => {
        return fetch('https://api.wheretheiss.at/v1/satellites/25544')
        .then((resp) => resp.json())
        .then((resp) => {
                setIssData(resp)
                setPullOfCoords(i => [...i, [resp.latitude, resp.longitude]])
        })
    }, [])

    useEffect(() => {
        // обновление
        const intervalUpdate = setTimeout(() => {
            getRealISSPos()
        }, 10_000)

        return () => clearTimeout(intervalUpdate)
    }, [getRealISSPos, issPullOfCoords])

    useEffect(() => {
        getRealISSPos()
    }, [getRealISSPos])


    const issPos = useMemo(() => {
        return issData ? {
            center: [issData.latitude, issData.longitude],
            zoom: 4
        } : { center: [55.751574, 37.573856], zoom: 5 }
    }, [issData])

    return (
        <React.StrictMode>
            <div style={{
                textAlign: 'center',
                marginBottom: '40px',
                display: 'block',
            }}>
                <h1 style={{ fontWeight: 'bold' }}> Where is ISS now? </h1>
                 <Button onClick={getRealISSPos}> Update ISS Position</Button>
            </div>
            {/* Loaded data from API: {issPos.center.toString()}<br /> */}
            {issData && 
            <YA.YMaps >
                <YA.Map width="100vw" height="300px" defaultState={issPos}>
                    <YA.Placemark geometry={issPos.center} options={{
                    iconLayout: "default#image",
                    iconShadow: true,
                    
                    iconImageHref: 'https://icons.iconarchive.com/icons/goodstuff-no-nonsense/free-space/512/international-space-station-icon.png',
                    // The size of the placemark.
                    iconImageSize: [40, 40],
                    iconImageOffset: [0, 0]
                }}/>
                <YA.ZoomControl />
                <YA.GeoObject
                    geometry={{
                        type: 'LineString',
                        coordinates: [
                            ...issPullOfCoords
                        ],
                    }}
                    options={{
                        geodesic: true,
                        strokeWidth: 5,
                        strokeColor: '#F008',
                    }}
                    />
            </YA.Map>
            </YA.YMaps>}
        </React.StrictMode>
    )
}


export default App;