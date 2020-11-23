
// outsource dependencies
import { combineReducers } from 'redux';

// local dependencies
import {
  reducer,
  selector,
  selectCSD,
  selectMetaCSD,
  createCSDAction,
  clearCSDAction,
  removeCSDAction,
  updateCSDAction,
  updateCSDMetaAction,
  CSD_REDUCER_PATH,
} from './reducer';
import { testCtrl } from './test.mock';

// configure
const testCSD = testCtrl.name;
const testInitial = testCtrl.initial;
const instance = combineReducers({ [CSD_REDUCER_PATH]: reducer });

describe('Controller reducer @CSD-store', () => {

  it('should care "initial"', () => {
    testReducer(instance).expect(selector, expect.any(Object));
  });

  it('should generate selectors', () => {
    expect(selectCSD).toBeInstanceOf(Function);
    expect(selectMetaCSD).toBeInstanceOf(Function);
    expect(selectCSD(testCSD)).toBeInstanceOf(Function);
    expect(selectMetaCSD(testCSD)).toBeInstanceOf(Function);
  });

  it('check "selectors" CSD', () => {
    const selectTestCSD = selectCSD(testCSD);
    const selectTestCSDMeta = selectMetaCSD(testCSD);

    testReducer(instance)
      // NOTE prepared selector for CSD Meta data replace null to object to avoid Type error for spreads operator
      .expect(selectTestCSDMeta, expect.any(Object))
      // NOTE create CSD with meta
      .put(createCSDAction(testCSD, testInitial))
      .expect(selector, expect.objectContaining({
        [testCSD]: testInitial,
        META: expect.objectContaining({
          [testCSD]: expect.objectContaining({
            initial: testInitial
          })
        }),
      }))
      // NOTE prepared selector for CSD data
      .expect(selectTestCSD, testInitial)
      // NOTE prepared selector for CSD Meta data
      .expect(selectTestCSDMeta, expect.objectContaining({
        initial: testInitial
      }))
      // NOTE remove CSD
      .put(removeCSDAction(testCSD))
      .expect(selector, expect.objectContaining({
        [testCSD]: null,
        META: expect.objectContaining({
          [testCSD]: expect.objectContaining({
            initial: null
          })
        }),
      }))
      // NOTE prepared selector for CSD data replace null to object to avoid Type error for spreads operator
      .expect(selectTestCSD, expect.any(Object))
      // NOTE prepared selector for CSD Meta data
      .expect(selectTestCSDMeta, expect.objectContaining({
        initial: null
      }));
  });

  it('should "create/remove" CSD', () => {
    testReducer(instance)
      // NOTE create CSD with meta
      .put(createCSDAction(testCSD, testInitial))
      .expect(selector, expect.objectContaining({
        [testCSD]: testInitial,
        META: expect.objectContaining({
          [testCSD]: expect.objectContaining({
            initial: testInitial
          })
        }),
      }))
      // NOTE remove CSD
      .put(removeCSDAction(testCSD))
      .expect(selector, expect.objectContaining({
        [testCSD]: null,
        META: expect.objectContaining({
          [testCSD]: expect.objectContaining({
            initial: null
          })
        }),
      }));
  });

  it('CSD full lifecircle', () => {
    const update1 = { update: 'test1', more: 'values' };
    const update2 = { update: 'test2', another: 'values' };

    testReducer(instance)
      // NOTE create CSD with meta
      .put(createCSDAction(testCSD, testInitial))
      .expect(selector, expect.objectContaining({
        [testCSD]: testInitial,
        META: expect.objectContaining({
          [testCSD]: expect.objectContaining({
            initial: testInitial
          })
        }),
      }))
      // NOTE partially update CSD
      .put(updateCSDAction(testCSD, update1))
      .expect(selector, expect.objectContaining({
        [testCSD]: Object.assign({}, testInitial, update1),
        META: expect.objectContaining({
          [testCSD]: expect.objectContaining({
            initial: testInitial
          })
        }),
      }))
      // NOTE partially update CSD Meta
      .put(updateCSDMetaAction(testCSD, update1))
      .expect(selector, expect.objectContaining({
        [testCSD]: Object.assign({}, testInitial, update1),
        META: expect.objectContaining({
          [testCSD]: expect.objectContaining({
            initial: testInitial,
            ...update1
          })
        }),
      }))
      // NOTE clear CSD (bring to initial values)
      .put(clearCSDAction(testCSD))
      .expect(selector, expect.objectContaining({
        [testCSD]: testInitial,
        META: expect.objectContaining({
          [testCSD]: expect.objectContaining({
            initial: testInitial,
            // NOTE clear only bring initial values for CSD without touching it meta
            ...update1
          })
        }),
      }))
      // NOTE partially update CSD
      .put(updateCSDAction(testCSD, update2))
      .expect(selector, expect.objectContaining({
        [testCSD]: Object.assign({}, testInitial, update2),
        META: expect.objectContaining({
          [testCSD]: expect.objectContaining({
            initial: testInitial,
            ...update1
          })
        }),
      }))
      // NOTE partially update CSD Meta
      .put(updateCSDMetaAction(testCSD, update2))
      .expect(selector, expect.objectContaining({
        [testCSD]: Object.assign({}, testInitial, update2),
        META: expect.objectContaining({
          [testCSD]: expect.objectContaining({
            initial: testInitial,
            ...update2
          })
        }),
      }))
      // NOTE clear CSD (bring to initial values)
      .put(clearCSDAction(testCSD))
      .expect(selector, expect.objectContaining({
        [testCSD]: testInitial,
        META: expect.objectContaining({
          [testCSD]: expect.objectContaining({
            initial: testInitial,
            // NOTE clear only bring initial values for CSD without touching it meta
            ...update2
          })
        }),
      }))
      // NOTE remove CSD
      .put(removeCSDAction(testCSD))
      .expect(selector, expect.objectContaining({
        [testCSD]: null,
        META: expect.objectContaining({
          [testCSD]: expect.objectContaining({
            initial: null
          })
        }),
      }));
  });
});

/**
 * test utils
 * @param reducer
 * @param initialState
 * @returns {testReducer}
 */
function testReducer (reducer, initialState) {
  if (!(this instanceof testReducer)) {
    return new testReducer(reducer, initialState);
  }

  this.state = reducer(initialState, { type: '100% not match' });

  this.put = function(action) {
    this.state = reducer(this.state, action);
    return this;
  };

  this.expect = function(selector, value) {
    expect(selector(this.state)).toEqual(value);
    return this;
  };
}
