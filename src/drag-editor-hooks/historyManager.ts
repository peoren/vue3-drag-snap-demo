import { DomObject } from "../types";

/**
 * 枚举类型，定义了管理器支持的操作类型。
 */
export enum ManagerType {
  Add = 'add',
  Remove = 'remove',
  Move = 'move',
  AddGroup = 'addGroup',
  RemoveGroup = 'removeGroup',
  MoveGroup = 'moveGroup'
}

/**
 * 历史信息接口，用于存储撤销和重做操作所需的信息。
 */
export interface HistoryInfo {
  // 操作类型
  type: ManagerType;
  // 重做操作需要的数据，可能是DomObject或空字符串
  nextData?: DomObject | '';
  // 撤销操作需要的数据，可能是DomObject或空字符串
  prevData?: DomObject | '';
  // 影响单个元素时使用的索引
  index?: number;
  // 影响多个元素时使用的索引数组
  indexArr?: number[];
  // 重做操作需要的数据数组，可能是DomObject数组或空字符串
  nextDatas?: DomObject[] | '';
  // 撤销操作需要的数据数组，可能是DomObject数组或空字符串
  prevDatas?: DomObject[] | '';
}

/**
 * 历史管理器类，负责存储和管理撤销和重做操作的历史信息。
 */
export class HistoryManager {
  // 存储可以撤销的操作
  private undoStack: HistoryInfo[] = [];
  // 存储可以重做的操作
  private redoStack: HistoryInfo[] = [];

  /**
   * 添加操作到撤销栈，并清空重做栈。
   * @param {HistoryInfo} historyInfo - 要添加的操作信息。
   */
  public addAction(historyInfo: HistoryInfo) {
    console.log('%c ---> historyInfo: ', 'color:#F00;', historyInfo);
    this.undoStack.push(JSON.parse(JSON.stringify(historyInfo)));
    console.log('%c ---> undoStack: ', 'color:#F0F;', this.undoStack);
    this.redoStack = [];
  }

  /**
   * 执行撤销操作，将最近一次的操作从撤销栈移除并推送到重做栈。
   * @return {HistoryInfo | undefined} - 被撤销的操作信息，如果没有可撤销的操作则返回undefined。
   */
  public undo() {
    const historyInfo = this.undoStack.pop();
    if (!historyInfo) return;
    // undo logic (撤销逻辑)
    this.redoStack.push(historyInfo);
    return historyInfo;
  }

  /**
   * 执行重做操作，将最近一次的操作从重做栈移除并推送到撤销栈。
   * @return {HistoryInfo | undefined} - 被重做的操作信息，如果没有可重做的操作则返回undefined。
   */
  public redo() {
    const historyInfo = this.redoStack.pop();
    if (!historyInfo) return;
    // redo logic (重做逻辑)
    this.undoStack.push(historyInfo);
    return historyInfo;
  }
}
