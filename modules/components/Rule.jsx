import React, { Component, PureComponent } from "react";
import PropTypes from "prop-types";
import RuleContainer from "./containers/RuleContainer";
import Draggable from "./containers/Draggable";
import Field from "./Field";
import Operator from "./Operator";
import Widget from "./Widget";
import OperatorOptions from "./OperatorOptions";
import {getFieldConfig, getFieldPathLabels, getOperatorConfig, getFieldWidgetConfig} from "../utils/configUtils";
import {useOnPropsChanged} from "../utils/stuff";

const Col = ({children, ...props}) => (<div {...props}>{children}</div>);
const dummyFn = () => {};
const DragIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="gray" width="18px" height="18px">
    <path d="M0 0h24v24H0V0z" fill="none"/>
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

export class Rule extends PureComponent {
    static propTypes = {
      selectedField: PropTypes.string,
      selectedOperator: PropTypes.string,
      operatorOptions: PropTypes.object,
      config: PropTypes.object.isRequired,
      value: PropTypes.any, //depends on widget
      valueSrc: PropTypes.any,
      isDraggingMe: PropTypes.bool,
      isDraggingTempo: PropTypes.bool,
      parentField: PropTypes.string, //from RuleGroup
      valueError: PropTypes.any,
      //path: PropTypes.instanceOf(Immutable.List),
      //actions
      handleDraggerMouseDown: PropTypes.func,
      setField: PropTypes.func,
      setOperator: PropTypes.func,
      setOperatorOption: PropTypes.func,
      removeSelf: PropTypes.func,
      setValue: PropTypes.func,
      setValueSrc: PropTypes.func,
      reordableNodesCnt: PropTypes.number,
    };

    constructor(props) {
      super(props);
      useOnPropsChanged(this);

      this.onPropsChanged(props);
    }

    onPropsChanged(nextProps) {
      const prevProps = this.props;
      const keysForMeta = ["selectedField", "selectedOperator", "config", "reordableNodesCnt"];
      const needUpdateMeta = !this.meta || keysForMeta.map(k => (nextProps[k] !== prevProps[k])).filter(ch => ch).length > 0;

      if (needUpdateMeta) {
        this.meta = this.getMeta(nextProps);
      }
    }

    getMeta({selectedField, selectedOperator, config, reordableNodesCnt}) {
      const selectedFieldPartsLabels = getFieldPathLabels(selectedField, config);
      const selectedFieldConfig = getFieldConfig(selectedField, config);
      const isSelectedGroup = selectedFieldConfig && selectedFieldConfig.type == "!struct";
      const isFieldAndOpSelected = selectedField && selectedOperator && !isSelectedGroup;
      const selectedOperatorConfig = getOperatorConfig(config, selectedOperator, selectedField);
      const selectedOperatorHasOptions = selectedOperatorConfig && selectedOperatorConfig.options != null;
      const selectedFieldWidgetConfig = getFieldWidgetConfig(config, selectedField, selectedOperator) || {};
      const isOnlyValue = selectedField && selectedFieldConfig.valueSources.length == 1 && selectedFieldConfig.valueSources[0] == "value";
      const hideOperator = selectedFieldWidgetConfig.hideOperator && isOnlyValue;

      const showDragIcon = config.settings.canReorder && reordableNodesCnt > 1;
      const showOperator = selectedField && !hideOperator;
      const showOperatorLabel = selectedField && hideOperator && selectedFieldWidgetConfig.operatorInlineLabel;
      const showWidget = isFieldAndOpSelected;
      const showOperatorOptions = isFieldAndOpSelected && selectedOperatorHasOptions;

      return {
        selectedFieldPartsLabels, selectedFieldWidgetConfig,
        showDragIcon, showOperator, showOperatorLabel, showWidget, showOperatorOptions
      };
    }

