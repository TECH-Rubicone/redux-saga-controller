
// outsource dependencies

// local dependencies
import prepareController from './prepare';
import { testSubscriber as subscriber, testInitial as initial, testPrefix as prefix, testTypes as types, formattedActionNames } from './test.mock';

describe('Controller preparing', () => {

  it('should check "subscriber"', () => {
    expect(() => prepareController({ subscriber })).not.toThrow();
    expect(() => prepareController({})).toThrow();
    expect(() => prepareController()).toThrow();
  });

  it('should follow "rules"', () => {
    const testCtrl = prepareController({
      prefix,
      types,
      initial,
      subscriber,
    })
    expect(testCtrl).toEqual(
      expect.objectContaining({
        initial: initial,
        subscriber: subscriber,
        selector: expect.any(Function),
        name: expect.stringContaining(prefix),
        TYPE: expect.objectContaining({
          [types[0]]: `@${testCtrl.name}/${types[0]}`,
          [types[1]]: `@${testCtrl.name}/${types[1]}`,
          [types[2]]: `@${testCtrl.name}/${types[2]}`,
        }),
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
    expect(prepareController({ subscriber })).toEqual(
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
