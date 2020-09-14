import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import GroupContainer from "./containers/GroupContainer";
import RuleContainer from "./containers/RuleContainer";
import Draggable from "./containers/Draggable";
import Rule from "./Rule";
import Group from "./Group";
import RuleGroup from "./RuleGroup";

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
    };

    if(props.config.settings.classRule) {
      renderProps.classComponent = props.config.settings.classRule;
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
      removeSelf: props.removeSelf
    };

    if(props.config.settings.classGroup) {
      renderProps.classComponent = props.config.settings.classGroup;
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
    };

    if(props.config.settings.classRuleGroup) {
      renderProps.classComponent = props.config.settings.classRuleGroup;
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
