import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Draggable from "./containers/Draggable";
import Rule from "./Rule";
import Group from "./Group";
import RuleGroup from "./RuleGroup";

const cacheTypeMap = {};

const typeMap = {
  rule: (props) => {
    const properties = props.properties.toObject();

    const renderProps = {
      ...props.properties.toObject(),
      properties: properties,
      id: props.id,
      path: props.path,
      actions: props.actions,
      reordableNodesCnt: props.reordableNodesCnt,
      totalRulesCnt: props.totalRulesCnt,
      config: props.config,
      onDragStart: props.onDragStart,
      isDraggingTempo: props.isDraggingTempo,
      parentField: props.parentField,
      removeSelf: props.removeSelf,
      addRule: props.addRule,
      addGroup: props.addGroup,
    };

    if(props.config.settings.classRule) {
      if(!cacheTypeMap['classRule']) {
        let classRuleClassName = "rule";
        if(props.config.settings.classRuleClassName) {
          classRuleClassName = props.config.settings.classRuleClassName;
        }

        cacheTypeMap['classRule'] = Draggable(classRuleClassName)(props.config.settings.classRule);
      }
      renderProps.classComponent = cacheTypeMap['classRule'];
    }

    return (
      <Rule {...renderProps} />
    );
  },
  group: (props) => {
    const properties = props.properties.toObject();
    const renderProps = {
      ...properties,
      properties: properties,
      id: props.id,
      path: props.path,
      actions: props.actions,
      config: props.config,
      reordableNodesCnt: props.reordableNodesCnt,
      totalRulesCnt: props.totalRulesCnt,
      onDragStart: props.onDragStart,
      isDraggingTempo: props.isDraggingTempo,
      children1: props.children1,
      parentField: null,
      removeSelf: props.removeSelf,
      addRule: props.addRule,
      addGroup: props.addGroup,
    };

    if(props.config.settings.classGroup) {
      if(!cacheTypeMap['classGroup']) {
        let classGroupClassName = "group";
        if(props.config.settings.classGroupClassName) {
          classGroupClassName = props.config.settings.classGroupClassName;
        }

        cacheTypeMap['classGroup'] =  Draggable(classGroupClassName)(props.config.settings.classGroup);
      }
      renderProps.classComponent = cacheTypeMap['classGroup'];
    }

    return (
      <Group {...renderProps} />
    );
  },
  rule_group: (props) => {
    const properties = props.properties.toObject();
    const renderProps = {
      ...properties,
      properties: properties,
      id: props.id,
      path: props.path,
      actions: props.actions,
      config: props.config,
      reordableNodesCnt: props.reordableNodesCnt,
      totalRulesCnt: props.totalRulesCnt,
      onDragStart: props.onDragStart,
      isDraggingTempo: props.isDraggingTempo,
      children1: props.children1,
      parentField: props.parentField,
      removeSelf: props.removeSelf,
      addRule: props.addRule,
      addGroup: props.addGroup,
    };

    if(props.config.settings.classRuleGroup) {
      if(!cacheTypeMap['classRuleGroup']) {
        let classRuleGroupClassName = "group rule_group";
        if(props.config.settings.classRuleGroupClassName) {
          classRuleGroupClassName = props.config.settings.classRuleGroupClassName;
        }

        cacheTypeMap['classRuleGroup'] = Draggable(classRuleGroupClassName)(props.config.settings.classRuleGroup);
      }
      renderProps.classComponent = cacheTypeMap['classRuleGroup'];
    }

    return (
      <RuleGroup {...renderProps} />
    );
  }
};


class Item extends PureComponent {
  static propTypes = {
    //tree: PropTypes.instanceOf(Immutable.Map).isRequired,
    config: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.keys(typeMap)).isRequired,
    path: PropTypes.any.isRequired, //instanceOf(Immutable.List)
    properties: PropTypes.any.isRequired, //instanceOf(Immutable.Map)
    children1: PropTypes.any, //instanceOf(Immutable.OrderedMap)
    actions: PropTypes.object.isRequired,
    reordableNodesCnt: PropTypes.number,
    onDragStart: PropTypes.func,
    parentField: PropTypes.string, //from RuleGroup
    isDraggingTempo: PropTypes.bool,
  };

  render() {
    const {
      type,
      ...props
    } = this.props;

    const component = typeMap[type];

    if (!component) {
      return null;
    } else {
      return component(props);
    }
  }
}

export default Item;
