"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadFromJsonLogic = void 0;

var _uuid = _interopRequireDefault(require("../utils/uuid"));

var _stuff = require("../utils/stuff");

var _configUtils = require("../utils/configUtils");

var _tree = require("./tree");

var _defaultUtils = require("../utils/defaultUtils");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// http://jsonlogic.com/
// helpers
Object.defineProperty(Array.prototype, "uniq", {
  enumerable: false,
  value: function value() {
    return Array.from(new Set(this));
  }
});
Object.defineProperty(Array.prototype, "to_object", {
  enumerable: false,
  value: function value() {
    return this.reduce(function (acc, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          f = _ref2[0],
          fc = _ref2[1];

      return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, f, fc));
    }, {});
  }
}); //meta is mutable

var loadFromJsonLogic = function loadFromJsonLogic(logicTree, config) {
  var meta = {
    errors: []
  };
  var extendedConfig = (0, _configUtils.extendConfig)(config);
  var conv = buildConv(extendedConfig);
  var jsTree = logicTree ? convertFromLogic(logicTree, conv, extendedConfig, "rule", meta) : undefined;

  if (jsTree && jsTree.type != "group") {
    jsTree = wrapInDefaultConj(jsTree, extendedConfig);
  }

  var immTree = jsTree ? (0, _tree.loadTree)(jsTree) : undefined;
  if (meta.errors.length) console.warn("Errors while importing from JsonLogic:", meta.errors);
  return immTree;
};

exports.loadFromJsonLogic = loadFromJsonLogic;

var buildConv = function buildConv(config) {
  var operators = {};

  for (var opKey in config.operators) {
    var opConfig = config.operators[opKey];

    if (typeof opConfig.jsonLogic == "string") {
      // example: "</2", "#in/1"
      var opk = (opConfig._jsonLogicIsRevArgs ? "#" : "") + opConfig.jsonLogic + "/" + (0, _stuff.defaultValue)(opConfig.cardinality, 1);
      if (!operators[opk]) operators[opk] = [];
      operators[opk].push(opKey);
    } else if (typeof opConfig.jsonLogic2 == "string") {
      // example: all-in/1"
      var _opk = opConfig.jsonLogic2 + "/" + (0, _stuff.defaultValue)(opConfig.cardinality, 1);

      if (!operators[_opk]) operators[_opk] = [];

      operators[_opk].push(opKey);
    }
  }

  var conjunctions = {};

  for (var conjKey in config.conjunctions) {
    var ck = conjKey.toLowerCase();
    conjunctions[ck] = conjKey;
  }

  var funcs = {};

  for (var funcKey in config.funcs) {
    var funcConfig = config.funcs[funcKey];

    if (typeof funcConfig.jsonLogic == "string") {
      var fk = (funcConfig.jsonLogicIsMethod ? "#" : "") + funcConfig.jsonLogic;
      if (!funcs[fk]) funcs[fk] = [];
      funcs[fk].push(funcKey);
    }
  }

  return {
    operators: operators,
    conjunctions: conjunctions,
    funcs: funcs
  };
};

var convertFromLogic = function convertFromLogic(logic, conv, config, expectedType, meta) {
  var not = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
  var fieldConfig = arguments.length > 6 ? arguments[6] : undefined;
  var widget = arguments.length > 7 ? arguments[7] : undefined;
  var parentField = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : null;
  var op, vals;

  if (isLogic(logic)) {
    op = Object.keys(logic)[0];
    vals = logic[op];
    if (!Array.isArray(vals)) vals = [vals];
  }

  var ret;
  var beforeErrorsCnt = meta.errors.length;
  var isNotOp = op == "!" && vals.length == 1 && vals[0] && isLogic(vals[0]) && Object.keys(vals[0])[0] == "var";
  var isRev = op == "!" && !isNotOp;

  if (isRev) {
    ret = convertFromLogic(vals[0], conv, config, expectedType, meta, !not, fieldConfig, widget, parentField);
  } else if (expectedType == "val") {
    ret = convertField(op, vals, conv, config, not, meta, parentField) || convertFunc(op, vals, conv, config, not, fieldConfig, meta, parentField) || convertVal(logic, fieldConfig, widget, config, meta);
  } else if (expectedType == "rule") {
    ret = convertConj(op, vals, conv, config, not, meta, parentField) || convertOp(op, vals, conv, config, not, meta, parentField);
  }

  var afterErrorsCnt = meta.errors.length;

  if (op != "!" && ret === undefined && afterErrorsCnt == beforeErrorsCnt) {
    meta.errors.push("Can't parse logic ".concat(JSON.stringify(logic)));
  }

  return ret;
};

