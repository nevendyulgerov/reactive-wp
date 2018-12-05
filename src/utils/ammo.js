/**
 * @description Check if value is of type 'object'
 * @param val
 * @returns {boolean}
 */
export const isObj = val => typeof val === 'object' && !isArr(val) && !isNull(val);

/**
 * @description Check if value is of type 'null'
 * @param val
 * @returns {boolean}
 */
export const isNull = val => val === null;

/**
 * @description Check if value is of type 'number'
 * @param val
 * @returns {boolean}
 */
export const isNum = val => typeof val === 'number' && !isNaN(val);

/**
 * @description Check if value is of type 'function'
 * @param val
 * @returns {boolean}
 */
export const isFunc = val => typeof val === 'function';

/**
 * @description Check if value is of type 'array'
 * @param val
 * @returns {boolean}
 */
export const isArr = val => Array.isArray(val);

/**
 * @description Check if value is of type 'string'
 * @param val
 * @returns {boolean}
 */
export const isStr = val => typeof val === 'string';

/**
 * @description Check if value is of type 'undefined'
 * @param val
 * @returns {boolean}
 */
export const isUndef = val => typeof val === 'undefined';

/**
 * @description Check if value is of type 'boolean'
 * @param val
 * @returns {boolean}
 */
export const isBool = val => typeof val === 'boolean';

/**
 * @description Check if object has property
 * @param obj
 * @param prop
 * @returns {boolean}
 */
export const hasProp = (obj, prop) => obj.hasOwnProperty(prop);

/**
 * @description Check if object has method
 * @param obj
 * @param method
 * @returns {boolean}
 */
export const hasMethod = (obj, method) => hasProp(obj, method) && isFunc(obj[method]);

/**
 * @description Check if object has key
 * @param obj
 * @param key
 * @returns {boolean}
 */
export const hasKey = (obj, key) => getKeys(obj)
  .indexOf(key) > -1;

/**
 * @description Get object keys
 * @param obj
 * @returns {Array}
 */
export const getKeys = obj => Object.keys(obj);

/**
 * @description Iterate over each key of an object
 * @param obj
 * @param callback
 */
export const eachKey = (obj, callback) => {
  Object.keys(obj)
    .forEach((key, index) => callback(key, obj[key], index));
};

/**
 * @description Linear iterator for object properties
 * @param obj
 * @param callback
 */
export const eachProp = (obj, callback) => {
  eachKey(obj, (key, prop, index) => callback(prop, key, index));
};

/**
 * @description To int
 * @param val
 * @returns {number}
 */
export const toInt = val => parseInt(val, 10);

/**
 * @description Extend
 * @param baseObject
 * @param restObjects
 * @returns {object}
 */
export const extend = (baseObject, ...restObjects) => {
  const assign = Object.assign;
  const modifiedObject = assign({}, baseObject);

  restObjects.map(obj => assign(modifiedObject, obj));
  return modifiedObject;
};

/**
 * @description Iterate recursively
 * @param handler
 * @param complete
 * @param index
 * @returns {*}
 */
export const recurIter = (handler, complete, index = 0) => {
  handler(canRecur => {
    if (!canRecur) {
      return complete();
    }
    recurIter(handler, complete, ++index);
  }, index);
};

/**
 * @description Poll over an interval of time
 * @param handler
 * @param complete
 * @param interval
 */
export const poll = (handler, complete, interval) => {
  setTimeout(() => {
    handler((canPoll) => {
      if (canPoll) {
        return poll(handler, complete, interval);
      }
      complete();
    });
  }, interval);
};

/**
 * @description Buffer high-frequency events
 * @returns {function(*=, *=, *=)}
 */
export const buffer = function ({ timeout, id }) {
  let timers = {};

  return callback => {
    if (!id) {
      timers[id] = '0';
    }
    if (timers[id]) {
      clearTimeout(timers[id]);
    }
    timers[id] = setTimeout(callback, timeout);
  };
};

/**
 * @description Persistent storage API
 * @param key
 * @returns {*}
 */
