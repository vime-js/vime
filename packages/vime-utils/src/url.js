import { element } from 'svelte/internal'
import { IS_CLIENT } from './support'
import { is_null, is_array, is_object } from './unit'

export const decode_uri_component = (component, fallback = '') => {
  if (!IS_CLIENT) return fallback
  try {
    return window.decodeURIComponent(component)
  } catch (e) {
    return fallback
  }
}

// eslint-disable-next-line max-len
// @see https://github.com/ampproject/amphtml/blob/c7c46cec71bac92f5c5da31dcc6366c18577f566/src/url-parse-query-string.js#L31
const QUERY_STRING_REGEX = /(?:^[#?]?|&)([^=&]+)(?:=([^&]*))?/g
export const parse_query_string = qs => {
  const params = Object.create(null)
  if (!qs) return params
  let match
  while ((match = QUERY_STRING_REGEX.exec(qs))) {
    const name = decode_uri_component(match[1], match[1])
    const value = match[2]
      ? decode_uri_component(match[2].replace(/\+/g, ' '), match[2])
      : ''
    params[name] = value
  }
  return params
}

export const serialize_query_string = params => {
  const qs = []
  const appendQueryParam = (param, v) => {
    qs.push(`${encodeURIComponent(param)}=${encodeURIComponent(v)}`)
  }
  Object.keys(params).forEach(param => {
    const value = params[param]
    if (is_null(value)) return
    if (is_array(value)) {
      value.forEach(v => appendQueryParam(param, v))
    } else {
      appendQueryParam(param, value)
    }
  })
  return qs.join('&')
}

export const apppend_querystring_to_url = (url, qs) => {
  if (!qs) return url
  const mainAndQuery = url.split('?', 2)
  return mainAndQuery[0] + (mainAndQuery[1] ? `?${mainAndQuery[1]}&${qs}` : `?${qs}`)
}

export const add_params_to_url = (url, params) => {
  return apppend_querystring_to_url(url, serialize_query_string(params))
}

export const prefetch = (rel, url, as) => {
  if (!IS_CLIENT) return false
  const link = element('link')
  link.rel = rel
  link.href = url
  if (as) link.as = as
  link.crossorigin = true
  document.head.append(link)
  return true
}

// Does not handle relative URL's.
export const parse_url = url => {
  if (!IS_CLIENT) return {}
  const parser = element('a')
  parser.href = url
  // Handle chrome which will default to domain where script is called from if invalid.
  return url.indexOf(parser.hostname) !== -1 ? parser : ''
}

const START_TIMESTAMP = /(\d+)(h|m|s)/g
const parse_time_string = stamp => {
  let seconds = 0
  let array = START_TIMESTAMP.exec(stamp)
  while (array !== null) {
    const [, count, period] = array
    if (period === 'h') seconds += parseInt(count, 10) * 60 * 60
    if (period === 'm') seconds += parseInt(count, 10) * 60
    if (period === 's') seconds += parseInt(count, 10)
    array = START_TIMESTAMP.exec(stamp)
  }
  return seconds
}

const NUMERIC = /^\d+$/
// Parse URL for a start time param, ie ?t=1h14m30s and return the start time in seconds
const parse_time_param = (url, pattern) => {
  const match = url.match(pattern)
  if (match) {
    const stamp = match[1]
    if (stamp.match(START_TIMESTAMP)) return parse_time_string(stamp)
    if (NUMERIC.test(stamp)) return parseInt(stamp)
  }
  return undefined
}

const START_TIME_QUERY = /[?&#](?:start|t)=([0-9hms]+)/
export const parse_start_time = url => parse_time_param(url, START_TIME_QUERY)

const END_TIME_QUERY = /[?&#]end=([0-9hms]+)/
export const parse_end_time = url => parse_time_param(url, END_TIME_QUERY)
