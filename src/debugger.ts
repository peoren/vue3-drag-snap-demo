export default class Debugger {
  private isDebug?: boolean

  constructor(isDebug?: boolean) {
    this.isDebug = isDebug
  }

  public log(...args: any[]) {
    if (!this.isDebug) {
      return
    }
    console.log('%c Editor Debugger:', 'padding: 1px; background: #4af; color: #fff;', ...args)
  }
}
