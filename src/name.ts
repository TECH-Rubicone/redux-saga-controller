
export const actionCase = (value: string): string => transform(value, {
  format: (value: string, index: number): string => {
    const first = value.charAt(0);
    const others = value.substr(1).toLowerCase();
    if (index > 0 && first >= '0' && first <= '9') {
      return `_${first}${others}`;
    }
    return `${first.toUpperCase()}${others}`;
  },
  sep: '',
});

export const typeCase = (value: string): string => transform(value, {
  format: (value: string): string => value.toUpperCase(),
  sep: '_',
});

/**
 * Normalize the string into something other libraries can manipulate easier.
 */
function transform (value: string, { sep, format }: {
  sep: string;
  format: (part: string, index: number, parts: string[]) => string;
}): string {
  let result = replace(value, [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g], '$1\0$2');
  result = replace(result, /[^A-Z0-9]+/gi, '\0');
  let start = 0;
  let end = result.length;
  while (result.charAt(start) === '\0') {
    start++;
  }
  while (result.charAt(end - 1) === '\0') {
    end--;
  }
  return result.slice(start, end).split('\0').map(format).join(sep);
}

/**
 * Replace `re` in the input string with the replacement value.
 */
function replace (input: string, regExp: RegExp | RegExp[], value: string) {
  if (regExp instanceof RegExp) {
    return input.replace(regExp, value);
  }
  return regExp.reduce((input, regExp) => input.replace(regExp, value), input);
}


type CtrlActions = 'qwe' | 'qwe2'

function createActions<Type extends string> ({ types }: { types: Array<Type> }): Controller<Type> {
  return new Controller(types);
}

export class Controller<Type extends string> {
  action = {} as Record<Type | CtrlActions, string>;

  constructor (
    types: Array<Type>,
  ) {
    for (const type of types) {
      this.action[type] = 'createAction(`${this.name}/${type.toUpperCase()}`)';
    }
    // NOTE work but not provide suggestions (
    this.action['qwe' as Type] = 'pinClearCSD(this.name)';
    // this.action[forceCast<Type>('updateCtrl')] = 'pinUpdateCSD(this.name)';
    // keyof
  }
}

// NOTE another files/projects
const ctrl = createActions({
  types: ['a', 'b'],
});

ctrl.action.b;
ctrl.action.qwe;

