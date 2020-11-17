export declare const clearCSDAction: (name: string) => {
    type: string;
    payload: {
        name: string;
    };
};
export declare const removeCSDAction: (name: string) => {
    type: string;
    payload: {
        name: string;
    };
};
export declare const createCSDAction: (name: string, initial: any) => {
    type: string;
    payload: {
        name: string;
        initial: any;
    };
};
export declare const updateCSDAction: (name: string, data: any) => {
    type: string;
    payload: {
        name: string;
        data: any;
    };
};
export declare const updateCSDMetaAction: (name: string, data: any) => {
    type: string;
    payload: {
        name: string;
        data: any;
    };
};
export declare const clearCSD: (name: string) => () => {
    type: string;
    payload: {
        name: string;
    };
};
export declare const updateCSD: (name: string) => (data: any) => {
    type: string;
    payload: {
        name: string;
        data: any;
    };
};
export declare const selectCSD: (name: string) => (state: any) => any;
export declare const selectMetaCSD: (name: string) => (state: any) => any;
export declare const reducer: (state: any, action: {
    type: string;
    payload: any;
}) => any;