    removeSelf = () => {
      const {renderConfirm, removeRuleConfirmOptions: confirmOptions} = this.props.config.settings;
      const doRemove = () => {
        this.props.removeSelf();
      };
      if (confirmOptions && !this.isEmptyCurrentRule()) {
        renderConfirm({...confirmOptions,
          onOk: doRemove,
          onCancel: null
        });
      } else {
        doRemove();
      }
    }

    isEmptyCurrentRule = () => {
      return !(
        this.props.selectedField !== null
            && this.props.selectedOperator !== null
            && this.props.value.filter((val) => val !== undefined).size > 0
      );
    }

    renderField = () => {
      const {
        config,
      } = this.props;

      const {
        immutableFieldsMode,
        immutableOpsMode,
      } = config.settings;

      const field = (
        <FieldWrapper
          key="field"
          classname={"rule--field"}
          config={config}
          selectedField={this.props.selectedField}
          setField={!immutableOpsMode ? this.props.setField : dummyFn}
          parentField={this.props.parentField}
          readonly={immutableFieldsMode}
          removeSelf={!immutableOpsMode ? this.removeSelf : dummyFn}
        />
      );

      return field;
    }

    renderOperator = () => {
      const {config,} = this.props;
      const {
        selectedFieldPartsLabels, selectedFieldWidgetConfig,
        showOperator, showOperatorLabel,
      } = this.meta;
      const {
        immutableOpsMode,
      } = config.settings;

      const operator
            = <OperatorWrapper
              key="operator"
              config={config}
              selectedField={this.props.selectedField}
              selectedOperator={this.props.selectedOperator}
              setOperator={!immutableOpsMode ? this.props.setOperator : dummyFn}
              selectedFieldPartsLabels={selectedFieldPartsLabels}
              showOperator={showOperator}
              showOperatorLabel={showOperatorLabel}
              selectedFieldWidgetConfig={selectedFieldWidgetConfig}
              readonly={immutableOpsMode}
            />;

      return operator;
    }

    renderWidget = () => {
      const {config, valueError} = this.props;
      const {
        showWidget,
      } = this.meta;
      const {
        immutableValuesMode,
      } = config.settings;

      const widget = showWidget
            && <Col key={"widget-for-"+this.props.selectedOperator} className="rule--value">
              <Widget
                key="values"
                field={this.props.selectedField}
                operator={this.props.selectedOperator}
                value={this.props.value}
                valueSrc={this.props.valueSrc}
                valueError={valueError}
                config={config}
                setValue={!immutableValuesMode ? this.props.setValue : dummyFn}
                setValueSrc={!immutableValuesMode ? this.props.setValueSrc : dummyFn}
                readonly={immutableValuesMode}
              />
            </Col>;

      return widget;
    }

    renderOperatorOptions = () => {
      const {config} = this.props;
      const {
        showOperatorOptions
      } = this.meta;

      const {
        immutableOpsMode,
        immutableValuesMode,
      } = config.settings;

      const operatorOptions = showOperatorOptions
            && <Col key={"op-options-for-"+this.props.selectedOperator} className="rule--operator-options">
              <OperatorOptions
                key="operatorOptions"
                selectedField={this.props.selectedField}
                selectedOperator={this.props.selectedOperator}
                operatorOptions={this.props.operatorOptions}
                setOperatorOption={!immutableOpsMode ? this.props.setOperatorOption : dummyFn}
                config={config}
                readonly={immutableValuesMode}
              />
            </Col>;

      return operatorOptions;
    }

    renderBeforeWidget = () => {
      const {config} = this.props;

      const {
        renderBeforeWidget,
      } = config.settings;

      const beforeWidget = renderBeforeWidget
            && <Col key={"before-widget-for-" +this.props.selectedOperator} className="rule--before-widget">
              {typeof renderBeforeWidget === "function" ? renderBeforeWidget(this.props) : renderBeforeWidget}
            </Col>;

      return beforeWidget;
    }

