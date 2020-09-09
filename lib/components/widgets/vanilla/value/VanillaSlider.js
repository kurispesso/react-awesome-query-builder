"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(props) {
  var value = props.value,
      setValue = props.setValue,
      config = props.config,
      readonly = props.readonly,
      min = props.min,
      max = props.max,
      step = props.step,
      placeholder = props.placeholder;

  var onChange = function onChange(e) {
    var val = e.target.value;
    if (val === "" || val === null) val = undefined;else val = parseInt(val);
    setValue(val);
  };

  return [/*#__PURE__*/_react["default"].createElement("input", {
    key: "number",
    type: "number",
    value: value,
    placeholder: placeholder,
    disabled: readonly,
    min: min,
    max: max,
    step: step,
    onChange: onChange
  }), /*#__PURE__*/_react["default"].createElement("input", {
    key: "range",
    type: "range",
    value: value,
    disabled: readonly,
    min: min,
    max: max,
    step: step,
    onChange: onChange
  })];
};

exports["default"] = _default;