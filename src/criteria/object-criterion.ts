import { ValueCriterion, ValueCriteria } from "./value-criterion";
import { ValuesCriterion, ValuesCriteria } from "./values-criterion";
import { Property } from "../property";
import { Primitive, Unbox, StringIndexable } from "../lang";
import { Attribute } from "../attribute";
import { ObjectCriteria } from "./object-criteria";
import { SourceType } from "../source-type";
import { Instance } from "../instance";

export type PropertyCriterion = ValueCriterion | ValuesCriterion | ObjectCriterion;
export type PropertyCriteria = ValueCriteria | ValuesCriteria | ObjectCriteria;

export module PropertyCriterion {
    export function areSameType<A extends PropertyCriterion>(a: A, b: any): b is A {
        if (typeof (a.op) === "string") {
            if (typeof (b.op) === "string") {
                return a.op === b.op;
            } else {
                return false;
            }
        } else {
            return typeof (b.op) !== "string";
        }
    }
}

export type ObjectCriterion = Record<string, PropertyCriteria>;

export module ObjectCriterion {
    export type ForType<T> = {
        [K in Property.Keys<T, Attribute.IsFilterable>]?
        : T[K] extends Property & { value: Primitive; } & Attribute.IsIterable ? ValuesCriterion[]
        : T[K] extends Property & { value: Primitive; } ? ValueCriterion[]
        : T[K] extends Property ? ObjectCriterion.ForType<Unbox<T[K]["value"]>>[]
        : never;
    };

    export type FlatForType<T> = {
        [K in Property.Keys<T, Attribute.IsFilterable>]?
        : T[K] extends Property & { value: Primitive; } & Attribute.IsIterable ? ValuesCriterion
        : T[K] extends Property & { value: Primitive; } ? ValueCriterion
        : T[K] extends Property ? ObjectCriterion.ForType<Unbox<T[K]["value"]>>
        : never;
    };

    export function reduce(a: ObjectCriterion, b: ObjectCriterion): ObjectCriterion | null {
        let reducedPropertyCriteria: { key: string; reduced: PropertyCriteria; } | undefined;

        for (let key in a) {
            let criteriaB = b[key];

            /**
             * [A] has a criteria that [B] doesn't, it therefore can't be a superset
             * => return [B] as is
             */
            if (criteriaB === void 0) {
                return b;
            }

            let criteriaA = a[key];
            let reduced: PropertyCriteria | null;

            if (ValueCriteria.is(criteriaA)) {
                if (ValueCriteria.is(criteriaB)) {
                    reduced = ValueCriteria.reduce(criteriaA, criteriaB);
                } else {
                    throw new Error("trying to reduce two criteria of different types");
                }
            } else {
                throw new Error("currently only ValueCriteria are supported @ ObjectCriterion.reduce()");
            }

            if (reduced === criteriaB) {
                /**
                 * failed to reduce a property of [B] => return [B] as is.
                 */
                return b;
            } else if (reduced !== null && reducedPropertyCriteria !== void 0) {
                /**
                 * reduced a property of [B] but we already reduced another, therefore [A] is no longer a superset of [B]
                 * => return [B] as is
                 */
                return b;
            } else if (reduced !== null && reducedPropertyCriteria === void 0) {
                /**
                 * the first property of [B] that we could reduce => store and continue.
                 * from this point on we're expecting full reductions in order to to continue,
                 * otherwise [B] is returned as is.
                 */
                reducedPropertyCriteria = { key, reduced };
            }
        }

        if (reducedPropertyCriteria === void 0) {
            return null;
        } else {
            return {
                ...b,
                [reducedPropertyCriteria.key]: reducedPropertyCriteria.reduced
            };
        }
    }

    // export function flatten<T extends Partial<ObjectCriterion>>(criterion: T): { [K in keyof T]: T[K] extends PropertyCriteria ? T[K][keyof PropertyCriteria] : never } {
    export function flatten<T>(criteria: ForType<T>[]): FlatForType<T>[] {
        return {} as any;
    }

    export function filter<T extends StringIndexable>(instances: T[], criterion: ObjectCriterion): T[] {
        let filtered: T[] = [];

        for (const propertyCriteriaKey in criterion) {
            const propertyCriteria = criterion[propertyCriteriaKey];

            if (ValueCriteria.is(propertyCriteria)) {
                filtered = ValueCriteria.filter(instances, propertyCriteriaKey, propertyCriteria);
            } else {
                throw new Error(`as of yet only simple value criteria filtering is supported`);
            }
        }

        return filtered;
    }
}
