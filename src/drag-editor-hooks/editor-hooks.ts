// -----------------------undo-----------------------------
import {HistoryInfo, ManagerType} from "./historyManager";
import {DomObject} from "../types";

export const editorUndo = (cubes: [], historyInfo: HistoryInfo): DomObject[] | [] => {
  try {
    switch (historyInfo.type) {
      case ManagerType.Add:
        return undoAdd(cubes, historyInfo)

      case ManagerType.AddGroup:
        return undoAddGroup(cubes, historyInfo)

      case ManagerType.Remove:
        return undoRemove(cubes, historyInfo)
      case ManagerType.RemoveGroup:
        return undoRemoveGroup(cubes, historyInfo)

      case ManagerType.Move:
        return undoMove(cubes, historyInfo)

      case ManagerType.MoveGroup:
        return undoMoveGroup(cubes, historyInfo)
    }
    return []
  } catch (e) {
    console.log(e)
    return []
  }
}
const undoMove = (cubes: DomObject[], historyInfo: HistoryInfo): DomObject[] | [] => {
  const { prevData, index } = historyInfo
  if (!prevData || index === undefined) {
    return cubes
  }
  cubes[index] = <DomObject>prevData
  return cubes
}
const undoMoveGroup = (cubes: DomObject[], historyInfo: HistoryInfo): DomObject[] | [] => {
  const { prevDatas, indexArr } = historyInfo
  if (!prevDatas || !indexArr) {
    return cubes
  }
  indexArr?.forEach((index, idx) => {
    cubes[index] = <DomObject>prevDatas[idx]
  })
  return cubes
}
const undoAdd = (cubes: DomObject[], historyInfo: HistoryInfo): DomObject[] | [] => {
  const { index } = historyInfo
  if (index === undefined) {
    return cubes
  }
  cubes.splice(index, 1)
  return cubes
}
const undoAddGroup = (cubes: DomObject[], historyInfo: HistoryInfo): DomObject[] | [] => {
  const { indexArr } = historyInfo
  if (!indexArr) return cubes
  indexArr.forEach(index => {
    cubes.splice(index, 1)
  })
  return cubes
}
const undoRemove = (cubes: DomObject[] | [], historyInfo: HistoryInfo): DomObject[] | [] => {
  const { prevData, index } = historyInfo
  if (!prevData || index === undefined) {
    return cubes
  }
  cubes.splice(index, 0, <DomObject>prevData)
  return cubes
}
const undoRemoveGroup = (cubes: DomObject[], historyInfo: HistoryInfo): DomObject[] | [] => {
  const { indexArr, prevDatas } = historyInfo
  if (!indexArr || !prevDatas) return cubes
  indexArr.forEach((index, idx) => {
    cubes.splice(index, 0, prevDatas[idx])
  })
  return cubes
}

// -----------------------redo-----------------------------
export const editorRedo = (cubes: DomObject[], historyInfo: HistoryInfo): DomObject[] | [] => {
  switch (historyInfo.type) {
    case ManagerType.Add:
      return redoAdd(cubes, historyInfo)

    case ManagerType.AddGroup:
      return redoAddGroup(cubes, historyInfo)

    case ManagerType.Remove:
      return redoRemove(cubes, historyInfo)

    case ManagerType.RemoveGroup:
      return redoRemoveGroup(cubes, historyInfo)

    case ManagerType.Move:
      return redoMove(cubes, historyInfo)

    case ManagerType.MoveGroup:
      return redoMoveGroup(cubes, historyInfo)
  }
  return []
}
const redoMoveGroup = (cubes: DomObject[], historyInfo: HistoryInfo): DomObject[] | [] => {
  const { nextDatas, indexArr } = historyInfo
  if (!nextDatas || !indexArr) {
    return cubes
  }
  indexArr?.forEach((index, idx) => {
    cubes[index] = <DomObject>nextDatas[idx]
  })
  return cubes
}
const redoMove = (cubes: DomObject[], historyInfo: HistoryInfo) => {
  const { nextData, index } = historyInfo
  if (!nextData || index === undefined) {
    return cubes
  }
  cubes[index] = <DomObject>nextData
  return cubes
}
const redoAdd = (cubes: DomObject[], historyInfo: HistoryInfo) => {
  const { nextData, index } = historyInfo
  if (!nextData || index === undefined) {
    return cubes
  }
  cubes.splice(index, 0, <DomObject>nextData)
  return cubes
}
const redoAddGroup = (cubes: DomObject[], historyInfo: HistoryInfo): DomObject[] | [] => {
  const { indexArr, nextDatas } = historyInfo
  if (!indexArr || !nextDatas) return cubes
  indexArr.forEach((index, idx) => {
    cubes.splice(index, 0, nextDatas[idx])
  })
  return cubes
}

const redoRemove = (cubes: DomObject[], historyInfo: HistoryInfo) => {
  const { index } = historyInfo
  if (index === undefined) {
    return cubes
  }
  cubes.splice(index, 1)
  return cubes
}
const redoRemoveGroup = (cubes: DomObject[], historyInfo: HistoryInfo): DomObject[] | [] => {
  const { indexArr } = historyInfo
  if (!indexArr) return cubes
  indexArr.forEach(index => {
    cubes.splice(index, 1)
  })
  return cubes
}
export const UseEditorHooks = () => {
  return {
    undo: editorUndo,
    redo: editorRedo
  }
}
