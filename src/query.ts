import { SourceType } from "./source-type";
import { CriteraBuilder } from "./criteria-builder";
import { Replace } from "./lang";
import { Selector } from "./selector";

export type QueriedType<T extends SourceType, S> = {
    type: T;
    selection: S;
    criteria: CriteraBuilder<T, "loadable">;
};

export class Query<T extends SourceType> {
    constructor(type: T) {
        this.type = type;
        this.selector = new Selector(type, "loadable");
    }

    readonly type: T;
    readonly selector: Selector<T, "loadable">;

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

    build(): QueriedType<T, ReturnType<this["selector"]["build"]>> {
        return {
            type: this.type,
            selection: this.selector.build() as ReturnType<this["selector"]["build"]>,
            criteria: {} as CriteraBuilder<T, "loadable">
        };
    }
}
