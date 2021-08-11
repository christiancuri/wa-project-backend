"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = void 0;
var _ = require("lodash");
var slice = Array.prototype.slice;
var rest = function (array, n, guard) {
  return slice.call(array, n == null || guard ? 1 : n);
};
function last(array, n, guard) {
  if (array == null || array.length < 1)
    return n == null || guard ? void 0 : [];
  if (n == null || guard) return array[array.length - 1];
  return rest(array, Math.max(0, array.length - n));
}
var Builder = /** @class */ (function () {
  function Builder(options) {
    this.rootObjectName = "RootObject";
    if (
      options === null || options === void 0 ? void 0 : options.rootObjectName
    ) {
      this.rootObjectName = options.rootObjectName;
    }
  }
  Builder.prototype.build = function (content) {
    if (!this.isJson(content)) throw new Error("Invalid json");
    var jsonContent = JSON.parse(content);
    if (_.isArray(jsonContent)) return this.json2Interfaces(jsonContent[0]);
    return this.json2Interfaces(jsonContent);
  };
  Builder.prototype.json2Interfaces = function (jsonContent, objectName) {
    if (objectName === void 0) {
      objectName = this.rootObjectName;
    }
    var optionalKeys = [];
    var objectResult = [];
    for (var key in jsonContent) {
      var value = jsonContent[key];
      if (_.isObject(value) && !_.isArray(value)) {
        var childObjName = this.toUpperFirstLetter(key);
        objectResult.push(this.json2Interfaces(value, childObjName));
        jsonContent[key] = this.removeMajority(childObjName) + ";";
      } else if (_.isArray(value)) {
        var arrTypes = this.catchMultiArrayTypes(value);
        if (this.isMultiArray(arrTypes)) {
          var arrBrackets = this.getMultiArrayBrackets(value);
          if (this.isAllEqual(arrTypes)) {
            jsonContent[key] = arrTypes[0].replace("[]", arrBrackets);
          } else {
            jsonContent[key] = "any" + arrBrackets + ";";
          }
        } else if (value.length > 0 && _.isObject(value[0])) {
          var childObjName = this.toUpperFirstLetter(key);
          objectResult.push(this.json2Interfaces(value[0], childObjName));
          jsonContent[key] = this.removeMajority(childObjName) + "[];";
        } else {
          jsonContent[key] = arrTypes[0];
        }
      } else if (_.isDate(value)) {
        jsonContent[key] = "Date;";
      } else if (_.isString(value)) {
        jsonContent[key] = "string;";
      } else if (_.isBoolean(value)) {
        jsonContent[key] = "boolean;";
      } else if (_.isNumber(value)) {
        jsonContent[key] = "number;";
      } else {
        jsonContent[key] = "any;";
        optionalKeys.push(key);
      }
    }
    var result = this.formatCharsToTs(jsonContent, objectName, optionalKeys);
    objectResult.push(result);
    return objectResult.join("\n\n");
  };
  Builder.prototype.catchMultiArrayTypes = function (value, valueType) {
    if (valueType === void 0) {
      valueType = [];
    }
    if (_.isArray(value)) {
      if (value.length === 0) {
        valueType.push("any[];");
      } else if (_.isArray(value[0])) {
        for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
          var element = value_1[_i];
          var valueTypeResponse = this.catchMultiArrayTypes(element, valueType);
          valueType.concat(valueTypeResponse);
        }
      } else if (_.every(value, _.isString)) {
        valueType.push("string[];");
      } else if (_.every(value, _.isNumber)) {
        valueType.push("number[];");
      } else if (_.every(value, _.isBoolean)) {
        valueType.push("boolean[];");
      } else {
        valueType.push("any[];");
      }
    }
    return valueType;
  };
  Builder.prototype.isMultiArray = function (arrTypes) {
    return arrTypes.length > 1;
  };
  Builder.prototype.isAllEqual = function (arr) {
    return _.every(arr.slice(1), _.partial(_.isEqual, arr[0]));
  };
  Builder.prototype.getMultiArrayBrackets = function (content) {
    var jsonStr = JSON.stringify(content);
    var brackets = "";
    for (var i = 0, l = jsonStr.length; i < l; i++) {
      var element = jsonStr[i];
      if (element === "[") {
        brackets = brackets + "[]";
      } else {
        i = l;
      }
    }
    return brackets;
  };
  Builder.prototype.formatCharsToTs = function (
    jsonContent,
    objName,
    optionalKeys,
  ) {
    var result = JSON.stringify(jsonContent, null, "\t")
      .replace(new RegExp('"', "g"), "")
      .replace(new RegExp(",", "g"), "");
    var allKeys = _.keys(jsonContent);
    for (var _i = 0, allKeys_1 = allKeys; _i < allKeys_1.length; _i++) {
      var key = allKeys_1[_i];
      result = result.replace(
        new RegExp(key + ":", "g"),
        key + (_.includes(optionalKeys, key) ? "?:" : ":"),
      );
    }
    objName = this.removeMajority(objName);
    return "export type " + objName + " = " + result;
  };
  Builder.prototype.removeMajority = function (objName) {
    if (last(objName, 3).join("").toUpperCase() === "IES") {
      return objName.substring(0, objName.length - 3) + "y";
    } else if (last(objName).toUpperCase() === "S") {
      return objName.substring(0, objName.length - 1);
    }
    return objName;
  };
  Builder.prototype.toUpperFirstLetter = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  Builder.prototype.isJson = function (content) {
    try {
      JSON.parse(content);
      return true;
    } catch (error) {
      return false;
    }
  };
  return Builder;
})();

exports.Builder = Builder;
