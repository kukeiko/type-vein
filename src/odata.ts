import { SourceType } from "./source-type";
import { Property } from "./property";

export module OData {
    export function buildExpandSelectQueryStrings<T extends SourceType>(type: T): { $expand: string; $select: string; } {
        let properties = Property.pick(type);

        for (let k in properties) {
            properties[k].key;
        }

        return {
            $expand: "",
            $select: ""
        };
    }
}
