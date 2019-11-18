import { Type } from "./type";
import { TypeSelector } from "./type-selector";
import { CriteraBuilder } from "./criteria-builder";
import { WithContext } from "./context";
import { Select } from "./select";
import { Selection } from "./selection";

export type QueriedType<T extends Type, S extends Selection<T>, C extends CriteraBuilder<S, "loadable">>
    = {
        selected: S;
        criteria: C;
    };

export class TypeQuery<T extends Type, S extends Selection<T> = Select<T, WithContext<"loadable", false, any, any>>> {
    constructor(type: T) {
        this._type = type;
        this._selector = new TypeSelector<T, S>(type).select("loadable");
    }

    private readonly _type: T;
    private readonly _selector: TypeSelector<T, S>;

    select<O>(select: (selector: TypeSelector<T, S>) => TypeSelector<T, O>): TypeQuery<T, S & O> {
        select(this._selector);
        return this as any;
    }

    where(filter: (criteriaBuilder: CriteraBuilder<S, "loadable">) => any): this;
    where(operand: "and" | "or", filter: (criteriaBuilder: CriteraBuilder<S, "loadable">) => any): this;

    where(...args: any[]): this {
        return this;
    }

    build(): QueriedType<T, S, CriteraBuilder<S, "loadable">> {
        return {
            selected: this._selector.build(),
            criteria: {} as CriteraBuilder<S, "loadable">
        };
    }
}
