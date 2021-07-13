import {Button} from 'widget/button'
import {Form} from 'widget/form/form'
import {Layout} from 'widget/layout'
import {Panel} from 'widget/panel/panel'
import {RecipeActions} from '../../ccdcSliceRecipe'
import {RecipeFormPanel, recipeFormPanel} from 'app/home/body/process/recipeFormPanel'
import {compose} from 'compose'
import {currentUser} from 'user'
import {msg} from 'translate'
import {selectFrom} from 'stateUtils'
import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'
import styles from './retrieve.module.css'

const fields = {
    baseBands: new Form.Field()
        .predicate(selection => selection && selection.length, 'process.ccdcSlice.panel.retrieve.form.baseBands.atLeastOne'),
    bandTypes: new Form.Field()
        .predicate(selection => selection && selection.length, 'process.ccdcSlice.panel.retrieve.form.bandTypes.atLeastOne'),
    segmentBands: new Form.Field(),
    scale: new Form.Field()
        .notBlank()
        .number(),
    destination: new Form.Field()
        .notEmpty('process.ccdcSlice.panel.retrieve.form.destination.required')
}

const mapRecipeToProps = recipe => ({
    baseBands: selectFrom(recipe, 'model.source.baseBands'),
    segmentBands: selectFrom(recipe, 'model.source.segmentBands'),
    user: currentUser()
})

class Retrieve extends React.Component {
    state = {
        customScale: false
    }

    constructor(props) {
        super(props)
        const {recipeId, inputs: {scale}} = this.props
        this.recipeActions = RecipeActions(recipeId)
        if (!scale.value)
            scale.set(30)
    }

    render() {
        return (
            <RecipeFormPanel
                className={styles.panel}
                isActionForm
                placement='top-right'
                onApply={values => this.recipeActions.retrieve(values).dispatch()}>
                <Panel.Header
                    icon='cloud-download-alt'
                    title={msg('process.ccdcSlice.panel.retrieve.title')}/>
                <Panel.Content>
                    {this.renderContent()}
                </Panel.Content>
                <Form.PanelButtons
                    applyLabel={msg('process.ccdcSlice.panel.retrieve.apply')}/>
            </RecipeFormPanel>
        )
    }

    renderContent() {
        return (
            <Layout>
                {this.renderBaseBands()}
                {this.renderBandTypes()}
                {this.renderSegmentBands()}
                {this.renderScale()}
                {this.renderDestination()}
            </Layout>
        )
    }

    renderBaseBands() {
        const {baseBands, inputs} = this.props
        const bandOptions = baseBands.map(({name}) => ({value: name, label: name}))

        return (
            <Form.Buttons
                label={msg('process.ccdcSlice.panel.retrieve.form.baseBands.label')}
                input={inputs.baseBands}
                multiple
                options={bandOptions}/>
        )
    }

    renderBandTypes() {
        const {baseBands, inputs} = this.props
        const bandTypes = _.uniq(baseBands.map(({bandTypes}) => bandTypes).flat())
        const bandTypeOptions = [
            {
                value: 'value',
                label: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.value.label'),
                tooltip: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.value.tooltip')
            },
            {
                value: 'rmse',
                label: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.rmse.label'),
                tooltip: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.rmse.tooltip')
            },
            {
                value: 'magnitude',
                label: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.magnitude.label'),
                tooltip: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.magnitude.tooltip')
            },
            {
                value: 'intercept',
                label: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.intercept.label'),
                tooltip: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.intercept.tooltip')
            },
            {
                value: 'slope',
                label: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.slope.label'),
                tooltip: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.slope.tooltip')
            },
            {
                value: 'phase_1',
                label: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.phase1.label'),
                tooltip: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.phase1.tooltip')
            },
            {
                value: 'phase_2',
                label: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.phase2.label'),
                tooltip: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.phase2.tooltip')
            },
            {
                value: 'phase_3',
                label: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.phase3.label'),
                tooltip: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.phase3.tooltip')
            },
            {
                value: 'amplitude_1',
                label: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.amplitude1.label'),
                tooltip: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.amplitude1.tooltip')
            },
            {
                value: 'amplitude_2',
                label: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.amplitude2.label'),
                tooltip: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.amplitude2.tooltip')
            },
            {
                value: 'amplitude_3',
                label: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.amplitude3.label'),
                tooltip: msg('process.ccdcSlice.panel.retrieve.form.bandTypes.amplitude3.tooltip')
            }
        ].filter(({value}) => bandTypes.includes(value))
        return (
            <Form.Buttons
                label={msg('process.ccdcSlice.panel.retrieve.form.bandTypes.label')}
                input={inputs.bandTypes}
                multiple
                options={bandTypeOptions}/>
        )
    }

