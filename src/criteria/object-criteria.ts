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
}
