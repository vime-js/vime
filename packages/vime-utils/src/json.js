import { is_object } from './unit'

export function parse_json (json, onFail) {
  try {
    return JSON.parse(json)
  } catch (e) {
    if (onFail) onFail(e)
    return null
  }
}

export const is_json_or_obj = input => {
  if (!input) return false
  return is_object(input) || input.startsWith('{')
}

export const obj_or_parse_json = input => {
  if (is_object(input)) return input
  return parse_json(input)
}
