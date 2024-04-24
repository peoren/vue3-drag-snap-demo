import {DomObject} from "../types";
export enum ManagerType {
  Add = 'add',
  Remove = 'remove',
  Move = 'move',
  AddGroup = 'addGroup',
  RemoveGroup = 'removeGroup',
  MoveGroup = 'moveGroup'
}

export interface HistoryInfo {
  type: ManagerType
  nextData?: DomObject | ''
  prevData?: DomObject | ''
  index?: number
  indexArr?: number[]
  nextDatas?: DomObject[]|''
  prevDatas?: DomObject[]|''
}

export class HistoryManager {
  private undoStack: HistoryInfo[] = []
  private redoStack: HistoryInfo[] = []

  public addAction(historyInfo: HistoryInfo) {
    console.log('%c ---> historyInfo: ', 'color:#F00;', historyInfo)
    this.undoStack.push(JSON.parse(JSON.stringify(historyInfo)))
    console.log('%c ---> undoStack: ', 'color:#F0F;', this.undoStack)
    this.redoStack = []
  }

  public undo() {
    const historyInfo = this.undoStack.pop()
    if (!historyInfo) return
    // undo logic
    this.redoStack.push(historyInfo)
    return historyInfo
  }

  public redo() {
    const historyInfo = this.redoStack.pop()
    if (!historyInfo) return
    // redo logic
    this.undoStack.push(historyInfo)
    return historyInfo
  }
}
