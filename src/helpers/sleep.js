const sleep = (ms = 3000) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default sleep
