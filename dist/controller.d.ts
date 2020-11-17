import { ActionCreator, AnyAction } from 'redux';
export declare type DefaultActions = 'updateCtrl' | 'clearCtrl';
export declare class Controller<T extends string, I> {
    initial: I;
    name: string;
    private _channel;
    TYPE: Record<T, string>;
    selector: (name: string) => any;
    subscriber: any;
    action: Record<T | "updateCtrl" | "clearCtrl", ActionCreator<AnyAction>>;
    constructor({ types, prefix, initial, subscriber }: {
        initial: I;
        prefix?: string;
        subscriber: any;
        types: Array<T>;
    });
    set channel(channel: any | null);
    get channel(): any | null;
}
export declare const c: Controller<"initialize" | "updateData" | "TYPE_2", {
    test: number;
    foo: number;
    bar: number;
}>;
