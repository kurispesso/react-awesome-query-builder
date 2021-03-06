"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Draggable = _interopRequireDefault(require("./containers/Draggable"));

var _Rule = _interopRequireDefault(require("./Rule"));

var _Group = _interopRequireDefault(require("./Group"));

var _RuleGroup = _interopRequireDefault(require("./RuleGroup"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var cacheTypeMap = {};
var typeMap = {
  rule: function rule(props) {
    var properties = props.properties.toObject();

    var renderProps = _objectSpread(_objectSpread({}, props.properties.toObject()), {}, {
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
      addGroup: props.addGroup
    });

    if (props.config.settings.classRule) {
      if (!cacheTypeMap['classRule']) {
        var classRuleClassName = "rule";

        if (props.config.settings.classRuleClassName) {
          classRuleClassName = props.config.settings.classRuleClassName;
        }

        cacheTypeMap['classRule'] = (0, _Draggable["default"])(classRuleClassName)(props.config.settings.classRule);
      }

      renderProps.classComponent = cacheTypeMap['classRule'];
    }

    return /*#__PURE__*/_react["default"].createElement(_Rule["default"], renderProps);
  },
  group: function group(props) {
    var properties = props.properties.toObject();

    var renderProps = _objectSpread(_objectSpread({}, properties), {}, {
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
      addGroup: props.addGroup
    });

    if (props.config.settings.classGroup) {
      if (!cacheTypeMap['classGroup']) {
        var classGroupClassName = "group";

        if (props.config.settings.classGroupClassName) {
          classGroupClassName = props.config.settings.classGroupClassName;
        }

        cacheTypeMap['classGroup'] = (0, _Draggable["default"])(classGroupClassName)(props.config.settings.classGroup);
      }

      renderProps.classComponent = cacheTypeMap['classGroup'];
    }

    return /*#__PURE__*/_react["default"].createElement(_Group["default"], renderProps);
  },
  rule_group: function rule_group(props) {
    var properties = props.properties.toObject();

    var renderProps = _objectSpread(_objectSpread({}, properties), {}, {
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
      addGroup: props.addGroup
    });

    if (props.config.settings.classRuleGroup) {
      if (!cacheTypeMap['classRuleGroup']) {
        var classRuleGroupClassName = "group rule_group";

        if (props.config.settings.classRuleGroupClassName) {
          classRuleGroupClassName = props.config.settings.classRuleGroupClassName;
        }

        cacheTypeMap['classRuleGroup'] = (0, _Draggable["default"])(classRuleGroupClassName)(props.config.settings.classRuleGroup);
      }

      renderProps.classComponent = cacheTypeMap['classRuleGroup'];
    }

    return /*#__PURE__*/_react["default"].createElement(_RuleGroup["default"], renderProps);
  }
};

var Item = /*#__PURE__*/function (_PureComponent) {
  _inherits(Item, _PureComponent);

  var _super = _createSuper(Item);

  function Item() {
    _classCallCheck(this, Item);

    return _super.apply(this, arguments);
  }

  _createClass(Item, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          type = _this$props.type,
          props = _objectWithoutProperties(_this$props, ["type"]);

      var component = typeMap[type];

      if (!component) {
        return null;
      } else {
        return component(props);
      }
    }
  }]);

  return Item;
}(_react.PureComponent);

Item.propTypes = {
  //tree: PropTypes.instanceOf(Immutable.Map).isRequired,
  config: _propTypes["default"].object.isRequired,
  id: _propTypes["default"].string.isRequired,
  type: _propTypes["default"].oneOf(Object.keys(typeMap)).isRequired,
  path: _propTypes["default"].any.isRequired,
  //instanceOf(Immutable.List)
  properties: _propTypes["default"].any.isRequired,
  //instanceOf(Immutable.Map)
  children1: _propTypes["default"].any,
  //instanceOf(Immutable.OrderedMap)
  actions: _propTypes["default"].object.isRequired,
  reordableNodesCnt: _propTypes["default"].number,
  onDragStart: _propTypes["default"].func,
  parentField: _propTypes["default"].string,
  //from RuleGroup
  isDraggingTempo: _propTypes["default"].bool
};
var _default = Item;
exports["default"] = _default;