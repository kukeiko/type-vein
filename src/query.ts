import { SourceType } from "./source-type";
import { SourceTypeTapper, DefaultSourceTypeTap } from "./source-type-tapper";
import { CriteraBuilder } from "./criteria-builder";
import { TappedType } from "./tapped-type";
import { Replace } from "./lang";

export type QueriedType<ST extends SourceType, TT extends TappedType<ST>, C extends CriteraBuilder<TT, "loadable">> = {
    sourceType: ST;
    tappedType: TT;
    criteria: C;
};

export type DefaultQuerySelection<T extends SourceType> = DefaultSourceTypeTap<T, "loadable">;

export class Query<ST extends SourceType> {
    constructor(sourceType: ST) {
        this.sourceType = sourceType;
        this.tapper = new SourceTypeTapper(sourceType, "loadable");
    }

    readonly sourceType: ST;
    readonly tapper: SourceTypeTapper<ST, "loadable">;

    include<O>(select: (selector: SourceTypeTapper<ST, "loadable", ReturnType<this["tapper"]["build"]>>) => SourceTypeTapper<ST, "loadable", O>): this & Replace<this, "tapper", SourceTypeTapper<ST, "loadable", O>> {
        select(this.tapper as any);
        return this as any;
    }

    where(filter: (criteriaBuilder: CriteraBuilder<ReturnType<this["tapper"]["build"]>, "loadable">) => any): this;
    where(operand: "and" | "or", filter: (criteriaBuilder: CriteraBuilder<ReturnType<this["tapper"]["build"]>, "loadable">) => any): this;

    where(...args: any[]): this {
        return this;
    }

    build(): QueriedType<ST, ReturnType<this["tapper"]["build"]>, CriteraBuilder<ReturnType<this["tapper"]["build"]>, "loadable">> {
        return {
            sourceType: this.sourceType,
            tappedType: this.tapper.build() as ReturnType<this["tapper"]["build"]>,
            criteria: {} as CriteraBuilder<ReturnType<this["tapper"]["build"]>, "loadable">
        };
    }
}
