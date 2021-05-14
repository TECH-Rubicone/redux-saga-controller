
// outsource dependencies


// local dependencies
import { hash } from './constant';


const PREFIX = {
  SAGA: `@CSD-action-${hash()}/` as 'value',
  REDUCER: `@CSD-store-${hash()}/` as 'value',
};

export interface Action<Payload> {
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

type ClearPayload<Initial> = { id: string, data: Initial };
/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
export const clearCSDAction: CtrlActionCreator<ClearPayload <any>> = createAction(`${PREFIX.REDUCER}CLEAR`);
// clearCSDAction.TYPE
export function createClearCtrl<Initial> (
  id: string,
  data: Initial
): { (): Action<ClearPayload <Initial>> } {
  return () => clearCSDAction({ id, data });
}
// const clear = createClearCtrl('q', { test: '2', wau: 2 });
// clear().payload.data.wau;
// clear().payload.data.wau2;

type UpdatePayload<Initial> = { id: string, data: Partial<Initial> };
/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
export const updateCSDAction: CtrlActionCreator<UpdatePayload <any>> = createAction(`${PREFIX.REDUCER}UPDATE`);
// updateCSDAction.TYPE
export function createUpdateCtrl<Initial> (
  id: string
): { (data: Partial<Initial>): Action<UpdatePayload <Initial>> } {
  return data => updateCSDAction({ id, data });
}
// const update = createUpdateCtrl<{ test: string, wau: number }>('q');
// update({ test: '' }).payload.data.wau;
// update({ test: '' }).payload.data.wau2;

type RemovePayload = { id: string };
export const removeCSDAction: CtrlActionCreator<RemovePayload> = createAction(`${PREFIX.REDUCER}REMOVE`);

type CreatePayload<Initial> = { id: string, data: Initial };
/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
export const createCSDAction: CtrlActionCreator<CreatePayload<any>> = createAction(`${PREFIX.REDUCER}CREATE`);

type UpdateMetaPayload<Initial> = { id: string, data: Initial };
/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
export const updateCSDMetaAction: CtrlActionCreator<UpdateMetaPayload<any>> = createAction(`${PREFIX.REDUCER}META`);

export const subscribeAction = createAction(`${PREFIX.SAGA}SUBSCRIBE`);

export const unsubscribeAction = createAction(`${PREFIX.SAGA}UNSUBSCRIBE`);
