import { ObjectCriterion } from "./object-criterion";
import { StringIndexable } from "../lang";

export type ObjectCriteria = ObjectCriterion[];

export module ObjectCriteria {
    export type ForType<T> = ObjectCriterion.ForType<T>[];

    export function filter<T extends StringIndexable>(instances: T[], criteria: ObjectCriteria): T[] {
        const allFiltered = new Set<T>();

        for (const criterion of criteria) {
            const filtered = ObjectCriterion.filter(instances, criterion);

            for (const instance of filtered) {
                allFiltered.add(instance);
            }
        }

        return Array.from(allFiltered.values());
    }

    export function reduce(a: ObjectCriteria, b: ObjectCriteria): ObjectCriteria | null {
        let reduced = a.slice();
        let didReduce = false;

        for (let criterionB of b) {
            let nextReduced: ObjectCriteria = [];

            for (let criterionA of reduced) {
                let reducedCriterion = ObjectCriterion.reduce(criterionB, criterionA);

                if (reducedCriterion !== null) {
                    nextReduced.push(reducedCriterion);
                }

                if (reducedCriterion !== criterionA && !didReduce) {
                    didReduce = true;
                }
            }

            reduced = nextReduced;
        }

        if (didReduce) {
            return reduced.length > 0 ? reduced : null;
        } else {
            return a;
        }
    }
}
