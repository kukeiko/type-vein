import { Type, Property, TypeQuery, Instance, TypeSymbol } from "../../src";

describe("type-query", () => {
    it("should allow to load related entity", ()=>{
        //arrange
        class SuperHero {
            //a needed magical line to make type stuff happen
            [TypeSymbol] = Type.createMetadata(SuperHero);
            
            name = Property.create("name", String, b=>b.loadable(["nullable", "voidable"]).filterable());
            superPower = Property.create("superPower", SuperPower, b => b.loadable(["voidable"]).iterable());
        }

        class SuperPower {
            //a needed magical line to make type stuff happen
            [TypeSymbol] = Type.createMetadata(SuperPower);

            name = Property.create("name", String, b=>b.loadable(["nullable", "voidable"]).filterable());
            isCool = Property.create("isCool", Boolean, b=>b.loadable(["nullable", "voidable"]).filterable());
        }

        //act
        let typeQuery = new TypeQuery(new SuperHero());

        let selectedType = typeQuery
            //first - selecting a super hero
            .select(s=>s
                //then selecting its name, that is a simple type property
                .select(s=> s.name)
                //then adding another select to select a property of the other class type
                .select(superHero=>superHero.superPower, power=>power)
            ).build();
        
        //assert which is "check we have autocomplition and type validation" for now.
        let instance: Instance<typeof selectedType["selected"], "loadable"> = {
            name: "foo",
            superPower: [{
                name:"laser-eyes",
                isCool: true
            },
            {
                name:"deadpan face",
                isCool:true
                //if you uncomment below I thought you get an error, but it was cool.
                //isCool: "maybe"
            }]
        };        
        
    });
});
