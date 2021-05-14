
// outsource dependencies

// local dependencies
import { prepareController } from '../src';
import { testPrefix as prefix, testTypes as types, testInitial as initial, formattedActionNames, formattedTypeNames, testSubscriber as subscriber } from './test.mock';

// configure
const options = { prefix, types, initial, subscriber };

describe('Controller preparing', () => {

  it('should check "CtrlOptions"', () => {
    expect(() => prepareController(options)).not.toThrow();
    expect(() => prepareController({ ...options, subscriber: void(0) })).toThrow();
    expect(() => prepareController({ ...options, initial: void(0) })).toThrow();
    expect(() => prepareController({ ...options, types: void(0) })).toThrow();
    expect(() => prepareController({ ...options, types: [] })).toThrow();
  });

  it('should follow controller name rules', () => {
    const ctrl1 = prepareController(options);
    expect(ctrl1.name).toContain(prefix);
    expect(ctrl1.name).not.toEqual(prefix);
    const ctrl2 = prepareController({ ...options, prefix: void(0) });
    expect(ctrl2.name).not.toContain(prefix);
    expect(typeof ctrl2.name === 'string').toBeTruthy();

  });

  it('should follow format action creators names', () => {
    const testCtrl = prepareController(options);
    expect(testCtrl).toEqual(
      expect.objectContaining({
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

  it('should follow format action creators info', () => {
    const testCtrl = prepareController(options);
    expect(testCtrl).toEqual(
      expect.objectContaining({
        action: expect.objectContaining({
          [formattedActionNames[0]]: expect.objectContaining({
            TYPE: `@${testCtrl.name}/${formattedTypeNames[0]}`,
            toString: expect.any(Function),
          }),
          [formattedActionNames[1]]: expect.objectContaining({
            TYPE: `@${testCtrl.name}/${formattedTypeNames[1]}`,
            toString: expect.any(Function),
          }),
          [formattedActionNames[2]]: expect.objectContaining({
            TYPE: `@${testCtrl.name}/${formattedTypeNames[2]}`,
            toString: expect.any(Function),
          }),
        }),
      })
    );
  });

  it('should care "defaults"', () => {
    expect(prepareController(options)).toEqual(
      expect.objectContaining({
        subscriber: subscriber,
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
