import {grey, green, blue, red, orange} from '@ant-design/colors'
import dayjs from 'dayjs'

export const THREADS_LIST = [
  {label: 'Thông Báo', value: 'THÔNG BÁO'},
  {label: 'Quyết Định', value: 'QUYẾT ĐỊNH'},
  {label: 'Công Đoàn Phí', value: 'CÔNG ĐOÀN PHÍ'},
  {label: 'Tuyển Dụng', value: 'TUYỂN DỤNG'},
  {label: 'Sổ Tay', value: 'SỔ TAY'}
]

export const nonAccentVietnamese = (str: string) => {
  str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, 'A')
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, 'E')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/I|Í|Ì|Ĩ|Ị/g, 'I')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, 'O')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, 'U')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, 'Y')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/Đ/g, 'D')
  str = str.replace(/đ/g, 'd')
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, '') // Â, Ê, Ă, Ơ, Ư
  return str
}

export const convertSlug = (str: string) => {
  str = nonAccentVietnamese(str)
  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  const from =
    'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;'
  const to =
    'AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------'
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes

  return str
}

export function colorMethod(
  method: 'POST' | 'PUT' | 'GET' | 'DELETE' | string
) {
  switch (method) {
    case 'POST':
      return green[6]
    case 'PUT':
      return orange[6]
    case 'GET':
      return blue[6]
    case 'DELETE':
      return red[6]
    default:
      return grey[10]
  }
}

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })
    .format(value)
    .replace(/\./g, ',')
}

export const validateDateOfBirth = (_, value) => {
  const date = dayjs(value)
  const today = dayjs()
  const age = today.diff(date, 'year')
  if (!date.isValid() || age < 18) {
    return Promise.reject(new Error('Bạn phải đủ 18 tuổi trở lên'))
  }
  return Promise.resolve()
}

// Hàm disable ngày không hợp lệ
export const disabledDateBirthday = (current) => {
  // Ngày phải lớn hơn hoặc bằng năm 1900
  const minDate = dayjs().year(1900).startOf('year')

  // Disable ngày sau hôm nay và ngày sẽ làm người dùng dưới 18 tuổi
  return (
    current &&
    (current < minDate ||
      current > dayjs().endOf('day') ||
      current > dayjs().subtract(18, 'year'))
  )
}

// Hàm disable ngày lớn hơn ngày hiện tại
export const disabledDate = (current) => {
  // Ngày bắt đầu của năm 1900
  const minDate = dayjs().year(1900).startOf('year')

  // Disable ngày trước năm 1900 và ngày sau hôm nay
  return current && (current < minDate || current > dayjs().endOf('day'))
}

// Hàm disable tháng và năm không hợp lệ của công đoàn phí
export const disabledMonthYear = (current) => {
  if (!current) return false

  const today = dayjs()
  const currentMonth = current.month()
  const currentYear = current.year()

  const todayMonth = today.month()
  const todayYear = today.year()

  // Disable các tháng và năm sau tháng và năm hiện tại
  return (
    currentYear < 1900 ||
    currentYear > todayYear ||
    (currentYear === todayYear && currentMonth > todayMonth)
  )
}
