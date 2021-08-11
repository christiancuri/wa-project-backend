import * as _ from "lodash";

const slice = Array.prototype.slice;

const rest = (array: any, n: any, guard?: any): any[] =>
  slice.call(array, n == null || guard ? 1 : n);

function last(array: any, n?: any, guard?: any): any[] | any {
  if (array == null || array.length < 1)
    return n == null || guard ? void 0 : [];
  if (n == null || guard) return array[array.length - 1];
  return rest(array, Math.max(0, array.length - n));
}

type Options = {
  rootObjectName?: string;
};

export class Builder {
  private rootObjectName = "RootObject";

  constructor(options?: Options) {
    if (options?.rootObjectName) {
      this.rootObjectName = options.rootObjectName;
    }
  }

  build(content: string): string {
    if (!this.isJson(content)) throw new Error("Invalid json");

    const jsonContent = JSON.parse(content);

    if (_.isArray(jsonContent)) return this.json2Interfaces(jsonContent[0]);

    return this.json2Interfaces(jsonContent);
  }

  private json2Interfaces(
    jsonContent: { [s: string]: any },
    objectName = this.rootObjectName,
  ): string {
    const optionalKeys: string[] = [];
    const objectResult: string[] = [];

    for (const key in jsonContent) {
      const value = jsonContent[key];

      if (_.isObject(value) && !_.isArray(value)) {
        const childObjName = this.toUpperFirstLetter(key);
        objectResult.push(this.json2Interfaces(value, childObjName));
        jsonContent[key] = `${this.removeMajority(childObjName)};`;
      } else if (_.isArray(value)) {
        const arrTypes = this.catchMultiArrayTypes(value);

        if (this.isMultiArray(arrTypes)) {
          const arrBrackets = this.getMultiArrayBrackets(value as any);

          if (this.isAllEqual(arrTypes)) {
            jsonContent[key] = arrTypes[0].replace("[]", arrBrackets);
          } else {
            jsonContent[key] = `any${arrBrackets};`;
          }
        } else if (value.length > 0 && _.isObject(value[0])) {
          const childObjName = this.toUpperFirstLetter(key);
          objectResult.push(this.json2Interfaces(value[0], childObjName));
          jsonContent[key] = `${this.removeMajority(childObjName)}[];`;
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

    const result = this.formatCharsToTs(jsonContent, objectName, optionalKeys);

    objectResult.push(result);

    return objectResult.join("\n\n");
  }

  private catchMultiArrayTypes(value: any, valueType: string[] = []): string[] {
    if (_.isArray(value)) {
      if (value.length === 0) {
        valueType.push("any[];");
      } else if (_.isArray(value[0])) {
        for (const element of value) {
          const valueTypeResponse = this.catchMultiArrayTypes(
            element,
            valueType,
          );
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
  }

  private isMultiArray(arrTypes: string[]): boolean {
    return arrTypes.length > 1;
  }

  private isAllEqual(arr: string[]): boolean {
    return _.every(arr.slice(1), _.partial(_.isEqual, arr[0]));
  }

  private getMultiArrayBrackets(content: string): string {
    const jsonStr = JSON.stringify(content);

    let brackets = "";

    for (let i = 0, l = jsonStr.length; i < l; i++) {
      const element = jsonStr[i];

      if (element === "[") {
        brackets = `${brackets}[]`;
      } else {
        i = l;
      }
    }

    return brackets;
  }

  private formatCharsToTs(
    jsonContent: any,
    objName: string,
    optionalKeys: string[],
  ): string {
    let result = JSON.stringify(jsonContent, null, "\t")
      .replace(new RegExp('"', "g"), "")
      .replace(new RegExp(",", "g"), "");

    const allKeys = _.keys(jsonContent);

    for (const key of allKeys) {
      result = result.replace(
        new RegExp(key + ":", "g"),
        key + (_.includes(optionalKeys, key) ? "?:" : ":"),
      );
    }

    objName = this.removeMajority(objName);

    return `export type ${objName} = ${result}`;
  }

  private removeMajority(objName: string): string {
    if (last(objName, 3).join("").toUpperCase() === "IES") {
      return objName.substring(0, objName.length - 3) + "y";
    } else if ((last(objName) as string).toUpperCase() === "S") {
      return objName.substring(0, objName.length - 1);
    }

    return objName;
  }

  private toUpperFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private isJson(content: string): boolean {
    try {
      JSON.parse(content);
      return true;
    } catch (error) {
      return false;
    }
  }
}
