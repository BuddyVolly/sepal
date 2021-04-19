import {EETableLayer} from './eeTableLayer'
import {PolygonLayer} from './polygonLayer'
import React from 'react'

export const countryEETable = 'users/wiell/SepalResources/countries'

export const removeAoiLayer = map => {
    map.removeLayer('Aoi')
}

const color = '#FFFFFF50'
const fillColor = '#FFFFFF08'

export const countryToEETable = aoi => ({
    type: 'EE_TABLE',
    id: countryEETable,
    keyColumn: 'id',
    key: aoi.areaCode || aoi.countryCode,
    buffer: aoi.buffer,
    color,
    fillColor
})

export const AoiLayer = ({id, layerConfig = {}, layerIndex, map, recipe}) => {
    const aoi = layerConfig.aoi || recipe.model.aoi
    if (!aoi) {
        return null
    }
    const aoiType = aoi.type
    switch (aoiType) {
    case 'COUNTRY':
        return <EETableLayer
            id={id}
            map={map}
            tableId={countryEETable}
            columnName='id'
            columnValue={aoi.areaCode || aoi.countryCode}
            buffer={aoi.buffer}
            color={color}
            fillColor={fillColor}
            layerIndex={layerIndex}
            watchedProps={aoi}
        />
    case 'EE_TABLE':
        return <EETableLayer
            id={id}
            map={map}
            tableId={aoi.id}
            columnName={aoi.keyColumn}
            columnValue={aoi.key}
            buffer={aoi.buffer}
            color={color}
            fillColor={fillColor}
            layerIndex={layerIndex}
            watchedProps={aoi}
        />
    case 'POLYGON':
        return <PolygonLayer
            id={id}
            map={map}
            path={aoi.path}
            fill={false} // TODO: Should fill sometimes
            color={color}
            fillColor={fillColor}
        />

    default:
        throw Error(`Unsupported AOI type: ${aoiType}`)
    }
}

// TODO: Remove
export const setAoiLayer = () => {
}