    renderSegmentBands() {
        const {segmentBands, inputs} = this.props
        const bands = segmentBands.map(({name}) => name)
        const options = [
            {
                value: 'tStart',
                label: msg('process.ccdcSlice.panel.retrieve.form.segmentBands.tStart.label'),
                tooltip: msg('process.ccdcSlice.panel.retrieve.form.segmentBands.tStart.tooltip')
            },
            {
                value: 'tEnd',
                label: msg('process.ccdcSlice.panel.retrieve.form.segmentBands.tEnd.label'),
                tooltip: msg('process.ccdcSlice.panel.retrieve.form.segmentBands.tEnd.tooltip')
            },
            {
                value: 'tBreak',
                label: msg('process.ccdcSlice.panel.retrieve.form.segmentBands.tBreak.label'),
                tooltip: msg('process.ccdcSlice.panel.retrieve.form.segmentBands.tBreak.tooltip')
            },
            {
                value: 'numObs',
                label: msg('process.ccdcSlice.panel.retrieve.form.segmentBands.numObs.label'),
                tooltip: msg('process.ccdcSlice.panel.retrieve.form.segmentBands.numObs.tooltip')
            },
            {
                value: 'changeProb',
                label: msg('process.ccdcSlice.panel.retrieve.form.segmentBands.changeProb.label'),
                tooltip: msg('process.ccdcSlice.panel.retrieve.form.segmentBands.changeProb.tooltip')
            }
        ].filter(({value}) => bands.includes(value))
        return options.length
            ? (
                <Form.Buttons
                    label={msg('process.ccdcSlice.panel.retrieve.form.segmentBands.label')}
                    tooltip={msg('process.ccdcSlice.panel.retrieve.form.segmentBands.tooltip')}
                    input={inputs.segmentBands}
                    multiple
                    options={options}/>
            )
            : null
    }

    renderScale() {
        const {customScale} = this.state
        return customScale
            ? this.renderCustomScale()
            : this.renderPresetScale()
    }

    renderPresetScale() {
        const {inputs: {scale}} = this.props
        return (
            <div>
                <Form.Slider
                    label={msg('process.retrieve.form.scale.label')}
                    info={scale => msg('process.retrieve.form.scale.info', {scale})}
                    input={scale}
                    minValue={10}
                    maxValue={100}
                    scale={'log'}
                    ticks={[10, 15, 20, 30, 60, 100]}
                    snap
                    range='none'
                />
                <div className={styles.scaleChange}>
                    <Button
                        shape={'none'}
                        label={'Custom scale'}
                        onClick={() => this.setState({customScale: true})}
                    />
                </div>
            </div>
        )
    }

    renderCustomScale() {
        const {inputs: {scale}} = this.props
        return (
            <div>
                <Form.Input
                    label={msg('process.retrieve.form.scale.label')}
                    input={scale}
                    placeholder={msg('process.retrieve.form.scale.label')}
                />
                <div className={styles.scaleChange}>
                    <Button
                        shape={'none'}
                        label={'Preset scale'}
                        onClick={() => this.setState({customScale: false})}
                    />
                </div>
            </div>
        )
    }

    renderDestination() {
        const {user, inputs: {destination}} = this.props
        const destinationOptions = [
            {
                value: 'SEPAL',
                label: msg('process.ccdcSlice.panel.retrieve.form.destination.SEPAL'),
                disabled: !user.googleTokens
            },
            {
                value: 'GEE',
                label: msg('process.ccdcSlice.panel.retrieve.form.destination.GEE')
            }
        ].filter(({value}) => user.googleTokens || value !== 'GEE')
        return (
            <Form.Buttons
                label={msg('process.ccdcSlice.panel.retrieve.form.destination.label')}
                input={destination}
                multiple={false}
                options={destinationOptions}/>
        )
    }
}

Retrieve.propTypes = {
    recipeId: PropTypes.string
}

export default compose(
    Retrieve,
    recipeFormPanel({id: 'retrieve', fields, mapRecipeToProps})
)
