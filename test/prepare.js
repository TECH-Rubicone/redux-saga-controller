
// outsource dependencies
import _ from 'lodash';

// local dependencies
import { selectCSD, updateCSD, clearCSD } from './reducer';

/**
 * generate annotation for controller using minimal input data
 * @param options
 * @returns {{
  subscriber: *,
  selector: (function(*=): *),
  TYPE: {},
  initial: {},
  name: string,
  action: {
    updateCtrl: (function(*=): {payload: *, name: *, type: string}),
    clearCtrl: (function(): {name: *, type: string})
    *: (function(): {name: *, type: string})
  }
 }}
*/
export default (options = {}) => {
  const ctrlName = _.uniqueId(typeof options.prefix === 'string' ? options.prefix : 'controller');
  if (!isGeneratorFn(options.subscriber)) {
    throw new Error(`Controller(${ctrlName}) "subscriber" is required and should be generator "sagas"`);
  }

  const createTypes = _.isArray(options.types) ? options.types : [];
  createTypes.map(type => type.toUpperCase());

  const subscriber = options.subscriber;
  const initial = _.isObject(options.initial) ? options.initial : {};
  // predefined actions for reducer data
  const action = {
    clearCtrl: clearCSD(ctrlName),
    updateCtrl: updateCSD(ctrlName),
  };
    //
  const TYPE = {};
  createTypes.map(type => {
    // create unique action type
    TYPE[type] = `@${ctrlName}/${type}`;
    // create action creator for this type
    return action[_.camelCase(type)] = payload => ({ type: TYPE[type], payload });
  });

  return {
    TYPE,
    initial,
    action,
    subscriber,
    name: ctrlName,
    selector: selectCSD(ctrlName),
  };
};

/*
 *
 * @param {Any} options
 * @returns {Boolean}
 */
function isGeneratorFn (fn) {
  // FIXME on production build the generator will compile to "switch function"
  return typeof fn === 'function';
  // FIXME it's mean the validation is "isGeneratorFn" should be simplified too
  // return typeof fn === 'function' && fn.constructor && fn.constructor.name === 'GeneratorFunction';
}
