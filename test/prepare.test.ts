
// outsource dependencies

// local dependencies
import { prepareController } from '../src';
import { testPrefix as prefix, testTypes as types, testInitial as initial, formattedActionNames, testSubscriber as subscriber } from './test.mock';
// import { testSubscriber as subscriber, testInitial as initial, testPrefix as prefix, testTypes as types, formattedActionNames } from './test.mock';

const options = {
  prefix,
  types,
  initial,
  subscriber,
};

describe('Controller preparing', () => {

  it('should check "CtrlOptions"', () => {
    expect(() => prepareController(options)).not.toThrow();
    expect(() => prepareController({ ...options, subscriber: void(0) })).toThrow();
    expect(() => prepareController({ ...options, initial: void(0) })).toThrow();
    expect(() => prepareController({ ...options, types: void(0) })).toThrow();
    expect(() => prepareController({ ...options, types: [] })).toThrow();
  });

  it('should follow "rules"', () => {
    const testCtrl = prepareController(options)
    expect(testCtrl).toEqual(
      expect.objectContaining({
        initial: initial,
        subscriber: subscriber,
        selector: expect.any(Function),
        name: expect.stringContaining(prefix),
        // TYPE: expect.objectContaining({
        //   [types[0]]: `@${testCtrl.name}/${types[0]}`,
        //   [types[1]]: `@${testCtrl.name}/${types[1]}`,
        //   [types[2]]: `@${testCtrl.name}/${types[2]}`,
        // }),
        action: expect.objectContaining({
          clearCtrl: expect.any(Function),
          updateCtrl: expect.any(Function),
          [formattedActionNames[0]]: expect.any(Function),
          [formattedActionNames[1]]: expect.any(Function),
          [formattedActionNames[2]]: expect.any(Function),
        }),
      })
    );
  });

  it('should care "optional"', () => {
    expect(prepareController(options)).toEqual(
      expect.objectContaining({
        subscriber: subscriber,
        TYPE: expect.any(Object),
        name: expect.any(String),
        initial: expect.any(Object),
        selector: expect.any(Function),
        action: expect.objectContaining({
          clearCtrl: expect.any(Function),
          updateCtrl: expect.any(Function)
        }),
      })
    );
  });

});
