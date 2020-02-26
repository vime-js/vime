import { parse_start_time, parse_end_time } from '../url';

describe('utils', () => {
  describe('url', () => {
    const baseURL = 'https://www.youtube.com/watch?v=mN0zPOpADL4';

    describe('parse_start_time', () => {
      it('should parse start time param containing hms and return seconds', () => {
        const queryWithTimeParam = `${baseURL}?t=1h14m30s'`;
        const queryWithStartParam = `${baseURL}?start=1h14m30s'`;
        const result = 4470;
        expect(parse_start_time(queryWithTimeParam)).toBe(result);
        expect(parse_start_time(queryWithStartParam)).toBe(result);
      });

      it('should parse start time param containing ms and return seconds', () => {
        const queryWithTimeParam = `${baseURL}?t=14m30s'`;
        const queryWithStartParam = `${baseURL}?start=14m30s'`;
        const result = 870;
        expect(parse_start_time(queryWithTimeParam)).toBe(result);
        expect(parse_start_time(queryWithStartParam)).toBe(result);
      });

      it('should parse start time param containing s and return seconds', () => {
        const queryWithTimeParam = `${baseURL}?t=30s'`;
        const queryWithStartParam = `${baseURL}?start=30s'`;
        const result = 30;
        expect(parse_start_time(queryWithTimeParam)).toBe(result);
        expect(parse_start_time(queryWithStartParam)).toBe(result);
      });
    });

    describe('parse_end_time', () => {
      // parse_start_time tests validate that the time is properly extracted and calculated,
      // so we're only checking here if the end param is extracted correctly.
      it('should parse end time param and return seconds', () => {
        const queryWithEndParam = `${baseURL}?end=1h14m30s'`;
        const result = 4470;
        expect(parse_end_time(queryWithEndParam)).toBe(result);
      });
    });
  });
});