var convertVal = function convertVal(val, fieldConfig, widget, config, meta) {
  if (val === undefined) return undefined;
  var widgetConfig = config.widgets[widget || fieldConfig.mainWidget];

  if (!widgetConfig) {
    meta.errors.push("No widget for type ".concat(fieldConfig.type));
    return undefined;
  }

  if (isLogic(val)) {
    meta.errors.push("Unexpected logic in value: ".concat(JSON.stringify(val)));
    return undefined;
  } // number of seconds -> time string


  if (fieldConfig && fieldConfig.type == "time" && typeof val == "number") {
    var h = Math.floor(val / 60 / 60) % 24,
        m = Math.floor(val / 60) % 60,
        s = val % 60;
    var valueFormat = widgetConfig.valueFormat;

    if (valueFormat) {
      var dateVal = new Date(val);
      dateVal.setMilliseconds(0);
      dateVal.setHours(h);
      dateVal.setMinutes(m);
      dateVal.setSeconds(s);
      val = (0, _moment["default"])(dateVal).format(valueFormat);
    } else {
      val = "".concat(h, ":").concat(m, ":").concat(s);
    }
  } // "2020-01-08T22:00:00.000Z" -> Date object


  if (fieldConfig && ["date", "datetime"].includes(fieldConfig.type) && val && !(val instanceof Date)) {
    var _dateVal = new Date(val);

    if (_dateVal instanceof Date && _dateVal.toISOString() === val) {
      val = _dateVal;
    }
  } // Date object -> formatted string


  if (val instanceof Date && fieldConfig) {
    var _valueFormat = widgetConfig.valueFormat;

    if (_valueFormat) {
      val = (0, _moment["default"])(val).format(_valueFormat);
    }
  }

  return {
    valueSrc: "value",
    value: val,
    valueType: widgetConfig.type
  };
};

var convertField = function convertField(op, vals, conv, config, not, meta) {
  var parentField = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
  var fieldSeparator = config.settings.fieldSeparator;

  if (op == "var") {
    var field = vals[0];
    if (parentField) field = [parentField, field].join(fieldSeparator);
    var fieldConfig = (0, _configUtils.getFieldConfig)(field, config);

    if (!fieldConfig) {
      meta.errors.push("No config for field ".concat(field));
      return undefined;
    }

    return {
      valueSrc: "field",
      value: field,
      valueType: fieldConfig.type
    };
  }

  return undefined;
};

var convertFunc = function convertFunc(op, vals, conv, config, not, fieldConfig, meta) {
  var parentField = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;
  if (!op) return undefined;
  var func, argsArr;
  var jsonLogicIsMethod = op == "method";

  if (jsonLogicIsMethod) {
    var obj, opts;

    var _vals = _toArray(vals);

    obj = _vals[0];
    func = _vals[1];
    opts = _vals.slice(2);
    argsArr = [obj].concat(_toConsumableArray(opts));
  } else {
    func = op;
    argsArr = vals;
  }

  var fk = (jsonLogicIsMethod ? "#" : "") + func;
  var funcKeys = conv.funcs[fk];

  if (funcKeys) {
    var funcKey = funcKeys[0];

    if (funcKeys.length > 1 && fieldConfig) {
      funcKeys = funcKeys.filter(function (k) {
        return config.funcs[k].returnType == fieldConfig.type;
      });

      if (funcKeys.length == 0) {
        meta.errors.push("No funcs returning type ".concat(fieldConfig.type));
        return undefined;
      }

      funcKey = funcKeys[0];
    }

    var funcConfig = config.funcs[funcKey];
    var argKeys = Object.keys(funcConfig.args);
    var args = argsArr.reduce(function (acc, val, ind) {
      var argKey = argKeys[ind];
      var argConfig = funcConfig.args[argKey];
      var argVal = convertFromLogic(val, conv, config, "val", meta, false, argConfig, null, parentField);

      if (argVal === undefined) {
        argVal = argConfig.defaultValue;

        if (argVal === undefined) {
          meta.errors.push("No value for arg ".concat(argKey, " of func ").concat(funcKey));
          return undefined;
        }
      }

      return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, argKey, argVal));
    }, {});
    return {
      valueSrc: "func",
      value: {
        func: funcKey,
        args: args
      },
      valueType: funcConfig.returnType
    };
  }

  return undefined;
};

