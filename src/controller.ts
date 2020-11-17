// NOTE -

// outsource dependencies

// local dependencies
import { uniqueId } from './utils';
import { ActionCreator, DefaultActions } from './types';
import { selectCSD, updateCSD, clearCSD } from './reducer';

export class Controller<T extends string, I> {
  initial: I;

  name: string;

  subscriber: () => any;

  TYPE = {} as Record<T, string>;

  selector: (name: string) => any;

  action = {} as Record<T | DefaultActions, ActionCreator>;

  constructor ({
    types, prefix, initial, subscriber
  } : {
    types: Array<T>, prefix?: string, initial: I, subscriber: () => void
  }) {
    this.name = uniqueId(prefix);

    // TODO forbid to pass properties
    this.action.clearCtrl = clearCSD(this.name);
    // TODO allow to pass only properties as in initial
    this.action.updateCtrl = updateCSD(this.name);

    for (const type of types) {
      this.TYPE[type] = `TEST/${type.toUpperCase()}`;
      // const actionType = _.camelCase(type);
      this.action[type] = (payload?: any) => ({ type, payload });
    }

    this.initial = initial;
    this.subscriber = subscriber;
    this.selector = selectCSD(this.name);
  }
}

// export const c = new Controller({
//   types: ['initialize', 'updateData', 'TYPE_2'],
//   prefix: 'custom',
//   initial: { test: 1, foo: 2, bar: 3 },
//   subscriber: () => null
// });

// interface UpdateCtrl {
//   test: number
// }
//
// console.log(c.action.clearCtrl());
// console.log(c.action.updateCtrl());
//
// // const useC


// export default options => {
//   const ctrlName = _.uniqueId(typeof options.prefix === 'string' ? options.prefix : 'controller');
//   if (!isGeneratorFn(options.subscriber)) {
//     throw new Error(`Controller(${ctrlName}) "subscriber" is required and should be generator "sagas"`);
//   }
//
//   const createTypes = _.isArray(options.types) ? options.types : [];
//   createTypes.map(type => type.toUpperCase());
//
//   const subscriber = options.subscriber;
//   const initial = _.isObject(options.initial) ? options.initial : {};
//   // predefined actions for reducer data
//   const action = {
//     clearCtrl: clearCSD(ctrlName),
//     updateCtrl: updateCSD(ctrlName),
//   };
//   //
//   const TYPE = {};
//   createTypes.map(type => {
//     // create unique action type
//     TYPE[type] = `@${ctrlName}/${type}`;
//     // create action creator for this type
//     return action[_.camelCase(type)] = payload => ({ type: TYPE[type], payload });
//   });
//
//   return {
//     TYPE,
//     initial,
//     action,
//     subscriber,
//     name: ctrlName,
//     selector: selectCSD(ctrlName),
//   };
// };

// /*
//  *
//  * @param {Any} options
//  * @returns {Boolean}
//  */
// function isGeneratorFn (fn) {
//   // FIXME on production build the generator will compile to "switch function"
//   return typeof fn === 'function';
//   // FIXME it's mean the validation is "isGeneratorFn" should be simplified too
//   // return typeof fn === 'function' && fn.constructor && fn.constructor.name === 'GeneratorFunction';
// }
