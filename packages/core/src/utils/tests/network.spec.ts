import {
  appendParamsToURL,
  decodeJSON, decodeQueryString,
  isObjOrJSON,
  objOrParseJSON,
  parseQueryString, preconnect,
  serializeQueryString,
  tryDecodeURIComponent,
  tryParseJSON,
} from '../network';

describe('tryParseJSON', () => {
  it('should return obj given valid JSON', () => {
    const expectedResult = { a: 'apples', b: 'bees', c: 'chicken' };
    const result = tryParseJSON(JSON.stringify(expectedResult));
    expect(result).toEqual(expectedResult);
  });

  it('should return undefined given invalid JSON', () => {
    const result = tryParseJSON('invalid json');
    expect(result).toBeUndefined();
  });
});

describe('isObjOrJSON', () => {
  it('should return true given an object', () => {
    expect(isObjOrJSON({})).toBeTruthy();
  });

  it('should return true given JSON', () => {
    expect(isObjOrJSON(JSON.stringify({ a: 'apples' }))).toBeTruthy();
  });

  it('should return false given non-object', () => {
    expect(isObjOrJSON(null)).toBeFalsy();
    expect(isObjOrJSON(undefined)).toBeFalsy();
    expect(isObjOrJSON('')).toBeFalsy();
    expect(isObjOrJSON(true)).toBeFalsy();
    expect(isObjOrJSON(0)).toBeFalsy();
  });
});

describe('objOrParseJSON', () => {
  it('should return immediately given an object', () => {
    const expectedResult = { a: 'apples', b: 'bees' };
    expect(objOrParseJSON(expectedResult)).toBe(expectedResult);
  });

  it('should return obj given JSON', () => {
    const expectedResult = { a: 'apples', b: 'bees' };
    expect(objOrParseJSON(JSON.stringify(expectedResult))).toEqual(expectedResult);
  });

  it('should return undefined given non-object or JSON', () => {
    expect(objOrParseJSON(null)).toBeUndefined();
    expect(objOrParseJSON(undefined)).toBeUndefined();
    expect(objOrParseJSON('')).toBeUndefined();
    expect(objOrParseJSON(true)).toBeUndefined();
    expect(objOrParseJSON(0)).toBeUndefined();
  });
});

describe('decodeJSON', () => {
  it('should return object given valid JSON', () => {
    const expectedResult = { a: 'apples', b: 'bees' };
    expect(decodeJSON(JSON.stringify(expectedResult))).toEqual(expectedResult);
  });

  it('should return undefined given invalid JSON', () => {
    expect(decodeJSON('invalid json')).toBeUndefined();
  });
});

describe('tryDecodeURIComponent', () => {
  it('should return decoded component given valid component', () => {
    window.decodeURIComponent = decodeURIComponent;
    expect(tryDecodeURIComponent('apple%40bees.com')).toEqual('apple@bees.com');
  });

  it('should return fallback given window is undefined', () => {
    expect(tryDecodeURIComponent('', 'apples')).toEqual('apples');
  });
});

describe('parseQueryString', () => {
  it('should return valid key/value map given query string', () => {
    expect(parseQueryString('apples=1&apples=2&bees=wombo')).toEqual({
      apples: ['1', '2'],
      bees: 'wombo',
    });
  });

  it('should return empty object given undefined', () => {
    expect(parseQueryString(undefined)).toEqual({});
  });
});

describe('serializeQueryString', () => {
  it('should serialize object into query string', () => {
    expect(serializeQueryString({
      apples: ['1', '2'],
      bees: 'wombo',
      chicken: null as any,
      dips: undefined as any,
    })).toEqual('apples=1&apples=2&bees=wombo');
  });
});

describe('prefetch', () => {
  it('should append link to document head', () => {
    preconnect('https://example.com');
    const link = document.head.firstChild as HTMLLinkElement;
    expect(link?.rel).toEqual('preconnect');
    expect(link?.crossOrigin).toEqual('true');
    expect(link?.href).toEqual('https://example.com/');
  });
});

describe('appendParamsToURL', () => {
  it('should append params as query string to url', () => {
    expect(appendParamsToURL('https://example.com', {
      apples: ['1', '2'],
      bees: 'wombo',
    })).toEqual('https://example.com?apples=1&apples=2&bees=wombo');
  });

  it('should return url given empty params', () => {
    expect(appendParamsToURL('https://apples.com', {})).toEqual('https://apples.com');
  });

  it('should append params successfully given url already has query string', () => {
    expect(appendParamsToURL('https://example.com?chicken=3', {
      apples: ['1', '2'],
      bees: 'wombo',
    })).toEqual('https://example.com?chicken=3&apples=1&apples=2&bees=wombo');
  });
});

describe('decodeQueryString', () => {
  it('should return object given query string', () => {
    expect(decodeQueryString('apples=1&apples=2&bees=wombo')).toEqual({
      apples: ['1', '2'],
      bees: 'wombo',
    });
  });
});
