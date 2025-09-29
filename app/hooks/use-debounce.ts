export function useDebounce(timer: number, callback: any) {
  let timeoutId: NodeJS.Timeout;

  return function(...args: any) {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      callback.apply(this, args)
    }, timer)
  }
}
