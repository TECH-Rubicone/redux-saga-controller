
// outsource dependencies
import { AnyAction } from 'redux';

// local dependencies
import { PREFIX } from './constant';

export interface Action<Payload> extends AnyAction{
  payload: Payload;
  type: string;
}
interface CtrlActionCreator<Payload> {
  (payload: Payload): Action<Payload>
  toString(): string;
  TYPE: string;
}

export function createAction<Payload> (type: string): CtrlActionCreator<Payload> {
  const ac: CtrlActionCreator<Payload> = (payload: Payload) => ({ type, payload });
  ac.toString = () => type;
  ac.TYPE = type;
  return ac;
}

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
export const clearCSDAction: CtrlActionCreator<any> = createAction(`${PREFIX.REDUCER}CLEAR`);
// clearCSDAction.TYPE
export function createClearCtrl<Initial> (
  id: string,
  data: Initial
): { (): Action<{ id: string, data: Initial }> } {
  return () => clearCSDAction({ id, data });
}
// const clear = createClearCtrl('q', { test: '2', wau: 2 });
// clear().payload.data.wau;
// clear().payload.data.wau2;

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
export const updateCSDAction: CtrlActionCreator<any> = createAction(`${PREFIX.REDUCER}UPDATE`);
// updateCSDAction.TYPE
export function createUpdateCtrl<Initial> (
  id: string
): { (data: Partial<Initial>): Action<{ id: string, data: Partial<Initial> }> } {
  return data => updateCSDAction({ id, data });
}
// const update = createUpdateCtrl<{ test: string, wau: number }>('q');
// update({ test: '' }).payload.data.wau;
// update({ test: 2 }).payload.data.wau2;

export const removeCSDAction: CtrlActionCreator<{ id: string }> = createAction(`${PREFIX.REDUCER}REMOVE`);

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
export const createCSDAction: CtrlActionCreator<{ id: string, data: any }> = createAction(`${PREFIX.REDUCER}CREATE`);

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
export const updateCSDMetaAction: CtrlActionCreator<{ id: string, data: any }> = createAction(`${PREFIX.REDUCER}META`);

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
export const subscribeAction: CtrlActionCreator<any> = createAction(`${PREFIX.SAGA}SUBSCRIBE`);

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
export const unsubscribeAction: CtrlActionCreator<any> = createAction(`${PREFIX.SAGA}UNSUBSCRIBE`);