export const persistentStore = function (key) {
  let storage;
  if (!isStr(key)) {
    return new Error('[Storage] Invalid storage key. Provide a key {string}.');
  }

  const storageTemplates = {
    localStorage: {
      getStorage: function () {
        return localStorage;
      },
      setStorageItem: function (key, value) {
        this.getStorage()
          .setItem(key, value);
      },
      getStorageItem: function (key) {
        return this.getStorage()
          .getItem(key);
      },
      removeStorageItem: function (key) {
        this.getStorage()
          .removeItem(key);
      }
    }
  };
  storage = storageTemplates.localStorage;

  const decodeData = function (data) {
    return JSON.parse(data);
  };
  const encodeData = function (data) {
    return JSON.stringify(data);
  };
  const getData = function (key) {
    return decodeData(storage.getStorageItem(key));
  };
  const setData = function (key, data) {
    storage.setStorageItem(key, encodeData(data));
  };
  const removeData = function (key) {
    storage.removeStorageItem(key);
  };

  return {
    getData: function () {
      let data = getData(key);
      return data !== null ? getData(key) : undefined;
    },
    setData: function (newData) {
      setData(key, newData);
      return this;
    },
    removeData: function () {
      removeData(key);
      return this;
    },
    getItem: function (itemKey) {
      let data = this.getData();
      return data[itemKey];
    },
    setItem: function (itemKey, itemValue) {
      let data = this.getData();
      data[itemKey] = itemValue;
      setData(key, data);
      return this;
    },
    removeItem: function (itemKey) {
      let data = this.getData();
      data[itemKey] = undefined;
      setData(key, data);
      return this;
    }
  };
};

/**
 * @description Create sequential execution for async functions using recursion
 * @returns {{chain: chain, execute: execute}}
 */
export const sequence = function () {
  const chained = [];
  let value;
  let error;

  const chain = function (func) {
    if (chained) {
      chained.push(func);
    }
    return this;
  };
  const execute = function (index = 0) {
    let callback;
    if (!chained || index >= chained.length) {
      return true;
    }

    callback = chained[index];
    callback({
      resolve(_value) {
        value = _value;
        execute(++index);
      },
      reject(_error) {
        error = _error;
        execute(++index);
      },
      response: {
        value: value,
        error: error
      }
    });
  };

  return {
    chain,
    execute
  };
};

/**
 * @description Set strong typed object using object proxies and traps
 * @param config
 * @returns {*}
 */
export const setStrongTypedObject = config => {
  const proxy = {};
  eachProp(config, (prop, key) => proxy[key] = prop.value);

  return new Proxy(proxy, {
    get(target, prop) {
      return target[prop];
    },
    set(target, prop, value) {
      const type = config[prop].type;
      const typeChecker = determineTypeChecker(type);

      if (!typeChecker(value)) {
        throw new Error(`[Ammo.StrongType] Invalid type. Expected type for field {${prop}} is {${type}}`);
      }

      target[prop] = value;
      return true;
    }
  });
};

/**
 * @description Filter object data
 * @param objectData
 * @param requiredKeys
 */
export const filterObjectData = (objectData, requiredKeys) => {
  const filteredObject = {};
  eachKey(objectData, (key, value) => {
    if (requiredKeys.indexOf(key) === -1) {
      return false;
    }
    filteredObject[key] = value;
  });
  return filteredObject;
};

/**
 * @description Filter array of objects data
 * @param arrayData
 * @param requiredKeys
 */
export const filterArrayOfObjectsData = (arrayData, requiredKeys) => {
  return arrayData.reduce((accumulator, item) => {
    const filteredObject = filterObjectData(item, requiredKeys);
    accumulator.push(filteredObject);
    return accumulator;
  }, []);
};

/**
 * @description Pluck object data to array
 * @param objectData
 * @param requiredKey
 */
export const pluckObject = (objectData, requiredKey) => {
  const filteredArray = [];
  eachKey(objectData, (key, value) => {
    if (requiredKey !== key) {
      return false;
    }
    filteredArray.push(value);
  });
  return filteredArray;
};

/**
 * @description Pluck array of objects data to array
 * @param arrayData
 * @param requiredKey
 */
export const pluckArrayOfObjects = (arrayData, requiredKey) => {
  return arrayData.reduce((accumulator, item) => {
    const filteredArray = pluckObject(item, requiredKey);
    accumulator = [...accumulator, ...filteredArray];
    return accumulator;
  }, []);
};

/**
 * @description Reactive ajax
 * @param options
 */
