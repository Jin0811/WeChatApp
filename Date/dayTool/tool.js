// formatTime 传入参数 Date 返回：年 / 月 / 日

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  //const hour = date.getHours()
  // const minute = date.getMinutes()
  //const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') //+ ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
  // 条件运算符 条件表达式 ? 语句1:语句2
  // true则执行语句1，false则执行语句2 
}

module.exports = {
  formatTime: formatTime
}