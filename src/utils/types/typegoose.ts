/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/ban-types */
import { Model, Document, Query } from "mongoose";

import { getModelForClass } from "@typegoose/typegoose";

export type Reference<R> = string & { check?: R };

export class AnyArray {
  public somethings?: any[];
}

export type Doc<T> = {
  [P in keyof T]: T[P] extends Reference<infer R>
    ? string
    : T[P] extends Reference<infer R>[]
    ? string[]
    : T[P] extends String
    ? string
    : T[P] extends AnyArray
    ? any[]
    : T[P] extends Map<string, string>
    ? { [key: string]: string }
    : T[P];
};

export type DocumentType<T> = Doc<T> & Document;

type PopulateItem<T, K> = {
  [x in keyof T]: T[x] extends Reference<infer R>
    ? x extends K
      ? Doc<R>
      : T[x]
    : T[x] extends Array<Reference<infer R>>
    ? x extends K
      ? Array<Doc<R>>
      : Array<T[x]>
    : T[x];
};

export type Populate<T, K> = T extends Array<infer A>
  ? PopulateItem<A, K>
  : PopulateItem<T, K>;

export interface MyModel<T, TQueryHelpers = {}, TMethods = {}>
  extends Model<T, TQueryHelpers, TMethods> {}

export interface MyQuery<ResultType, DocType extends Document, THelpers = {}>
  extends Query<ResultType, DocType, THelpers> {}

export function getModel<T>(model: new () => T): MyModel<T> {
  return getModelForClass(model as any) as MyModel<T>;
}

type IPromiseResolvedType<T> = T extends Promise<infer R> ? R : never;
export type PromiseType<T extends (...args: any) => any> = IPromiseResolvedType<
  ReturnType<T>
>;

(Query.prototype as any).populateTs = function populateTs(props) {
  return this.populate(props);
};

type OnlyActualRefsNames<T> = {
  [K in keyof T]: T[K] extends Reference<infer R>
    ? K
    : T[K] extends Array<Reference<infer R>>
    ? K
    : never;
}[keyof T];

type OnlyActualRefs<T> = Pick<T, OnlyActualRefsNames<T>>;

type ArrayFixOnlyActualRefs<T> = T extends Array<infer A>
  ? OnlyActualRefs<A>
  : OnlyActualRefs<T>;

declare module "mongoose" {
  interface Query<ResultType, DocType, THelpers> {
    populateTs<P extends keyof ArrayFixOnlyActualRefs<NonNullable<ResultType>>>(
      prop: P[],
    ): Query<
      Doc<
        Populate<
          ResultType extends Array<infer A> ? Array<ResultType> : ResultType,
          P
        >
      >,
      Doc<
        Populate<
          ResultType extends Array<infer A> ? Array<ResultType> : ResultType,
          P
        >
      > &
        Document
    > &
      THelpers;
  }
}