export function reactiveAjax(options) {
  const assign = Object.assign;
  const originalOptions = assign({}, options);
  let modifiedOptions = assign({}, originalOptions);
  const ajax = options.ajax;
  let isRequestFulfilled = false;
  let isRequestAborted = false;
  let request;
  const requestTime = {
    start: -1,
    end: -1,
    duration: -1
  };

  /**
   * @description Get request time
   * @returns {number}
   */
  const getRequestTime = () => requestTime.end - requestTime.start;

  /**
   * @description Get request elapsed time
   * @returns {number}
   */
  const getRequestElapsedTime = () => new Date().getTime() - requestTime.start;

  /**
   * @description Get request duration
   * @returns {number}
   */
  const getRequestDuration = () => requestTime.duration = requestTime.end - requestTime.start;

  /**
   * @description Get request end time
   */
  const getRequestEndTime = () => requestTime.end = new Date().getTime();

  /**
   * @description Normalize callback
   */
  const normalizeCallback = () => {
    modifiedOptions = assign(modifiedOptions, {
      callback(err, res) {
        getRequestEndTime();
        getRequestDuration();
        if (isRequestAborted) {
          return false;
        }
        isRequestFulfilled = true;
        if (err) {
          return options.callback(err);
        }
        originalOptions.callback(undefined, res);
      }
    });
  };

  normalizeCallback();

  return {
    /**
     * @@description Extract
     * @param filters
     */
    extract(filters) {
      options.callback = (err, res) => {
        getRequestEndTime();
        getRequestDuration();
        let filteredData;
        if (isRequestAborted) {
          return false;
        }
        isRequestFulfilled = true;
        if (err) {
          return options.callback(err);
        }

        if (isObj(res)) {
          filteredData = filterObjectData(res, filters);
        } else if (isArr(res) && isObj(res[0])) {
          filteredData = filterArrayOfObjectsData(res, filters);
        }

        originalOptions.callback(undefined, filteredData);
      };
      modifiedOptions = assign({}, options);
      return this;
    },
    /**
     * @description Filter
     * @param handler
     * @returns {filter}
     */
    filter(handler = (item, index) => {
    }) {
      options.callback = (err, res) => {
        getRequestEndTime();
        getRequestDuration();
        let filteredData;
        if (isRequestAborted) {
          return false;
        }
        isRequestFulfilled = true;
        if (err) {
          return options.callback(err);
        }

        if (isArr(res)) {
          filteredData = res.filter(handler);
        }

        originalOptions.callback(undefined, filteredData);
      };
      modifiedOptions = assign({}, options);
      return this;
    },
    /**
     * @description Pluck
     * @param filterKey
     */
    pluck(filterKey) {
      options.callback = (err, res) => {
        getRequestEndTime();
        getRequestDuration();
        let filteredData;
        if (isRequestAborted) {
          return false;
        }
        isRequestFulfilled = true;
        if (err) {
          return options.callback(err);
        }

        if (isObj(res)) {
          filteredData = pluckObject(res, filterKey);
        } else if (isArr(res) && isObj(res[0])) {
          filteredData = pluckArrayOfObjects(res, filterKey);
        }

        originalOptions.callback(undefined, filteredData);
      };
      modifiedOptions = assign({}, options);
      return this;
    },
    /**
     * @description Watch
     * @param handler
     * @param complete
     * @param interval
     */
    watch(handler, complete = options => {
    }, interval = 100) {
      const watcher = poll({
        interval,
        complete: () => complete({ isRequestFulfilled, isRequestAborted, requestTime })
      });
      watcher(resolve => {
        handler(resolve, { isRequestFulfilled, getRequestElapsedTime }, function abort() {
          if (isRequestFulfilled) {
            return false;
          }
          isRequestAborted = true;
          request.abort();
          requestTime.end = new Date().getTime();
          resolve(false);
        });
      });
      return this;
    },
    /**
     * @description Run
     */
    run() {
      requestTime.start = new Date().getTime();
      request = ajax(modifiedOptions);
      return this;
    },
  };
}


/**
 * @description Determine type checker
 * @param type
 * @returns {*}
 */
export const determineTypeChecker = type => {
  switch (type) {
    case 'number':
      return isNum;
    case 'object':
      return isObj;
    case 'null':
      return isNull;
    case 'function':
      return isFunc;
    case 'array':
      return isArr;
    case 'string':
      return isStr;
    case 'bool':
    case 'boolean':
      return isBool;

    case 'undefined':
    default:
      return isUndef;
  }
};

/**
 * @description Scroll spy
 * @returns {*}
 */
