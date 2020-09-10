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
    const renderProps = {
      ...props.properties.toObject(),
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

    let Container;
    if(props.config.settings.classRule) {
      Container = RuleContainer(Draggable("rule")(props.config.settings.classRule));
    } else {
      Container = Rule;
    }

    return (
      <Container {...renderProps} />
    );
  },
  group: (props) => {

    const renderProps = {
      ...props.properties.toObject(),
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
    };

    let Container;
    if(props.config.settings.classGroup) {
      Container = GroupContainer(Draggable("group")(props.config.settings.classGroup));
    } else {
      Container = Group;
    }

    return (
      <Container {...renderProps} />
    );
  },
  rule_group: (props) => {
    const renderProps = {
      ...props.properties.toObject(),
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

    let Container;
    if(props.config.settings.classRuleGroup) {
      Container = GroupContainer(Draggable("group rule_group")(props.config.settings.classRuleGroup));
    } else {
      Container = RuleGroup;
    }

    return (
      <Container {...renderProps} />
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
