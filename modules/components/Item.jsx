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
      if(!cacheTypeMap[props.config.settings.classRule]) {
        cacheTypeMap[props.config.settings.classRule] = Draggable("rule")(props.config.settings.classRule);
      }
      renderProps.classComponent = cacheTypeMap[props.config.settings.classRule];
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
      if(!cacheTypeMap[props.config.settings.classGroup]) {
        cacheTypeMap[props.config.settings.classGroup] =  Draggable("group")(props.config.settings.classGroup);
      }
      renderProps.classComponent = cacheTypeMap[props.config.settings.classGroup];
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
      if(!cacheTypeMap[props.config.settings.classRuleGroup]) {
        cacheTypeMap[props.config.settings.classRuleGroup] = Draggable("group rule_group")(props.config.settings.classRuleGroup);
      }
      renderProps.classComponent = cacheTypeMap[props.config.settings.classRuleGroup];
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
