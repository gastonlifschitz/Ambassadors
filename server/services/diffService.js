const service = {};

/**
 * @return {Boolean}
 * @param {Array} arr1 - One of the arrays to be compared.
 * @param {Array} arr2 - The other array to be compared.
 * @param {Boolean} sortArrays - Sort the arrays before comparing them.
 */
const arraysEqual = (arr1, arr2, sortArrays = false) => {
  // If the position of the elements matter, ie [0, 1, 2] != [1, 0, 2] 
  // use pos_matters parameter. Since the sort is inplace, this is not recommended.

  if (arr1.length !== arr2.length)
    return false;

  if (sortArrays) {
    arr1.sort(); arr2.sort();
  }

  for (let i = arr1.length; i--;) {
    const difference = recursiveDifferences(arr1[i], arr2[i]);

    if (!isEmptyObject(difference))
      return false;  
  }
  return true;
};

const isEmptyObject = obj => {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }

  return true;
};

const recursiveDifferences = (leftObject, rightObject, options) => {
  const difference = { lhs: leftObject, rhs: rightObject };

  if (typeof(leftObject) !== typeof(rightObject)) 
    return difference;
  

  switch (typeof(leftObject)) {
  case 'object':
    if (Array.isArray(leftObject) && Array.isArray(rightObject)) {
      // It's an array so deal accordingly
      if (!arraysEqual(leftObject, rightObject, options.sortArrays)) 
        return difference;
    }
    else {
      // It's an object so deal accordingly;
      const ObjDiff = service.differences(leftObject, rightObject, options);
      if (!isEmptyObject(ObjDiff)) 
        return difference;
    }
    break;
  case 'undefined':
    // Deal Accordingly
    break;
  case 'symbol':
    // Deal Accordingly
    break;
  case 'function':
    // Deal Accordingly
    break;
          
    // In these three cases the response is the same
  case 'string':
  case 'number':
  case 'boolean':
    if (leftObject !== rightObject)
      return difference;
    break;
  }

  return {};
};

/**
 * @return {Object} Diff returns an object with the differences between the two objects passed as parameters.
 * in the form {..., property: {lhs: valueOfLhs, rhs: valueOfRhs}, ...}.
 * @param {Object} arr1 - One of the arrays to be compared.
 * @param {Object} arr2 - The other array to be compared.
 * @param {{sortArrays: boolean, ignoreProperties: Array<string>}} options - Object with custom properties.
 */
service.differences = (leftObject, rightObject, options = {}) => {
  // Set up the default options.

  if (!options.dealtWith) {
    options.sortArrays = options.sortArrays || false;
    options.ignoreProperties = options.ignoreProperties || [];
    options.dealtWith = true;
  }

  const differences = {};

  // Builds a set out the keys of both objects
  const leftObjectKeys = new Set(Object.keys(leftObject));
  const rightObjectKeys = new Set(Object.keys(rightObject));
  const keys = new Set([...leftObjectKeys, ...rightObjectKeys]);

  // Remove from keys the keys to be ignored
  if (options.ignoreProperties) {
    options.ignoreProperties.forEach(prop => {
      keys.delete(prop);
    });
  }

  for (const key of keys) {
    const leftVal = leftObject[key];
    const rightVal = rightObject[key];

    const diff = recursiveDifferences(leftVal, rightVal, options);
    if (!isEmptyObject(diff)) 
      differences[key] = diff;
  }

  return differences;
};


module.exports = service;

/*
differences =     { name: { lhs: 'my object', rhs: 'updated object' },
      details: { with: { lhs: [Array], rhs: [Array] } },
      contact: { lhs: '0800', rhs: undefined },
      gods:
       { lhs: [ 'Allah', 'God', 'Hov' ],
         rhs: [ 'Allah', 'Hov', 'God' ] } }

const lhs = {
    name: 'my object',
    age: 78,
    married: true,
    description: 'it\'s an object!',
    same_obj: {var1: 3, var2: "Hello"},
    details: {
      it: 'has',
      an: 'array',
      with: ['a', 'few', 'elements']
    },
    contact: 0800,
    gods: ["Allah", "God", "Hov"]
  };
  
  const rhs = {
    description: 'it\'s an object!',
    same_obj: {var1: 3, var2: "Hello"},
    age: 78,
    married: true,
    name: 'updated object',
    details: {
      it: 'has',
      an: 'array',
      with: ['a', 'few', 'more', 'elements', { than: 'before' } ]},
    gods: ["Allah", "Hov", "God"]
  };
  
  */
  
