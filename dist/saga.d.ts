import Controller from './controller';
export declare const subscribeAction: <T extends string, I>(controller: Controller<T, I>) => {
    type: string;
    payload: {
        controller: Controller<T, I>;
    };
};
export declare const unsubscribeAction: <T extends string, I>(controller: Controller<T, I>) => {
    type: string;
    payload: {
        controller: Controller<T, I>;
    };
};
export declare function sagas(): Generator<import("redux-saga/effects").ForkEffect<never>, void, unknown>;
export default sagas;
