import { SourceType, Property, QueryBuilder, Instance, SourceTypeSymbol, Context, ValueCriterion, ValueCriteria, Primitive, Unbox, Domain } from "../../src";
import { EntitySet } from "../../src/entity-set";
import { Selection } from "../../src/selection";
import { Selector } from "../../src/selector";

describe("playground", () => {
    it("playing w/ unions", () => {
        class CircleType {
            [SourceTypeSymbol] = SourceType.createMetadata(CircleType);
            area = Property.create("area", Number, b => b.loadable());
            radius = Property.create("radius", Number, b => b.loadable());
            type = Property.create("type", "circle" as "circle", b => b.loadable());
        }

        class SquareType {
            [SourceTypeSymbol] = SourceType.createMetadata(SquareType);
            area = Property.create("area", Number, b => b.loadable());
            length = Property.create("length", Number, b => b.loadable());
            type = Property.create("type", "square" as "square", b => b.loadable());
        }

        class CanvasType {
            [SourceTypeSymbol] = SourceType.createMetadata(CanvasType);
            shapes = Property.create("shapes", [CircleType, SquareType], b => b.loadable().iterable());
        }

        /**
         * here we're making sure that we have to supply supply all the
         * required properties of a type after discriminating it by setting the "type"
         * property (in this case to either "circle" or "square")
         */
        let squareOrCircleInstance_Square: Instance<SquareType, "loadable"> | Instance<CircleType, "loadable"> = {
            type: "square",
            area: 3,
            length: 3
        };

        let squareOrCircleInstance_Circle: Instance<SquareType, "loadable"> | Instance<CircleType, "loadable"> = {
            type: "circle",
            area: 3,
            radius: 2
        };

        /**
         * making sure unions also work as expected when nested
         */
        let canvasInstance: Instance<CanvasType> = {
            shapes: [
                {
                    type: "circle",
                    area: 7,
                    radius: 1
                },
                {
                    type: "square",
                    area: 25,
                    length: 3
                },
                {
                    type: "circle",
                    area: 54,
                    radius: 3
                }
            ]
        }

        /**
         * discriminate union in a switch
         */
        function takesUnionInstance(instance: Instance<CircleType> | Instance<SquareType>): void {
            switch (instance.type) {
                case "circle":
                    expect(instance.radius).toBeDefined();
                    break;

                case "square":
                    expect(instance.length).toBeDefined();
                    break;
            }
        }
    });

    it("playing with instance-loader", () => {
        class AlbumType {
            [SourceTypeSymbol] = SourceType.createMetadata(AlbumType);
            name = Property.create("name", String, b => b.loadable(["optional"]));
            releasedAt = Property.create("releasedAt", String, b => b.loadable());
            songs = Property.create("songs", SongType, b => b.loadable().iterable());
            artist = Property.create("songs", ArtistType, b => b.loadable(["optional"]).iterable());
        }

        class ArtistType {
            [SourceTypeSymbol] = SourceType.createMetadata(ArtistType);
            name = Property.create("name", String, b => b.loadable());
            age = Property.create("age", Number, b => b.loadable(["optional"]));
        }

        class SongType {
            [SourceTypeSymbol] = SourceType.createMetadata(SongType);
            album = Property.create("album", AlbumType, b => b.loadable(["optional", "nullable"]));
            duration = Property.create("duration", Number, b => b.loadable());
            name = Property.create("name", String, b => b.loadable());
        }

        function foo<F>(x?: any): x is F {
            return true;
        }

        let dumdidum = (x?: any): x is string => foo<string>(x) && foo<number>(x);

        // let albumTypeInstanceLoader: InstanceLoader<AlbumType> = {
        //     async load(loadable, criteria) {
        //         // expected to be false
        //         loadable.releasedAt.loadable.optional;
        //         loadable.songs.loadable.optional;
        //         loadable.songs.value.duration.loadable.optional;
        //         loadable.artist?.value.name.loadable.optional;

        //         // expected to be boolean
        //         loadable.name?.loadable.optional;
        //         loadable.artist?.loadable.optional;
        //         loadable.artist?.value.age?.loadable.optional;
        //         loadable.songs.value.album?.loadable.optional;

        //         loadable.songs?.value[TappedTypeSymbol].source[SourceTypeSymbol].class;

        //         new loadable[TappedTypeSymbol].source[SourceTypeSymbol].class();
        //         let metadata = loadable[TappedTypeSymbol].source[SourceTypeSymbol].class;
        //         loadable[TappedTypeSymbol].source[SourceTypeSymbol].class;
        //         loadable.songs?.value[TappedTypeSymbol].source;

        //         for (let k in loadable) {

        //         }

        //         return new Map([
        //             [1, {

        //             } as any]
        //         ]);
        //     }
        // };

        // let anyTypeInstanceLoader: InstanceLoader<AlbumType | SongType> = {
        //     async load(loadable) {

        //         let metadata = loadable[TappedTypeSymbol].source[SourceTypeSymbol];

        //         if (metadata.class === AlbumType) {

        //             new metadata.class().releasedAt.key;
        //         }
        //         // if (metadata.class === AlbumType) {

        //         // }
        //         // if (type[Blueprint.$Symbol].class === AlbumType) {
        //         //     // new type[Blueprint.$Symbol].class().
        //         // }

        //         return new Map([
        //             [1, {
        //                 name: "foo"
        //             }]
        //         ]);
        //     }
        // };
    });

    xit("playing with domain", () => {
        // arrange
        class AuthorType {
            [SourceTypeSymbol] = SourceType.createMetadata(CanvasType);
            id = Property.create("id", Number, b => b.loadable());
            name = Property.create("name", String, b => b.loadable(["optional"]));
        }

        class CircleType {
            [SourceTypeSymbol] = SourceType.createMetadata(CircleType);
            area = Property.create("area", Number, b => b.loadable(["optional"]));
            radius = Property.create("radius", Number, b => b.loadable(["optional"]));
            type = Property.create("type", "circle" as "circle", b => b.loadable());
        }

        class SquareType {
            [SourceTypeSymbol] = SourceType.createMetadata(CircleType);
            area = Property.create("area", Number, b => b.loadable(["optional"]));
            length = Property.create("length", Number, b => b.loadable(["optional"]));
            type = Property.create("type", "square" as "square", b => b.loadable());
        }

        class CanvasType {
            [SourceTypeSymbol] = SourceType.createMetadata(CanvasType);
            author = Property.create("author", AuthorType, b => b.loadable(["optional"]));
            name = Property.create("name", String, b => b.loadable());
            shapes = Property.create("shapes", [CircleType, SquareType], b => b.loadable(["optional"]).iterable());
        }

        // act
        const instanceLoaders = new Domain();

        instanceLoaders.addLoader(new CanvasType(), async query => {
            const queriedSelection = query.selection;
            const loadedSelection: Selection<CanvasType> = {};

            // instance with all baseline required properties
            let canvas: Instance<CanvasType> = {
                name: "A Sun and a Square"
            };

            // include properties based on the given selection
            if (queriedSelection.author) {
                canvas.author = { id: 7 };
                loadedSelection.author = {};

                if (queriedSelection.author.name) {
                    canvas.author.name = "Susi Sonne";
                    loadedSelection.author.name = true;
                }
            }

            if (queriedSelection.shapes) {
                const sunShape: Instance<CircleType> = { type: "circle" };
                const squareShape: Instance<SquareType> = { type: "square" };
                loadedSelection.shapes = {};

                // check selections for properties common across all shapes
                if (queriedSelection.shapes.area) {
                    sunShape.area = Math.PI * 12;
                    squareShape.area = 25;
                    loadedSelection.shapes.area = true;
                }

                // check selections for properties only on circle shapes
                const circleSelection = queriedSelection.shapes as Selection<CircleType>;

                if (circleSelection.radius) {
                    sunShape.radius = 12;
                    (loadedSelection.shapes as Selection<CircleType>).radius = true;
                }

                // check selections for properties only on square shapes
                const squareSelection = queriedSelection.shapes as Selection<SquareType>;

                if (squareSelection.length) {
                    squareShape.length = 5;
                    (loadedSelection.shapes as Selection<SquareType>).length = true;
                }

                canvas.shapes = [sunShape, squareShape];
            }

            return {
                instances: [canvas],
                loadedSelection
            };
        });

        // picking the properties we want to have included
        const result = instanceLoaders.load(new QueryBuilder(new CanvasType())
            .include(x => x
                .select(canvas => canvas.author, s => s
                    .select(author => author.name)
                )
                .select(canvas => canvas.shapes, s => s
                    .select(shape => shape.area)
                )
                .select(canvas => canvas.shapes, () => CircleType, s => s
                    .select(circle => circle.radius)
                )
                .select(canvas => canvas.shapes, () => SquareType, s => s
                    .select(circle => circle.length)
                )
            )
            .build()
        );

        // assert
        for (let instance of result.instances) {
            expect(instance.author).toBeDefined();
            expect(instance.author.name).toBeDefined();
            expect(instance.shapes).toBeDefined();

            for (let shape of instance.shapes) {
                expect(shape.area).toBeDefined();

                switch (shape.type) {
                    case "circle":
                        expect(shape.radius).toBeDefined();
                        break;

                    case "square":
                        expect(shape.length).toBeDefined();
                        break;
                }
            }
        }
    });

    it("playing with query", () => {
        // arrange
        class AlbumType {
            [SourceTypeSymbol] = SourceType.createMetadata(AlbumType);
            name = Property.create("name", String, b => b.loadable(["optional"]).filterable().unique());
            releasedAt = Property.create("releasedAt", String, b => b.loadable(["nullable", "optional"]).filterable());
            songs = Property.create("songs", SongType, b => b.loadable(["optional"]).iterable());
        }

        class SongType {
            [SourceTypeSymbol] = SourceType.createMetadata(SongType);
            album = Property.create("album", AlbumType, b => b.loadable(["optional"]));
            duration = Property.create("duration", Number, b => b.loadable(["nullable"]).filterable());
            name = Property.create("name", String, b => b.loadable().filterable());
        }

        let typeQuery = new QueryBuilder(new AlbumType());

        let selectedType = typeQuery
            .include(s => s
                .select(s => s.name)
                .select(x => x.songs, s => s
                    .select(x => x.album, s => s
                        .select(x => x.releasedAt)
                    )
                )
            )
            .where(c => c
                .equals(x => x.name, "foo")
                .select(x => x.songs, c => c
                    .equals(x => x.duration, 120)
                    .equals(x => x.name, "foo")
                )
            )
            .where("or", c => c
                .equals(s => s.name, "quak")
                .select(s => s.songs, s => s.select(t => t.album, s => s.equals(t => t.releasedAt, true ? null : "2001")))
            )
            .build();

        let instance: Instance.Selected<AlbumType, typeof selectedType["selection"]> = {
            name: "foo",
            songs: [{
                duration: true ? null : 3,
                name: "foo",
                album: {
                    releasedAt: "2001"
                }
            }]
        };
    });

    it("playing with inheritance on data models", () => {
        class FileSystemNode implements SourceType<typeof FileSystemNode> {
            [SourceTypeSymbol] = SourceType.createMetadata(FileSystemNode);

            // common properties
            id = Property.create("id", String, "Id", b => b.loadable()
                .custom("folder", true as true)
                .custom("file", true as true)
                .custom("audio", true as true)
                .custom("video", true as true)
                .custom("document", true as true)
                .custom("image", true as true)
            );

            name = Property.create("name", String, "Filename", b => b.loadable()
                .custom("folder", true as true)
                .custom("file", true as true)
                .custom("audio", true as true)
                .custom("video", true as true)
                .custom("document", true as true)
                .custom("image", true as true)
            );

            // folder properties
            children = Property.create("children", FileSystemNode, "Children", b => b.loadable(["optional"]).iterable()
                .custom("folder", true as true)
            );

            // file properties
            size = Property.create("size", Number, "FileSizeInBytes", b => b.loadable(["optional"])
                .custom("file", true as true)
                .custom("audio", true as true)
                .custom("video", true as true)
                .custom("document", true as true)
                .custom("image", true as true)
            );

            // properties of audio/video files
            duration = Property.create("duration", Number, "Duration", b => b.loadable(["optional"])
                .custom("video", true as true)
                .custom("audio", true as true)
            );

            // properties of document files
            pages = Property.create("pages", Number, "Pages", b => b.loadable(["optional"])
                .custom("document", true as true)
            );

            // properties of image/video files
            height = Property.create("height", Number, "Height", b => b.loadable(["optional"])
                .custom("image", true as true)
                .custom("video", true as true)
            );

            width = Property.create("width", Number, "Width", b => b.loadable(["optional"])
                .custom("image", true as true)
                .custom("video", true as true)
            );
        }

        type MakePropertyRequired<P extends Context.Has<C>, C extends Context> = P[C]["optional"] extends true ? Context.ChangeOptional<P, C, false> : P;

        type MakePropertiesRequired<T extends SourceType, C extends Context, P = Property>
            = {
                [K in Property.Keys<T, P & Context.Has<C>>]: MakePropertyRequired<T[K], C>;
            };

        let fileSystemNodeInstance: Instance<FileSystemNode, "loadable"> = {
            id: "file-system-node-id",
            name: "the-file-system-node"
        };

        let folderInstance: Instance<MakePropertiesRequired<FileSystemNode, "loadable", { folder: true }>, "loadable"> = {
            id: "folder-id",
            name: "the-folder",
            children: []
        };

        let fileInstance: Instance<MakePropertiesRequired<FileSystemNode, "loadable", { file: true }>, "loadable"> = {
            id: "file-id",
            name: "the-file",
            size: 1337 * 1024 * 1024
        };

        let documentInstance: Instance<MakePropertiesRequired<FileSystemNode, "loadable", { document: true }>, "loadable"> = {
            id: "document-id",
            name: "the-document",
            pages: 64,
            size: 7 * 1024
        };

        let videoInstance: Instance<MakePropertiesRequired<FileSystemNode, "loadable", { video: true }>, "loadable"> = {
            id: "video-id",
            name: "the-video",
            duration: 543,
            height: 1080,
            width: 1920,
            size: 32 * 1024 * 1024
        };

        let audioInstance: Instance<MakePropertiesRequired<FileSystemNode, "loadable", { audio: true }>, "loadable"> = {
            id: "audio-id",
            name: "the-audio",
            duration: 123,
            size: 24 * 1024 * 1024
        };

        let imageInstance: Instance<MakePropertiesRequired<FileSystemNode, "loadable", { image: true }>, "loadable"> = {
            id: "image-id",
            name: "the-image",
            height: 640,
            width: 800,
            size: 1 * 1024 * 1024
        };
    });

    it("playing w/ selection", () => {
        class AuthorType {
            [SourceTypeSymbol] = SourceType.createMetadata(AuthorType);
            id = Property.create("id", Number, b => b.loadable());
            name = Property.create("name", String, b => b.loadable(["optional"]));
        }

        class CircleType {
            [SourceTypeSymbol] = SourceType.createMetadata(CircleType);
            area = Property.create("area", Number, b => b.loadable(["optional"]));
            radius = Property.create("radius", Number, b => b.loadable(["optional"]));
            type = Property.create("type", "circle" as "circle", b => b.loadable());
        }

        class SquareType {
            [SourceTypeSymbol] = SourceType.createMetadata(SquareType);
            area = Property.create("area", Number, b => b.loadable(["optional"]));
            length = Property.create("length", Number, b => b.loadable(["optional"]));
            type = Property.create("type", "square" as "square", b => b.loadable());
        }

        class CanvasType {
            [SourceTypeSymbol] = SourceType.createMetadata(CanvasType);
            author = Property.create("author", AuthorType, b => b.loadable(["optional"]));
            name = Property.create("name", String, b => b.loadable());
            shapes = Property.create("shapes", [CircleType, SquareType], b => b.loadable(["optional"]).iterable());
        }

        let canvasSelector = new Selector(new CanvasType(), "loadable");

        let selectedCanvas = canvasSelector
            .select(x => x.shapes, x => x.select(x => x.area))
            .select(x => x.shapes, () => SquareType, x => x.select(x => x.length))
            .select(x => x.shapes, () => CircleType, x => x.select(x => x.radius))
            .select(x => x.author)
            .select(x => x.author, x => x.select(x => x.name))
            .build();

        let canvasInstance: Instance<CanvasType, "loadable", Property, never, typeof selectedCanvas> = {
            name: "foo",
            shapes: [{
                type: "square",
                length: 3,
                area: 3
            }, {
                type: "circle",
                area: 123,
                radius: 4
            }],
            author: {
                id: 3,
                name: "susi"
            }
        };

        class CoffeeCup {
            [SourceTypeSymbol] = SourceType.createMetadata(CoffeeCup);
            beans = Property.create("beans", CoffeeBeans, b => b.loadable(["optional"]));
            color = Property.create("color", String, b => b.loadable());
            label = Property.create("label", String, b => b.loadable(["optional"]));
            volume = Property.create("volume", Number, b => b.loadable(["optional", "nullable"]));
        }

        class CoffeeBeans {
            [SourceTypeSymbol] = SourceType.createMetadata(CoffeeBeans);
            origin = Property.create("origin", String, b => b.loadable(["optional"]));
            tasty = Property.create("tasty", Boolean, b => b.loadable(["optional"]));
        }

        type ExpandedValue<P extends Property, CTX extends Context>
            = P["value"] extends Primitive ? true
            : true | Expansion<Unbox<P["value"]>, CTX>;

        type Expansion<ST, CTX extends Context> = {
            [K in Property.Keys<ST, Context.Has<CTX, any, true>>]?: ExpandedValue<ST[K], CTX>;
        };

        let selector = new Selector(new CoffeeCup(), "loadable")
            // .select(x => x.label)
            // .select(x => x.volume)
            .select(x => x.beans, x => x.select(x => x.origin))
            ;

        let selected = selector.build();

        let selectedInstance: Instance<CoffeeCup, "loadable", Property, never, typeof selected> = {
            // label: "foo",
            beans: {
                origin: "Africa"
            },
            color: "black",
        }
    });

    it("playing with entity-set", () => {
        class CoffeeCupType {
            [SourceTypeSymbol] = SourceType.createMetadata(CoffeeCupType);
            label = Property.create("label", String, b => b.loadable(["optional"]));
            beans = Property.create("beans", CoffeeBeansType, b => b.loadable(["optional"]));
            volume = Property.create("volume", Number, b => b.loadable(["optional", "nullable"]));
        }

        class CoffeeBeansType {
            [SourceTypeSymbol] = SourceType.createMetadata(CoffeeBeansType);
            origin = Property.create("origin", String, b => b.loadable(["optional"]));
            tasty = Property.create("tasty", Boolean, b => b.loadable(["optional"]));
        }

        let coffeeCupTypeEntitySet = new EntitySet(new CoffeeCupType(), "loadable");

        try {
            // [todo] beans should exist on type maybe?
            coffeeCupTypeEntitySet.get()[0].beans;
            coffeeCupTypeEntitySet.get()[0].volume;
            coffeeCupTypeEntitySet.get()[0].volume;
            coffeeCupTypeEntitySet.get()[0].label;
        } catch (error) {
            // on purpose since implementation is still missing
        }
    });

    it("playing with criteria", () => {
        let criteriaA = [
            ValueCriterion.Equals.create(2),
            ValueCriterion.Equals.create(3)
        ];

        let criteriaB = [
            ValueCriterion.In.create([2, 3])
        ];

        // expect(InstanceCriteria.reduceSingleValueCriteria(criteriaA, criteriaB)).toEqual([Criterion.Equals.create(3)]);
        expect(ValueCriteria.reduce(criteriaA, criteriaB)).toBeNull();
    });
});