export const scrollSpy = () => {
  let didScroll = false;
  const docElem = document.documentElement;
  const options = {
    offset: 0,
    onScroll: () => {
    },
    onBefore: () => {
    },
    onAfter: () => {
    }
  };

  const scrollY = () => window.pageYOffset || docElem.scrollTop;

  const bottomReached = () => $(window)
    .scrollTop() + window.innerHeight === $(document)
    .height();

  const handleScroll = () => {
    const scrollVerticalOffset = scrollY();
    const isBottomReached = bottomReached();

    options.onScroll({ scrollVerticalOffset, isBottomReached });

    if (scrollVerticalOffset < options.offset) {
      options.onBefore();
    } else {
      options.onAfter();
    }

    didScroll = false;
  };

  const scrollListener = () => {
    if (!didScroll) {
      setTimeout(handleScroll, 50);
      didScroll = true;
    }
  };

  const initScrollListener = () => {
    window.addEventListener('scroll', scrollListener, false);
  };

  const destroyScrollListener = () => {
    window.removeEventListener('scroll', scrollListener, false);
  };

  return {
    init({
           offset = 0, onScroll = () => {
      }, onBefore = () => {
      }, onAfter = () => {
      }, runCallbacksOnStartup = false
         } = {}) {
      options.offset = offset;
      options.onScroll = onScroll;
      options.onBefore = onBefore;
      options.onAfter = onAfter;

      if (runCallbacksOnStartup) {
        handleScroll();
      }

      initScrollListener();
      return this;
    },
    destroy() {
      destroyScrollListener();
      return this;
    }
  };
};

/**
 * @description Provide DOM context
 * Contx
 * @param context
 * @returns {*|HTMLDocument}
 */
const contx = (context) => {
  return context || window.document;
};

/**
 * @description Get node by given selector
 * @param selector
 * @param context
 * @returns {Node}
 */
const getEl = (selector, context) => contx(context)
  .querySelector(selector);


/**
 * @description Get node list by given selector
 * @param selector
 * @param context
 */
const getEls = (selector, context) => contx(context)
  .querySelectorAll(selector);

/**
 * @description Set style property for given node
 * @param selection
 * @param index
 * @param prop
 * @param value
 */
const style = (selection, prop, value, index) => {
  selection.style.setProperty(prop, isFunc(value) ? value(selection, index) || selection.style.getProperty(prop) : value, '');
};

/**
 * @description Set attribute property for given node
 * @param selection
 * @param prop
 * @param value
 * @param index
 */
const attr = (selection, prop, value, index) => {
  const currValue = selection.getAttribute(prop);
  selection.setAttribute(prop, isFunc(value) ? value(selection, currValue, index) || currValue : value);
};

/**
 * @description Set innerHTML for given node
 * @param selection
 * @param value
 * @param index
 */
const elText = (selection, value, index) => {
  selection.innerHTML = isFunc(value) ? value(selection.innerHTML, index) || selection.innerHTML : value;
};

/**
 * @description Filter nodes
 * @param selection
 * @param value
 * @param selector
 * @param index
 * @returns {*}
 */
const filterNodes = (selection, value, selector, index) => {
  if (isFunc(value)) {
    return value(selection, index);
  }
  if (isStr(value)) {
    if (value.indexOf(':') === -1) {
      return selection.classList.contains(value);
    }

    const matches = selection.parentNode.querySelectorAll(`${selector}${value}`);
    let isMatch = false;
    eachProp(matches, el => {
      if (el.isSameNode(selection) && !isMatch) {
        isMatch = true;
      }
    });
    return isMatch;
  }
};

/**
 * @description DOM manipulation API for single node
 * @param selector
 * @param context
 * @returns {object}
 */
export const select = function (selector, context) {
  let selection = isStr(selector) ? getEl(selector, context) : selector;

  return {
    find(findSelector) {
      selection = getEl(findSelector, selection);
      return this;
    },
    text(value) {
      elText(selection, value, 0);
      return this;
    },
    style(prop, value) {
      style(selection, prop, value, 0);
      return this;
    },
    attr(prop, value) {
      attr(selection, prop, value, 0);
      return this;
    },
    data(data) {
      selection.innerHTML = data;
      return this;
    },
    on(event, callback) {
      selection.addEventListener(event, callback);
      return this;
    },
    get: () => selection
  };
};


/**
 * @description DOM manipulation API for node lists
 * @param selector
 * @param context
 * @returns {object}
 */
