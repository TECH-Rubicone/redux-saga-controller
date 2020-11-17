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
        types: Array<T>;
        prefix?: string;
        initial: I;
        subscriber: any;
    });
    set channel(channel: any | null);
    get channel(): any | null;
}
