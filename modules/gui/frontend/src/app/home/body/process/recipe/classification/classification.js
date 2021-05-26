import {Aoi} from '../aoi'
import {DataCollectionContext, DataCollectionManager} from './dataCollectionManager'
import {Map} from 'app/home/map/map'
import {compose} from 'compose'
import {getDefaultModel} from './classificationRecipe'
import {initializeLayers} from '../recipeImageLayerSource'
import {msg} from 'translate'
import {recipe} from 'app/home/body/process/recipeContext'
import {selectFrom} from 'stateUtils'
import ClassificationToolbar from './panels/classificationToolbar'
import CollectPanel from './panels/collect/collectPanel'
import React from 'react'

const mapRecipeToProps = recipe => ({
    initialized: selectFrom(recipe, 'ui.initialized'),
    images: selectFrom(recipe, 'model.inputImagery.images'),
    layers: selectFrom(recipe, 'layers')
})

class _Classification extends React.Component {

    constructor(props) {
        super(props)
        const {layers, recipeId} = props
        this.dataCollectionManager = new DataCollectionManager(recipeId)
        initializeLayers(recipeId, layers, [
            {
                id: 'referenceData',
                type: 'ReferenceData',
                description: msg('featureLayerSources.ReferenceData.description'),
                defaultEnabled: true
            }
        ])
    }

    render() {
        const {initialized, images} = this.props
        return (
            <DataCollectionContext.Provider value={{dataCollectionManager: this.dataCollectionManager}}>
                <Map>
                    <ClassificationToolbar dataCollectionManager={this.dataCollectionManager}/>
                    <Aoi value={images && images.length && images[0]}/>
                    {initialized
                        ? (
                            <CollectPanel dataCollectionManager={this.dataCollectionManager}/>
                        )
                        : null}
                </Map>
            </DataCollectionContext.Provider>
        )
    }
}

const Classification = compose(
    _Classification,
    recipe({getDefaultModel, mapRecipeToProps})
)

export default () => ({
    id: 'CLASSIFICATION',
    labels: {
        name: msg('process.classification.create'),
        creationDescription: msg('process.classification.description'),
        tabPlaceholder: msg('process.classification.tabPlaceholder'),
    },
    components: {
        recipe: Classification
    }
})
