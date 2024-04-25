export default class ZIndexManager {
  private zIndexArr: number[] = []
  private MaxZIndex: number = 1
  private MinZIndex: number = 1

  constructor(private defaultZIndex = 1) {
    this.defaultZIndex = defaultZIndex
  }

  addZIndex(zIndex: number) {
    if (zIndex > this.MaxZIndex) {
      this.MaxZIndex = zIndex
    } else if (zIndex < this.MinZIndex) {
      this.MinZIndex = zIndex
    }
    this.zIndexArr.push(zIndex)
  }

  getMaxZIndex() {
    return this.MaxZIndex
  }

  getMinZIndex() {
    return this.MinZIndex
  }
}
