import { ValueCriterion, ValueCriteria } from "./value-criterion";
import { ValuesCriterion, ValuesCriteria } from "./values-criterion";
import { Property } from "../property";
import { Primitive, Unbox } from "../lang";
import { Attribute } from "../attribute";

export type PropertyCriterion
    = ValueCriterion | ValuesCriterion | ObjectCriterion;

export type PropertyCriteria
    = ValueCriterion[] | ValuesCriterion[] | ObjectCriterion[];

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

export type ObjectCriterion = Record<string, ObjectCriterion.PropertyCriteria>;

export type ObjectCriteria = ObjectCriterion[];

export module ObjectCriterion {
    export type PropertyCriteria = ValueCriteria | ValuesCriteria | ObjectCriteria;

    export type ForType<T> = {
        [K in Property.Keys<T>]?
        : T[K] extends Property & { value: Primitive; } & Attribute.IsIterable ? ValuesCriterion[]
        : T[K] extends Property & { value: Primitive; } ? ValueCriterion[]
        : T[K] extends Property ? ObjectCriterion.ForType<Unbox<T[K]["value"]>>[]
        : never;
    };

    export function reduce(a: ObjectCriterion, b: ObjectCriterion): ObjectCriterion | null {
        let reducedPropertyCriteria: { key: string; reduced: ObjectCriterion.PropertyCriteria; } | undefined;

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
            let reduced: ObjectCriterion.PropertyCriteria | null;

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
}
