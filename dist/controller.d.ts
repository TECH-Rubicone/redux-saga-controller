import { ActionCreator } from './types';
export declare class Controller<T extends string, I> {
    name: string;
    initial: I;
    TYPE: Record<T, string>;
    action: Record<T | "updateCtrl" | "clearCtrl", ActionCreator>;
    selector: (name: string) => any;
    subscriber: () => any;
    constructor({ types, prefix, initial, subscriber }: {
        types: Array<T>;
        prefix: string;
        initial: I;
        subscriber: () => void;
    });
}
export default Controller;
export declare const c: Controller<"initialize" | "updateData" | "TYPE_2", {
    test: number;
    foo: number;
    bar: number;
}>;
