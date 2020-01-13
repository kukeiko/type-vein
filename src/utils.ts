export function permutate<T>(source: T[][], accumulated: T[] = []): T[][] {
    if (source.length === 0) {
        return [accumulated];
    } else {
        let result: T[][] = [];

        for (let item of source[0]) {
            result = [
                ...result,
                ...permutate(source.slice(1), [...accumulated, item])
            ];
        }

        return result;
    }
}
