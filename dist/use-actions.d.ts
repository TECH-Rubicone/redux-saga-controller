import { Controller } from './index';
export declare const useActions: <T extends string, I>(controller: Controller<T, I>) => Record<string, (payload?: any) => any>;
export default useActions;