export const selectAll = function (selector, context) {
  let selection = isStr(selector) ? getEls(selector, context) : selector;
  let filtered;

  return {
    filter(value) {
      filtered = [];
      eachProp(selection, (el, key, index) => {
        if (filterNodes(el, value, selector, index)) {
          filtered.push(el);
        }
      });
      selection = filtered;
      return this;
    },
    find(findSelector) {
      if (filtered) {
        filtered = getEls(findSelector, filtered.firstChild);
      } else {
        selection = getEls(findSelector, selection.firstChild);
      }
      return this;
    },
    text(value) {
      eachProp(filtered || selection, (el, key, index) => elText(el, value, index));
      return this;
    },
    style(prop, value) {
      eachProp(filtered || selection, (el, key, index) => style(el, prop, value, index));
      return this;
    },
    attr(prop, value) {
      eachProp(filtered || selection, (el, key, index) => attr(el, prop, value, index));
      return this;
    },
    data(data) {
      eachProp(filtered || selection, (el, key, index) => el.innerHTML = data[index]);
      return this;
    },
    on(event, callback) {
      eachProp(filtered || selection, (el) => el.addEventListener(event, callback));
      return this;
    },
    each(handler) {
      eachProp(filtered || selection, handler);
      return this;
    },
    eq(index) {
      const nodes = filtered || selection;
      return nodes.length > 0 && isObj(nodes[index]) ? nodes[index] : undefined;
    },
    index(indexSelector) {
      let matchIndex = -1;
      eachProp(filtered || selection, (el, key, index) => {
        if (el.classList.contains(indexSelector) && matchIndex === -1) {
          matchIndex = index;
        }
      });
      return matchIndex;
    },
    async(handler, complete) {
      const sequencer = sequence();

      eachProp(filtered || selection, (el, key, index) => {
        sequencer.chain(seq => handler(seq.resolve, el, index));
      });

      if (isFunc(complete)) {
        sequencer.chain(() => complete());
      }

      sequencer.execute();
      return this;
    },
    get: () => filtered || selection
  };
};

/**
 * @description Is hovered
 * @param el
 * @returns {boolean}
 */
export const isHovered = el => el.parentElement.querySelector(':hover') === el;

/**
 * @description Get random integer between two numbers
 * @param min
 * @param max
 * @returns {*}
 */
export const randomInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * @description Extract nexted prop
 * @param obj
 * @param keysText
 * @returns {*}
 */
export const extractNestedProp = (obj, keysText) => {
  const keys = keysText.split('.');
  const keysLength = keys.length - 1;
  let keysIndex = 0;
  let isValidKey = true;
  let targetObj = Object.assign({}, obj);
  let targetProp;
  let nextTarget;

  if (keys.length > 0) {
    while (isValidKey) {
      nextTarget = targetObj[keys[keysIndex]];

      // ... check if final target is reached ...
      if (keysIndex === keysLength) {

        // ... extract target prop
        targetProp = !isUndef(nextTarget) && !isNull(nextTarget) ? nextTarget : undefined;
        break;
      }

      // ... check if next target is not an object ...
      if (!isObj(nextTarget)) {

        // ... cancel sequence
        isValidKey = false;
        break;
      }

      targetObj = nextTarget;
      keysIndex++;
    }
  }

  return targetProp;
};

/**
 * @description Sort by
 * @param items
 * @param keysText
 * @param propType
 * @param direction
 */
