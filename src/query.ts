import { SourceType } from "./source-type";
import { CriteraBuilder } from "./criteria-builder";
import { Replace } from "./lang";
import { Selector } from "./selector";
import { ObjectCriteria } from "./criteria";
import { UntypedSelection, Selection } from "./selection";

export type Query<T extends SourceType, S> = {
    type: T;
    selection: S;
    criteria: ObjectCriteria.ForType<T>;
};

export module Query {
    export function reduce<T extends SourceType, S>(a: Query<T, S>, b: Query<T, S>): Query<T, UntypedSelection> | null {
        const reducedCriteria = ObjectCriteria.reduce(a.criteria as ObjectCriteria, b.criteria as ObjectCriteria);

        if (reducedCriteria === null) {
            const reducedSelection = Selection.reduce(a.selection as any, b.selection as any);

            if (reducedSelection === null) {
                return null;
            } else if (reducedSelection === a.selection as any) {
                return a as any as Query<T, UntypedSelection>;
            } else {
                return {
                    ...a,
                    selection: reducedSelection as any
                };
            }
        } else if (reducedCriteria !== a.criteria && Selection.isSuperset(b.selection as any, a.selection as any)) {
            return {
                ...a,
                criteria: reducedCriteria as ObjectCriteria.ForType<T>
            } as any as Query<T, UntypedSelection>;
        } else {
            return a as any as Query<T, UntypedSelection>;
        }
    }
}

export class QueryBuilder<T extends SourceType> {
    constructor(type: T) {
        this.type = type;
        this.selector = new Selector(type, "loadable");
        this.criteriaBuilder = new CriteraBuilder(type);
    }

    readonly type: T;
    readonly selector: Selector<T, "loadable">;
    readonly criteriaBuilder: CriteraBuilder<T, "loadable">;

    include<O>(select: (selector: Selector<T, "loadable", ReturnType<this["selector"]["build"]>>) => Selector<T, "loadable", O>)
        : this & Replace<this, "selector", Selector<T, "loadable", O>> {
        select(this.selector as any);
        return this as any;
    }

    where(filter: (criteriaBuilder: CriteraBuilder<T, "loadable">) => any): this;
    where(operand: "and" | "or", filter: (criteriaBuilder: CriteraBuilder<T, "loadable">) => any): this;

    where(...args: any[]): this {
        return this;
    }

    build(): Query<T, ReturnType<this["selector"]["build"]>> {
        return {
            type: this.type,
            selection: this.selector.build() as ReturnType<this["selector"]["build"]>,
            criteria: this.criteriaBuilder.build()
        };
    }
}
