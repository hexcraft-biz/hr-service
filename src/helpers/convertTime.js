import dayjs from 'dayjs'
import { isEmpty } from 'lodash'

export const toTimeString = (time, init = '') => {
  let result = init
  if (!isEmpty(time)) {
    result = new Date(time).toLocaleTimeString('zh-TW', {
      hour12: false,
      timeStyle: 'short',
    })
  }
  return result
}

export const toTimeObject = (string, init) => {
  let result = init
  if (!isEmpty(string)) {
    let date = new Date().toLocaleDateString('zh-TW', {
      dateStyle: 'short',
    })
    result = dayjs(`${date}T${string}`)
  }
  return result
}
