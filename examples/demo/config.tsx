import React, {Component} from "react";
import merge from "lodash/merge";
import {
  BasicConfig,
  // types:
  Operators, Widgets, Fields, Config, Types, Conjunctions, Settings, LocaleSettings, OperatorProximity, Funcs,
  DateTimeFieldSettings,
} from "react-awesome-query-builder";
import moment from "moment";
//import en_US from 'antd/lib/locale-provider/en_US';
//import ru_RU from 'antd/lib/locale-provider/ru_RU';
// @ts-ignore
import {RuleGroup} from "react-awesome-query-builder/components/RuleGroup";
// @ts-ignore
import {Group} from "react-awesome-query-builder/components/Group";
// @ts-ignore
import {Rule} from "react-awesome-query-builder/components/Rule";
// @ts-ignore
import AntdConfig from "react-awesome-query-builder/config/antd";
// @ts-ignore
import AntdWidgets from "react-awesome-query-builder/components/widgets/antd";
const {
  FieldSelect,
  FieldDropdown,
  FieldCascader,
  FieldTreeSelect,
} = AntdWidgets;

class RuleGroupEvent extends RuleGroup {}
class GroupEvent extends Group {}
class RuleEvent extends Rule {}

export default (skin) => {
  const InitialConfig = skin == "vanilla" ? BasicConfig : AntdConfig;

  const conjunctions: Conjunctions = {
    ...InitialConfig.conjunctions,
  };

  const proximity: OperatorProximity = {
    ...InitialConfig.operators.proximity,
    valueLabels: [
      { label: "Word 1", placeholder: "Enter first word" },
      { label: "Word 2", placeholder: "Enter second word" },
    ],
    textSeparators: [
      //'Word 1',
      //'Word 2'
    ],
    options: {
      ...InitialConfig.operators.proximity.options,
      optionLabel: "Near", // label on top of "near" selectbox (for config.settings.showLabels==true)
      optionTextBefore: "Near", // label before "near" selectbox (for config.settings.showLabels==false)
      optionPlaceholder: "Select words between", // placeholder for "near" selectbox
      minProximity: 2,
      maxProximity: 10,
      defaults: {
        proximity: 2
      },
      customProps: {}
    }
  };

  const operators: Operators = {
    ...InitialConfig.operators,
    // examples of  overriding
    all: {
      label: "all",
      name: "all",
      cardinality: 0,
      multiple: false,
      isUnary: true,
      applyTo: [
        "dictionary",
        "number",
        "!struct",
      ],
    },
    is: {
      label: "is",
      name: "is",
      cardinality: 1,
      multiple: false,
      isUnary: true,
      applyTo: [
        "dictionary",
      ],
    },
    lt: {
      label: "<",
      name: "lt",
      cardinality: 1,
      multiple: false,
      isUnary: true,
      applyTo: [
        "number",
      ],
    },
    lte: {
      label: "<=",
      name: "lte",
      cardinality: 1,
      multiple: false,
      isUnary: true,
      applyTo: [
        "number",
      ],
    },
    gt: {
      label: ">",
      name: "gt",
      cardinality: 1,
      multiple: false,
      isUnary: true,
      applyTo: [
        "number",
      ],
    },
    gte: {
      label: ">=",
      name: "gte",
      cardinality: 1,
      multiple: false,
      isUnary: true,
      applyTo: [
        "number",
      ],
    },
    eq: {
      label: "==",
      name: "eq",
      cardinality: 1,
      multiple: false,
      isUnary: true,
      applyTo: [
        "number",
      ],
    },
    neq: {
      label: "!=",
      name: "neq",
      cardinality: 1,
      multiple: false,
      isUnary: true,
      applyTo: [
        "number",
      ],
    },
  };


  const widgets: Widgets = {
    ...InitialConfig.widgets,
    number: {
      type: "number",
      valueSrc: "value",
      //factory: (props) => <NumberWidget {...props} />,
    },
    dictionary: {
      type: "dictionary",
      valueSrc: "value",
      //factory: (props) => <SelectWidget {...props} />,
    },
    func: {
      type: "func",
      valueSrc: "func",
    },
    field: {
      valueSrc: "field",
      //factory: (props) => <ValueFieldWidget {...props} />,
      formatValue: (val, fieldDef, wgtDef, isForDisplay, valFieldDef) => {
        return isForDisplay ? (valFieldDef.label || val) : val;
      },
      valueLabel: "Field to compare",
      valuePlaceholder: "Select field to compare",
      customProps: {
        showSearch: true,
      },
    },
  };


  const types: Types = {
    ...InitialConfig.types,
    // examples of  overriding
    dictionary: {
      widgets: {
        dictionary: {
          operators:  ["all", "is"],
        },
      },
    },
    number: {
      valueSources: ["value"],
      widgets: {
        number: {
          operators: ["all", "gte", "lte", "gt", "lt", "eq", "neq"],
        },
      },
    },
  };


  const localeSettings: LocaleSettings = {
    locale: {
      short: "ru",
      full: "ru-RU",
      //antd: ru_RU,
    },
    valueLabel: "Value",
    valuePlaceholder: "Value",
    fieldLabel: "Field",
    operatorLabel: "Operator",
    funcLabel: "Function",
    fieldPlaceholder: "Select field",
    funcPlaceholder: "Select function",
    operatorPlaceholder: "Select operator",
    deleteLabel: null,
    addGroupLabel: "Add group",
    addRuleLabel: "Add rule",
    delGroupLabel: null,
    notLabel: "Not",
    valueSourcesPopupTitle: "Select value source",
    removeRuleConfirmOptions: {
      title: "Are you sure delete this rule?",
      okText: "Yes",
      okType: "danger",
    },
    removeGroupConfirmOptions: {
      title: "Are you sure delete this group?",
      okText: "Yes",
      okType: "danger",
    },
  };

  const settings: Settings = {
    ...InitialConfig.settings,
    ...localeSettings,
    classRuleGroup: RuleGroupEvent,
    classGroup: GroupEvent,
    classRule: RuleEvent,
    valueSourcesInfo: {
      value: {
        label: "Value"
      },
      field: {
        label: "Field",
        widget: "field",
      },
      func: {
        label: "Function",
        widget: "func",
      }
    },
    // canReorder: true,
    // canRegroup: true,
    // showNot: true,
    // showLabels: true,
    maxNesting: 5,
    canLeaveEmptyGroup: true,
    showErrorMessage: true,
    // renderField: (props) => <FieldCascader {...props} />,
    // renderOperator: (props) => <FieldDropdown {...props} />,
    // renderFunc: (props) => <FieldSelect {...props} />,
    // maxNumberOfRules: 10 // number of rules can be added to the query builder
    canLeaveEmptyRoot: false,
  };

  //////////////////////////////////////////////////////////////////////

  const fields: Fields = {
    "1": {
      "label": "Event 1",
      "type":"!group",
      "subfields": {
        "1": {
          "label": "Param 1 (as number)",
          "type": "number",
          "defaultOperator": "all",
          "order": 1,
          "valueSources": [
            "value"
          ]
        },
        "73": {
          "label": "Param 2 (as number)",
          "type": "number",
          "defaultOperator": "all",
          "order": 2,
          "valueSources": [
            "value"
          ]
        },
        "74": {
          "label": "Param 3 (as dictionary)",
          "type": "dictionary",
          "defaultOperator": "all",
          "order": 3,
          "valueSources": [
            "value"
          ],
          "options": {
            "dictionary": [
              {
                "value": "11:43:40",
                "title": "11:43:40"
              },
              {
                "value": "11:37:48",
                "title": "11:37:48"
              },
              {
                "value": "08:10:18",
                "title": "08:10:18"
              },
              {
                "value": "07:09:46",
                "title": "07:09:46"
              }
            ]
          }
        },
        "75": {
          "label": "Param 4 (as dictionary)",
          "type": "dictionary",
          "defaultOperator": "all",
          "order": 4,
          "valueSources": [
            "value"
          ],
          "options": {
            "dictionary": [
              {
                "value": "2.2.1",
                "title": "2.2.1"
              },
              {
                "value": "2.0.1",
                "title": "2.0.1"
              },
              {
                "value": "2.1.0",
                "title": "2.1.0"
              },
              {
                "value": "2.7.2",
                "title": "2.7.2"
              }
            ]
          }
        },
        "104": {
          "label": "Param 5 (as number)",
          "type": "number",
          "defaultOperator": "all",
          "order": 4,
          "valueSources": [
            "value"
          ]
        },
        "250": {
          "label": "Param 5 (as dictionary)",
          "type": "dictionary",
          "defaultOperator": "all",
          "order": 5,
          "valueSources": [
            "value"
          ],
          "options": {
            "dictionary": [
              {
                "value": "2.2.2",
                "title": "2.2.2"
              }
            ]
          }
        },
        "any": {
          "label": "Any param",
          "type": "!struct",
          "order": 0,
          "operators": [
            {
              "label": "any",
              "name": "any",
              "cardinality": 0,
              "multiple": false,
              "isUnary": true,
              "applyTo": [
                "!struct"
              ]
            }
          ],
          "valueSources": [
            "value"
          ]
        }
      }
    },
    "9": {
      "label": "Event 2",
      "type":"!group",
      "subfields": {
        "82": {
          "label": "Param 1 (as number)",
          "type": "number",
          "defaultOperator": "all",
          "order": 1,
          "valueSources": [
            "value"
          ]
        },
        "83": {
          "label": "Param 2 (as dictionary)",
          "type": "dictionary",
          "defaultOperator": "all",
          "order": 2,
          "valueSources": [
            "value"
          ],
          "options": {
            "dictionary": [
              {
                "value": "11:37:48",
                "title": "11:37:48"
              },
              {
                "value": "08:10:18",
                "title": "08:10:18"
              },
              {
                "value": "07:09:46",
                "title": "07:09:46"
              }
            ]
          }
        },
        "84": {
          "label": "Param 3 (as dictionary)",
          "type": "dictionary",
          "defaultOperator": "all",
          "order": 3,
          "valueSources": [
            "value"
          ],
          "options": {
            "dictionary": [
              {
                "value": "2.7.3",
                "title": "2.7.3"
              },
              {
                "value": "2.1.0",
                "title": "2.1.0"
              },
              {
                "value": "2.0.1",
                "title": "2.0.1"
              }
            ]
          }
        },
        "109": {
          "label": "Param 4 (as number)",
          "type": "number",
          "defaultOperator": "all",
          "order": 4,
          "valueSources": [
            "value"
          ]
        },
        "any": {
          "label": "Any param",
          "type": "!struct",
          "order": 0,
          "operators": [
            {
              "label": "any",
              "name": "any",
              "cardinality": 0,
              "multiple": false,
              "isUnary": true,
              "applyTo": [
                "!struct"
              ]
            }
          ],
          "valueSources": [
            "value"
          ]
        }
      }
    }
  };

  //////////////////////////////////////////////////////////////////////

  const funcs: Funcs = {
    LOWER: {
      label: "Lowercase",
      mongoFunc: "$toLower",
      jsonLogic: "toLowerCase",
      jsonLogicIsMethod: true,
      returnType: "text",
      args: {
        str: {
          label: "String",
          type: "text",
          valueSources: ["value", "field"],
        },
      }
    },
    LINEAR_REGRESSION: {
      label: "Linear regression",
      returnType: "number",
      formatFunc: ({coef, bias, val}, _) => `(${coef} * ${val} + ${bias})`,
      sqlFormatFunc: ({coef, bias, val}) => `(${coef} * ${val} + ${bias})`,
      mongoFormatFunc: ({coef, bias, val}) => ({"$sum": [{"$multiply": [coef, val]}, bias]}),
      jsonLogic: ({coef, bias, val}) => ({ "+": [ {"*": [coef, val]}, bias ] }),
      renderBrackets: ["", ""],
      renderSeps: [" * ", " + "],
      args: {
        coef: {
          label: "Coef",
          type: "number",
          defaultValue: 1,
          valueSources: ["value"],
        },
        val: {
          label: "Value",
          type: "number",
          valueSources: ["value"],
        },
        bias: {
          label: "Bias",
          type: "number",
          defaultValue: 0,
          valueSources: ["value"],
        }
      }
    },
  };



  const config: Config = {
    conjunctions,
    operators,
    widgets,
    types,
    settings,
    fields,
    funcs,
  };

  return config;
};

