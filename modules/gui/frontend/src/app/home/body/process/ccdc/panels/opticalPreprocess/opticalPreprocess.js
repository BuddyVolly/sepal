import {Form} from 'widget/form/form'
import {Layout} from 'widget/layout'
import {Panel} from 'widget/panel/panel'
import {RecipeActions} from '../../ccdcRecipe'
import {RecipeFormPanel, recipeFormPanel} from 'app/home/body/process/recipeFormPanel'
import {compose} from 'compose'
import {msg} from 'translate'
import React from 'react'
import styles from './opticalPreprocess.module.css'

const fields = {
    corrections: new Form.Field(),
    cloudMasking: new Form.Field(),
    shadowMasking: new Form.Field(),
    snowMasking: new Form.Field()
}

class OpticalPreprocess extends React.Component {
    constructor(props) {
        super(props)
        this.recipeActions = RecipeActions(props.recipeId)
    }

    render() {
        return (
            <RecipeFormPanel
                className={styles.panel}
                placement='bottom-right'>
                <Panel.Header
                    icon='cog'
                    title={msg('process.ccdc.panel.preprocess.title')}/>
                <Panel.Content>
                    <Layout>
                        {this.renderCorrectionsOptions()}
                        {this.renderCloudMaskingOptions()}
                        {this.renderShadowMaskingOptions()}
                        {this.renderSnowMaskingOptions()}
                    </Layout>
                </Panel.Content>
                <Form.PanelButtons/>
            </RecipeFormPanel>
        )
    }

    renderCorrectionsOptions() {
        const {inputs: {corrections}} = this.props
        return (
            <Form.Buttons
                label={msg('process.ccdc.panel.preprocess.form.corrections.label')}
                input={corrections}
                multiple={true}
                options={[{
                    value: 'SR',
                    label: msg('process.ccdc.panel.preprocess.form.corrections.surfaceReflectance.label'),
                    tooltip: msg('process.ccdc.panel.preprocess.form.corrections.surfaceReflectance.tooltip')
                }, {
                    value: 'BRDF',
                    label: msg('process.ccdc.panel.preprocess.form.corrections.brdf.label'),
                    tooltip: msg('process.ccdc.panel.preprocess.form.corrections.brdf.tooltip')
                }]}
            />
        )
    }

    renderCloudMaskingOptions() {
        const {inputs: {cloudMasking}} = this.props
        return (
            <Form.Buttons
                label={msg('process.ccdc.panel.preprocess.form.cloudMasking.label')}
                input={cloudMasking}
                options={[{
                    value: 'MODERATE',
                    label: msg('process.ccdc.panel.preprocess.form.cloudMasking.moderate.label'),
                    tooltip: msg('process.ccdc.panel.preprocess.form.cloudMasking.moderate.tooltip')
                }, {
                    value: 'AGGRESSIVE',
                    label: msg('process.ccdc.panel.preprocess.form.cloudMasking.aggressive.label'),
                    tooltip: msg('process.ccdc.panel.preprocess.form.cloudMasking.aggressive.tooltip')
                }]}
                type='horizontal-wrap'
            />
        )
    }

    renderShadowMaskingOptions() {
        const {inputs: {shadowMasking}} = this.props
        return (
            <Form.Buttons
                label={msg('process.ccdc.panel.preprocess.form.shadowMasking.label')}
                input={shadowMasking}
                options={[{
                    value: 'OFF',
                    label: msg('process.ccdc.panel.preprocess.form.shadowMasking.off.label'),
                    tooltip: msg('process.ccdc.panel.preprocess.form.shadowMasking.off.tooltip')
                }, {
                    value: 'ON',
                    label: msg('process.ccdc.panel.preprocess.form.shadowMasking.on.label'),
                    tooltip: msg('process.ccdc.panel.preprocess.form.shadowMasking.on.tooltip')
                }]}
                type='horizontal-nowrap'
            />
        )
    }

    renderSnowMaskingOptions() {
        const {inputs: {snowMasking}} = this.props
        return (
            <Form.Buttons
                label={msg('process.ccdc.panel.preprocess.form.snowMasking.label')}
                input={snowMasking}
                options={[{
                    value: 'OFF',
                    label: msg('process.ccdc.panel.preprocess.form.snowMasking.off.label'),
                    tooltip: msg('process.ccdc.panel.preprocess.form.snowMasking.off.tooltip')
                }, {
                    value: 'ON',
                    label: msg('process.ccdc.panel.preprocess.form.snowMasking.on.label'),
                    tooltip: msg('process.ccdc.panel.preprocess.form.snowMasking.on.tooltip')
                }]}
                type='horizontal-nowrap'
            />
        )
    }
}

OpticalPreprocess.propTypes = {}

const valuesToModel = values => ({
    corrections: values.corrections,
    cloudMasking: values.cloudMasking,
    shadowMasking: values.shadowMasking,
    snowMasking: values.snowMasking,
})

const modelToValues = model => {
    return ({
        corrections: model.corrections,
        cloudMasking: model.cloudMasking,
        shadowMasking: model.shadowMasking,
        snowMasking: model.snowMasking
    })
}

export default compose(
    OpticalPreprocess,
    recipeFormPanel({id: 'options', fields, modelToValues, valuesToModel})
)
