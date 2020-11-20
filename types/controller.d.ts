import { ActionCreator, AnyAction } from 'redux';
export declare type DefaultActions = 'updateCtrl' | 'clearCtrl';
export declare class Controller<T extends string, I> {
    initial: I;
    name: string;
    TYPE: Record<T, string>;
    selector: (name: string) => any;
    subscriber: any;
    action: Record<"updateCtrl" | "clearCtrl" | T, ActionCreator<AnyAction>>;
    private _channel;
    constructor({ types, prefix, initial, subscriber }: {
        initial: I;
        prefix?: string;
        subscriber: any;
        types: Array<T>;
    });
    set channel(channel: any | null);
    get channel(): any | null;
}