var convertConj = function convertConj(op, vals, conv, config, not, meta) {
  var parentField = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
  var conjKey = conv.conjunctions[op];
  var fieldSeparator = config.settings.fieldSeparator;

  if (conjKey) {
    var type = "group";
    var children = vals.map(function (v) {
      return convertFromLogic(v, conv, config, "rule", meta, false, null, null, parentField);
    }).filter(function (r) {
      return r !== undefined;
    }).reduce(function (acc, r) {
      return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, r.id, r));
    }, {});
    var complexFields = Object.entries(children).filter(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          _k = _ref4[0],
          v = _ref4[1];

      return v.properties !== undefined && v.properties.field !== undefined && v.properties.field.indexOf(fieldSeparator) != -1;
    }).map(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          _k = _ref6[0],
          v = _ref6[1];

      return v.properties.field.split(fieldSeparator);
    });
    var complexFieldsParents = complexFields.map(function (parts) {
      return parts.slice(0, parts.length - 1).join(fieldSeparator);
    });
    var complexFieldsConfigs = complexFieldsParents.uniq().map(function (f) {
      return [f, (0, _configUtils.getFieldConfig)(f, config)];
    }).to_object();
    var complexFieldsInGroup = complexFieldsParents.filter(function (f) {
      return complexFieldsConfigs[f].type == "!group";
    });
    var usedGroups = complexFieldsInGroup.uniq();
    var children1 = children;
    var properties = {
      conjunction: conjKey,
      not: not
    }; // every field should be in single group or neither

    var isOk = usedGroups.length == 0 || usedGroups.length == 1 && complexFieldsInGroup.length == Object.keys(children).length;
    var usedGroup = usedGroups.length > 0 ? usedGroups[0] : null;

    if (isOk) {
      if (usedGroup) {
        type = "rule_group";
        properties.field = usedGroup;
      }
    } else {
      // if not ok, we should split children by groups
      children1 = {};
      var groupToId = {};
      Object.entries(children).map(function (_ref7) {
        var _ref8 = _slicedToArray(_ref7, 2),
            k = _ref8[0],
            v = _ref8[1];

        var groupFields = usedGroups.filter(function (f) {
          return v.properties.field.indexOf(f) == 0;
        });
        var groupField = groupFields.length > 0 ? groupFields[0] : null;

        if (!groupField) {
          // not in group (can be simple field or in struct)
          children1[k] = v;
        } else {
          var groupId = groupToId[groupField];

          if (!groupId) {
            groupId = (0, _uuid["default"])();
            groupToId[groupField] = groupId;
            children1[groupId] = {
              type: "rule_group",
              id: groupId,
              children1: {},
              properties: {
                conjunction: conjKey,
                not: false,
                field: groupField
              }
            };
          }

          children1[groupId].children1[k] = v;
        }
      });
    }

    return {
      type: type,
      id: (0, _uuid["default"])(),
      children1: children1,
      properties: properties
    };
  }

  return undefined;
};

var wrapInDefaultConjRuleGroup = function wrapInDefaultConjRuleGroup(rule, parentField, config) {
  return {
    type: "rule_group",
    id: (0, _uuid["default"])(),
    children1: _defineProperty({}, rule.id, rule),
    properties: {
      conjunction: (0, _defaultUtils.defaultConjunction)(config),
      not: false,
      field: parentField
    }
  };
};

var wrapInDefaultConj = function wrapInDefaultConj(rule, config) {
  return {
    type: "group",
    id: (0, _uuid["default"])(),
    children1: _defineProperty({}, rule.id, rule),
    properties: {
      conjunction: (0, _defaultUtils.defaultConjunction)(config),
      not: false
    }
  };
};

