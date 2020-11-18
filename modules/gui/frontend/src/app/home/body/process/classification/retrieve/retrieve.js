import {Form} from 'widget/form/form'
import {Layout} from 'widget/layout'
import {Panel} from 'widget/panel/panel'
import {getBandOptions, RecipeActions} from '../classificationRecipe'
import {RecipeFormPanel, recipeFormPanel} from 'app/home/body/process/recipeFormPanel'
import {compose} from 'compose'
import {currentUser} from 'widget/user'
import {msg} from 'translate'
import {selectFrom} from 'stateUtils'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './retrieve.module.css'

const fields = {
    bands: new Form.Field()
        .predicate(bands => bands && bands.length, 'process.classification.panel.retrieve.form.bands.atLeastOne'),
    scale: new Form.Field(),
    destination: new Form.Field()
        .notEmpty('process.classification.panel.retrieve.form.destination.required')
}

const mapRecipeToProps = recipe => {
    const props = {}
    if (!selectFrom(recipe, 'ui.retrieve.scale')) {
        props.values = {scale: 30}
    }
    return {
        ...props,
        legend: selectFrom(recipe, 'model.legend') || {},
        classifierType: selectFrom(recipe, 'model.classifier.type')
    }
}

class Retrieve extends React.Component {
    render() {
        const {recipeId} = this.props
        return (
            <RecipeFormPanel
                className={styles.panel}
                isActionForm
                placement='top-right'
                onApply={values => RecipeActions(recipeId).retrieve(values).dispatch()}>
                <Panel.Header
                    icon='cloud-download-alt'
                    title={msg('process.classification.panel.retrieve.title')}/>

                <Panel.Content>
                    {this.renderContent()}
                </Panel.Content>

                <Form.PanelButtons
                    applyLabel={msg('process.classification.panel.retrieve.apply')}/>
            </RecipeFormPanel>
        )
    }

    renderContent() {
        const {legend, classifierType, inputs: {bands, scale, destination}} = this.props
        const user = currentUser()
        const destinationOptions = [
            {
                value: 'SEPAL',
                label: msg('process.mosaic.panel.retrieve.form.destination.SEPAL'),
                disabled: !user.googleTokens
            },
            {
                value: 'GEE',
                label: msg('process.mosaic.panel.retrieve.form.destination.GEE')
            }
        ].filter(({value}) => user.googleTokens || value !== 'GEE')

        const bandOptions = getBandOptions(legend, classifierType)

        return (
            <Layout>
                <Form.Buttons
                    label={msg('process.classification.panel.retrieve.form.bands.label')}
                    input={bands}
                    multiple={true}
                    options={bandOptions}/>
                <Form.Slider
                    label={msg('process.classification.panel.retrieve.form.scale.label')}
                    info={scale => msg('process.classification.panel.retrieve.form.scale.info', {scale})}
                    input={scale}
                    minValue={10}
                    maxValue={100}
                    scale={'log'}
                    ticks={[10, 15, 20, 30, 60, 100]}
                    snap
                    range='none'
                />
                <Form.Buttons
                    label={msg('process.classification.panel.retrieve.form.destination.label')}
                    input={destination}
                    multiple={false}
                    options={destinationOptions}/>
            </Layout>
        )
    }

    componentDidUpdate() {
        const {inputs: {destination}} = this.props
        const user = currentUser()
        if (!user.googleTokens && destination.value !== 'SEPAL')
            destination.set('SEPAL')
    }
}

Retrieve.propTypes = {
    recipeId: PropTypes.string,
    user: PropTypes.object
}

export default compose(
    Retrieve,
    recipeFormPanel({id: 'retrieve', fields, mapRecipeToProps})
)
