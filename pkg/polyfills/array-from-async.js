const tooLongErrorMessage = "Input is too long and exceeded Number.MAX_SAFE_INTEGER times.";

const isConstructor = (obj) => {
  if (obj == null) {
    return false;
  }

  const prox = new Proxy(obj, {
    construct() {
      return prox;
    },
  });

  try {
    new prox();

    return true;
  } catch (_err) {
    return false;
  }
};

export const fromAsyncIterable = async (items, mapfn, thisArg) => {
  const result = isConstructor(this) ? new this() : Array(0);

  let i = 0;

  for await (const v of items) {
    if (i > Number.MAX_SAFE_INTEGER) {
      throw TypeError(tooLongErrorMessage);
    }

    if (mapfn) {
      result[i] = await mapfn.call(thisArg, v, i);
    } else {
      result[i] = v;
    }

    i++;
  }

  result.length = i;
  return result;
};

export const fromAsyncNonIterable = async (items, mapfn, thisArg) => {
  // In this case, the items are assumed to be an arraylike object with
  // a length property and integer properties for each element.
  const result = isConstructor(this) ? new this(items.length) : Array(items.length);

  if (items.length > Number.MAX_SAFE_INTEGER) {
    throw TypeError(tooLongErrorMessage);
  }

  let i = 0;

  while (i < items.length) {
    const v = await items[i];

    if (mapfn) {
      result[i] = await mapfn.call(thisArg, v, i);
    } else {
      result[i] = v;
    }

    i++;
  }

  result.length = i;

  return result;
};

export const fromAsync = (items, mapfn, thisArg) => {
  const itemsAreIterable = Symbol.asyncIterator in items || Symbol.iterator in items;

  if (itemsAreIterable) {
    return fromAsyncIterable(items, mapfn, thisArg);
  }

  return fromAsyncNonIterable(items, mapfn, thisArg);
};

export default fromAsync;