    renderAfterWidget = () => {
      const {config} = this.props;

      const {
        renderAfterWidget,
      } = config.settings;

      const afterWidget = renderAfterWidget
            && <Col key={"after-widget-for-" +this.props.selectedOperator} className="rule--after-widget">
              {typeof renderAfterWidget === "function" ? renderAfterWidget(this.props) : renderAfterWidget}
            </Col>;

      return afterWidget;
    }

    renderError = () => {
      const {
        config,
        valueError
      } = this.props;

      const {
        showErrorMessage,
      } = config.settings;

      if(!showErrorMessage) {
        return null;
      } else {
        const {
          renderRuleError,
        } = config.settings;

        const {
          valueError
        } = this.props;

        const oneValueError = valueError && valueError.toArray().filter(e => !!e).shift() || null;

        if(!oneValueError) {
          return null;
        } else {
          const error = (
            <div className="rule--error">
              {renderRuleError ? renderRuleError({error: oneValueError}) : oneValueError}
            </div>
          );

          return error;
        }
      }
    }

    renderHeader = () => {
      const {
        config
      } = this.props;

      const {
        deleteLabel,
        immutableGroupsMode,
        renderButton: Btn
      } = config.settings;

      const header = (
        <div key="rule-header" className="rule--header">
          {!immutableGroupsMode && <Btn
            type="delRule" onClick={this.removeSelf} label={deleteLabel} config={config}
          />}
        </div>
      );

      return header;
    }

    renderDrag = () => {
      const {
        showDragIcon
      } = this.meta;

      const drag = showDragIcon
            && <span
              key="rule-drag-icon"
              className={"qb-drag-handler rule--drag-handler"}
              onMouseDown={this.props.handleDraggerMouseDown}
            ><DragIcon /> </span>
        ;

      return drag;
    }

    render () {
      return (
        <>
          {this.renderDrag()}
          <div className="rule--body--wrapper">
            <div key="rule-body" className="rule--body">
              {this.renderField()}
              {this.renderOperator()}
              {this.renderBeforeWidget()}
              {this.renderWidget()}
              {this.renderAfterWidget()}
              {this.renderOperatorOptions()}
            </div>
            {this.renderError()}
          </div>
          {this.renderHeader()}
        </>
      );
    }

}


export class FieldWrapper extends PureComponent {
  render() {
    const {config, selectedField, setField, parentField, classname, readonly, removeSelf} = this.props;
    return (
      <Col className={classname}>
        { config.settings.showLabels
                    && <label>{config.settings.fieldLabel}</label>
        }
        <Field
          config={config}
          selectedField={selectedField}
          parentField={parentField}
          setField={setField}
          customProps={config.settings.customFieldSelectProps}
          readonly={readonly}
          removeSelf={removeSelf}
        />
      </Col>
    );
  }
}


class OperatorWrapper extends PureComponent {
  render() {
    const {
      config, selectedField, selectedOperator, setOperator,
      selectedFieldPartsLabels, showOperator, showOperatorLabel, selectedFieldWidgetConfig, readonly
    } = this.props;
    const operator = showOperator
            && <Col key={"operators-for-"+(selectedFieldPartsLabels || []).join("_")} className="rule--operator">
              { config.settings.showLabels
                    && <label>{config.settings.operatorLabel}</label>
              }
              <Operator
                key="operator"
                config={config}
                selectedField={selectedField}
                selectedOperator={selectedOperator}
                setOperator={setOperator}
                readonly={readonly}
              />
            </Col>;
    const hiddenOperator = showOperatorLabel
            && <Col key={"operators-for-"+(selectedFieldPartsLabels || []).join("_")} className="rule--operator">
              <div className="rule--operator">
                {config.settings.showLabels
                  ? <label>&nbsp;</label>
                  : null}
                <span>{selectedFieldWidgetConfig.operatorInlineLabel}</span>
              </div>
            </Col>;
    return [
      operator,
      hiddenOperator
    ];
  }
}

export default RuleContainer(Draggable("rule")(Rule));