export const sortBy = (items, keysText, propType, direction) => {
  return items.sort((a, b) => {
    let aVal = isStr(keysText) ? extractNestedProp(a, keysText) : '';
    let bVal = isStr(keysText) ? extractNestedProp(b, keysText) : '';

    if (isUndef(aVal) || isNull(aVal)) {
      return direction === 'asc' ? -1 : 1;
    }

    if (isUndef(bVal) || isNull(bVal)) {
      return direction === 'asc' ? 1 : -1;
    }

    if (propType === 'string' || propType === 'email') {
      if (aVal.toLowerCase() > bVal.toLowerCase()) {
        return direction === 'asc' ? 1 : -1;
      }
      if (aVal.toLowerCase() < bVal.toLowerCase()) {
        return direction === 'asc' ? -1 : 1;
      }
      return 0;
    } else if (propType === 'number' || propType === 'integer' || propType === 'float') {
      if (aVal > bVal) {
        return direction === 'asc' ? 1 : -1;
      }
      if (aVal < bVal) {
        return direction === 'asc' ? -1 : 1;
      }
      return 0;
    } else if (propType === 'date') {
      return direction === 'asc'
        ? new Date(aVal) - new Date(bVal)
        : new Date(bVal) - new Date(aVal);
    } else if (propType === 'combo') {
      aVal = keysText.map(key => extractNestedProp(a, key))
        .join(' ');
      bVal = keysText.map(key => extractNestedProp(b, key))
        .join(' ');

      if (isUndef(aVal) || isNull(aVal)) {
        return direction === 'asc' ? -1 : 1;
      }

      if (isUndef(bVal) || isNull(bVal)) {
        return direction === 'asc' ? 1 : -1;
      }

      if (aVal.toLowerCase() > bVal.toLowerCase()) {
        return direction === 'asc' ? 1 : -1;
      }

      if (aVal.toLowerCase() < bVal.toLowerCase()) {
        return direction === 'asc' ? -1 : 1;
      }

      return 0;
    }
  });
};

/**
 * @description Shape
 * @param items
 * @returns {*}
 */
export const shape = items => {
  let shapeItems = [...items];

  return {
    fetch: () => shapeItems,
    fetchIndex(index) {
      return shapeItems[index];
    },
    filterByUnique(key) {
      shapeItems = filterByUnique(shapeItems, key);
      return this;
    },
    filterByDuplicate(key, length = 2) {
      shapeItems = filterByDuplicate(shapeItems, key, length);
      return this;
    },
    filterByProp(key, value) {
      shapeItems = shapeItems.filter(item => extractNestedProp(item, key) === value);
      return this;
    },
    sortBy({ key, type = 'string', direction = 'asc' }) {
      shapeItems = sortBy(shapeItems, key, type, direction);
      return this;
    },
    reduceTo(key, augmenter) {
      const hasAugmenter = isFunc(augmenter);

      shapeItems = shapeItems.reduce((accumulator, item) => {
        const prop = extractNestedProp(item, key);
        let augmentObj;

        if (isFunc(augmenter)) {
          augmentObj = augmenter(item, prop, key);
        }

        if (isArr(prop)) {
          let nextProp = prop;

          if (isObj(prop[0]) && hasAugmenter) {
            nextProp = prop.map(propItem => extend({}, propItem, isObj(augmentObj) ? augmentObj : {}))
          }
          return [...accumulator, ...nextProp];
        } else if (!isUndef(prop) && !isNull(prop)) {
          let nextProp = prop;

          if (isObj(prop) && hasAugmenter) {
            nextProp = extend({}, prop, isObj(augmentObj) ? augmentObj : {});
          }
          return [...accumulator, nextProp];
        }
        return accumulator;
      }, []);
      return this;
    }
  };
};

/**
 * @description Filter by unique
 * @param items
 * @param key
 * @returns {*}
 */
export const filterByUnique = (items, key) => items.reduce((accumulator, item) => {
  const itemProp = extractNestedProp(item, key);

  const isDuplicate = accumulator.filter(filteredItem => {
    const prop = extractNestedProp(filteredItem, key);
    return prop === itemProp;
  }).length > 0;

  if (isDuplicate) {
    return accumulator;
  }

  const modifiedItem = extend({}, item);
  accumulator.push(modifiedItem);
  return accumulator;
}, []);

/**
 * @description Filter by duplicate
 * @param items
 * @param key
 * @param duplicateLength
 * @returns {*}
 */
export const filterByDuplicate = (items, key, duplicateLength = 2) => items.filter(item => {
  const itemProp = extractNestedProp(item, key);
  const duplicatesCount = duplicateLength - 1;

  return items.filter(innerItem => {
    const prop = extractNestedProp(innerItem, key);
    return prop === itemProp;
  }).length > duplicatesCount;
});

/**
 * @description Titlize
 * @param text
 * @returns {string}
 */
export const titlize = text => `${text.charAt(0)
  .toUpperCase()}${text.slice(1)
  .toLowerCase()}`;

/**
 * @description Uid
 * @returns {string}
 */
export const uid = () => {
  let firstPart = (Math.random() * 46656) | 0;
  let secondPart = (Math.random() * 46656) | 0;
  firstPart = (`000${firstPart.toString(36)}`.slice(-3));
  secondPart = `000${secondPart.toString(36)}`.slice(-3);
  return firstPart + secondPart;
};
