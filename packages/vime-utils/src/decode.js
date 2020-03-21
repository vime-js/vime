import { is_string } from './unit';
import { is_json_or_obj, obj_or_try_parse_json } from './json';
import { parse_query_string } from './url';

export const decode_json = (data) => is_json_or_obj(data) && obj_or_try_parse_json(data);
export const decode_query_string = (data) => is_string(data) && parse_query_string(data);
