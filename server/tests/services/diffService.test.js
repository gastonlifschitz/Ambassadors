const diffService = require('../../services/diffService');
const prevObject = require('./jsons/prev_object.json');
const newObject = require('./jsons/new_object.json');

const lhs = {
  name: 'my object',
  age: 78,
  married: true,
  date: '2018-06-10T10:00:00.000Z',
  description: 'it\'s an object!',
  same_obj: { var1: 3, var2: 'Hello' },
  details: {
    it: 'has',
    an: 'array',
    with: ['a', 'few', 'elements']
  },
  same_array: [1, 2, { var: 'prop' }],
  contact: '0800',
  gods: ['Allah', 'God', 'Hov']
};

const rhs = {
  description: 'it\'s an object!',
  same_obj: { var1: 3, var2: 'Hello' },
  age: 78,
  married: true,
  date: '2018-06-11T10:00:00.000Z',
  name: 'updated object',
  same_array: [1, 2, { var: 'prop' }],
  details: {
    it: 'has',
    an: 'array',
    with: ['a', 'few', 'more', 'elements', { than: 'before' }] },
  gods: ['Allah', 'Hov', 'God']
};

describe('diff between objects like the real ones', () => {
  const differences = diffService.differences(prevObject, newObject, { sortArrays: true, ignoreProperties: ['_id'] });

  it('Should have only one property: date', () => {
    const propertiesCount = Object.keys(differences).length;
    expect(propertiesCount).toBe(1);
    expect(differences.hasOwnProperty('date')).toBe(true);
  });
});

describe('diff between objects Service', () => {
  const difference = diffService.differences(lhs, rhs, { sortArrays: false });
  
  it('number of properties should be 5', () => {
    const propertiesCount = Object.keys(difference).length;
    expect(propertiesCount).toBe(5);
  });

  it('number of properties should be 4 if sort array is true', () => {
    const diff = diffService.differences(lhs, rhs, { sortArrays: true });
    const propertiesCount = Object.keys(diff).length;
    expect(propertiesCount).toBe(4);
  });

  it('number of properties should be 2 if name and date are to be ignored', () => {
    const options = { sortArrays: false, ignoreProperties: ['name', 'date'] };
    const diff = diffService.differences(lhs, rhs, options);
    const propertiesCount = Object.keys(diff).length;
    expect(propertiesCount).toBe(2);
  });

  it('should have a details property with different objects', () => {
    expect(difference.hasOwnProperty('details')).toBe(true);
  });

  it('should NOT have a same_array property', () => {
    expect(difference.hasOwnProperty('same_array')).toBe(false);
  });
});