var convertOp = function convertOp(op, vals, conv, config, not, meta) {
  var parentField = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
  if (!op) return undefined;
  var fieldSeparator = config.settings.fieldSeparator;
  var arity = vals.length;
  var cardinality = arity - 1;

  if (op == "all") {
    // special case
    var op2 = Object.keys(vals[1])[0];
    vals = [vals[0], vals[1][op2][1]];
    op = op + "-" + op2; // example: "all-in"
  }

  var opk = op + "/" + cardinality;
  var oks = [],
      errors = [];

  var _check = function _check(isRevArgs) {
    var opKeys = conv.operators[(isRevArgs ? "#" : "") + opk];

    if (opKeys) {
      var jlField,
          _args = [];
      var rangeOps = ["<", "<=", ">", ">="];

      if (rangeOps.includes(op) && arity == 3) {
        jlField = vals[1];
        _args = [vals[0], vals[2]];
      } else if (isRevArgs) {
        jlField = vals[1];
        _args = [vals[0]];
      } else {
        var _vals2 = vals;

        var _vals3 = _toArray(_vals2);

        jlField = _vals3[0];
        _args = _vals3.slice(1);
      }

      var _jlField = jlField,
          _field = _jlField["var"];
      if (parentField) _field = [parentField, _field].join(fieldSeparator);

      if (!_field) {
        errors.push("Unknown field ".concat(JSON.stringify(jlField)));
        return;
      }

      var _fieldConfig = (0, _configUtils.getFieldConfig)(_field, config);

      if (!_fieldConfig) {
        errors.push("No config for field ".concat(_field));
        return;
      }

      var _opKey = opKeys[0];

      if (opKeys.length > 1 && _fieldConfig && _fieldConfig.operators) {
        // eg. for "equal" and "select_equals"
        opKeys = opKeys.filter(function (k) {
          return _fieldConfig.operators.includes(k);
        });

        if (opKeys.length == 0) {
          errors.push("No corresponding ops for field ".concat(_field));
          return;
        }

        _opKey = opKeys[0];
      }

      oks.push({
        field: _field,
        fieldConfig: _fieldConfig,
        opKey: _opKey,
        args: _args
      });
    }
  };

  _check(false);

  _check(true); // special case for `rule_group` (issue #246)


  if (["some", "none"].includes(op) && arity == 2) {
    if (vals[0].length == 1 && vals[0][0]["var"] !== undefined && Object.keys(vals[1]).length == 1) {
      var _field2 = vals[0][0]["var"];
      var sub = vals[1];
      var newOp = Object.keys(sub)[0];
      var newVals = sub[newOp];
      var newNot = !!(not ^ newOp == "none");
      var groupField = (parentField ? [parentField, _field2] : [_field2]).join(fieldSeparator);
      var groupFieldConfig = (0, _configUtils.getFieldConfig)(groupField, config);

      if (groupFieldConfig && groupFieldConfig.type == "!group") {
        var res = convertConj(newOp, newVals, conv, config, newNot, meta, groupField);

        if (!res) {
          // need to be wrapped in `rule_group`
          var rule = convertOp(newOp, newVals, conv, config, newNot, meta, groupField);
          res = wrapInDefaultConjRuleGroup(rule, groupField, config);
        }

        return res;
      }
    }
  }

  if (!oks.length) {
    meta.errors.push(errors.join("; ") || "Unknown op ".concat(op, "/").concat(arity));
    return undefined;
  }

  var _oks$ = oks[0],
      field = _oks$.field,
      fieldConfig = _oks$.fieldConfig,
      opKey = _oks$.opKey,
      args = _oks$.args;
  var opConfig = config.operators[opKey];

  if (not && opConfig.reversedOp) {
    not = false;
    opKey = opConfig.reversedOp;
    opConfig = config.operators[opKey];
  }

  if (not) {
    meta.errors.push("No rev op for ".concat(opKey));
    return undefined;
  }

  var widget = (0, _configUtils.getWidgetForFieldOp)(config, field, opKey);
  var convertedArgs = args.map(function (v) {
    return convertFromLogic(v, conv, config, "val", meta, false, fieldConfig, widget, parentField);
  });

  if (convertedArgs.filter(function (v) {
    return v === undefined;
  }).length) {
    //meta.errors.push(`Undefined arg for field ${field} and op ${opKey}`);
    return undefined;
  }

  return {
    type: "rule",
    id: (0, _uuid["default"])(),
    properties: {
      field: field,
      operator: opKey,
      value: convertedArgs.map(function (v) {
        return v.value;
      }),
      valueSrc: convertedArgs.map(function (v) {
        return v.valueSrc;
      }),
      valueType: convertedArgs.map(function (v) {
        return v.valueType;
      })
    }
  };
};

var isLogic = function isLogic(logic) {
  return _typeof(logic) === "object" // An object
  && logic !== null // but not null
  && !Array.isArray(logic) // and not an array
  && Object.keys(logic).length === 1 // with exactly one key
  ;
};