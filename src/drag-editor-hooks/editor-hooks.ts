// -----------------------undo-----------------------------

/**
 * 执行撤销操作的函数，根据历史记录信息来撤销特定的操作。
 * @param {DomObject[]} cubes - 当前的立方体数组。
 * @param {HistoryInfo} historyInfo - 包含操作类型和历史数据的信息。
 * @return {DomObject[] | []} - 操作后的立方体数组或空数组。
 */
import {HistoryInfo, ManagerType} from "./historyManager";
import {DomObject} from "../types";

export const editorUndo = (cubes: [], historyInfo: HistoryInfo): DomObject[] | [] => {
    try {
        switch (historyInfo.type) {
            case ManagerType.Add:
                return undoAdd(cubes, historyInfo);

            case ManagerType.AddGroup:
                return undoAddGroup(cubes, historyInfo);

            case ManagerType.Remove:
                return undoRemove(cubes, historyInfo);
            case ManagerType.RemoveGroup:
                return undoRemoveGroup(cubes, historyInfo);

            case ManagerType.Move:
                return undoMove(cubes, historyInfo);

            case ManagerType.MoveGroup:
                return undoMoveGroup(cubes, historyInfo);
        }
        return [];
    } catch (e) {
        console.log(e);
        return [];
    }
};

/**
 * 撤销移动单个立方体的操作。
 * @param {DomObject[]} cubes - 当前的立方体数组。
 * @param {HistoryInfo} historyInfo - 包含移动操作的历史信息。
 * @return {DomObject[] | []} - 操作后的立方体数组或空数组。
 */
const undoMove = (cubes: DomObject[], historyInfo: HistoryInfo): DomObject[] | [] => {
    const {prevData, index} = historyInfo;
    if (!prevData || index === undefined) {
        return cubes;
    }
    cubes[index] = <DomObject>prevData;
    return cubes;
};

/**
 * 撤销移动一组立方体的操作。
 * @param {DomObject[]} cubes - 当前的立方体数组。
 * @param {HistoryInfo} historyInfo - 包含移动操作的历史信息。
 * @return {DomObject[] | []} - 操作后的立方体数组或空数组。
 */
const undoMoveGroup = (cubes: DomObject[], historyInfo: HistoryInfo): DomObject[] | [] => {
    const {prevDatas, indexArr} = historyInfo;
    if (!prevDatas || !indexArr) {
        return cubes;
    }
    indexArr?.forEach((index, idx) => {
        cubes[index] = <DomObject>prevDatas[idx];
    });
    return cubes;
};

/**
 * 撤销添加单个立方体的操作。
 * @param {DomObject[]} cubes - 当前的立方体数组。
 * @param {HistoryInfo} historyInfo - 包含添加操作的历史信息。
 * @return {DomObject[] | []} - 操作后的立方体数组或空数组。
 */
const undoAdd = (cubes: DomObject[], historyInfo: HistoryInfo): DomObject[] | [] => {
    const {index} = historyInfo;
    if (index === undefined) {
        return cubes;
    }
    cubes.splice(index, 1);
    return cubes;
};

/**
 * 撤销添加一组立方体的操作。
 * @param {DomObject[]} cubes - 当前的立方体数组。
 * @param {HistoryInfo} historyInfo - 包含添加操作的历史信息。
 * @return {DomObject[] | []} - 操作后的立方体数组或空数组。
 */
const undoAddGroup = (cubes: DomObject[], historyInfo: HistoryInfo): DomObject[] | [] => {
    const {indexArr} = historyInfo;
    if (!indexArr) return cubes;
    indexArr.forEach(index => {
        cubes.splice(index, 1);
    });
    return cubes;
};

/**
 * 撤销删除单个立方体的操作。
 * @param {DomObject[] | []} cubes - 当前的立方体数组。
 * @param {HistoryInfo} historyInfo - 包含删除操作的历史信息。
 * @return {DomObject[] | []} - 操作后的立方体数组或空数组。
 */
const undoRemove = (cubes: DomObject[] | [], historyInfo: HistoryInfo): DomObject[] | [] => {
    const {prevData, index} = historyInfo;
    if (!prevData || index === undefined) {
        return cubes;
    }
    cubes.splice(index, 0, <DomObject>prevData);
    return cubes;
};

/**
 * 撤销删除一组立方体的操作。
 * @param {DomObject[]} cubes - 当前的立方体数组。
 * @param {HistoryInfo} historyInfo - 包含删除操作的历史信息。
 * @return {DomObject[] | []} - 操作后的立方体数组或空数组。
 */
const undoRemoveGroup = (cubes: DomObject[], historyInfo: HistoryInfo): DomObject[] | [] => {
    const {indexArr, prevDatas} = historyInfo;
    if (!indexArr || !prevDatas) return cubes;
    indexArr.forEach((index, idx) => {
        cubes.splice(index, 0, prevDatas[idx]);
    });
    return cubes;
};

// -----------------------redo-----------------------------

/**
 * 执行重做操作的函数，根据历史记录信息来重做特定的操作。
 * @param {DomObject[]} cubes - 当前的立方体数组。
 * @param {HistoryInfo} historyInfo - 包含操作类型和历史数据的信息。
 * @return {DomObject[] | []} - 操作后的立方体数组或空数组。
 */
export const editorRedo = (cubes: DomObject[], historyInfo: HistoryInfo): DomObject[] | [] => {
    switch (historyInfo.type) {
        case ManagerType.Add:
            return redoAdd(cubes, historyInfo);

        case ManagerType.AddGroup:
            return redoAddGroup(cubes, historyInfo);

        case ManagerType.Remove:
            return redoRemove(cubes, historyInfo);

        case ManagerType.RemoveGroup:
            return redoRemoveGroup(cubes, historyInfo);

        case ManagerType.Move:
            return redoMove(cubes, historyInfo);

        case ManagerType.MoveGroup:
            return redoMoveGroup(cubes, historyInfo);
    }
    return [];
};

/**
 * 重做移动一组立方体的操作。
 * @param {DomObject[]} cubes - 当前的立方体数组。
 * @param {HistoryInfo} historyInfo - 包含移动操作的历史信息。
 * @return {DomObject[] | []} - 操作后的立方体数组或空数组。
 */
const redoMoveGroup = (cubes: DomObject[], historyInfo: HistoryInfo): DomObject[] | [] => {
    const {nextDatas, indexArr} = historyInfo;
    if (!nextDatas || !indexArr) {
        return cubes;
    }
    indexArr?.forEach((index, idx) => {
        cubes[index] = <DomObject>nextDatas[idx];
    });
    return cubes;
};

/**
 * 重做移动单个立方体的操作。
 * @param {DomObject[]} cubes - 当前的立方体数组。
 * @param {HistoryInfo} historyInfo - 包含移动操作的历史信息。
 * @return {DomObject[] | []} - 操作后的立方体数组或空数组。
 */
const redoMove = (cubes: DomObject[], historyInfo: HistoryInfo) => {
    const {nextData, index} = historyInfo;
    if (!nextData || index === undefined) {
        return cubes;
    }
    cubes[index] = <DomObject>nextData;
    return cubes;
};

/**
 * 重做添加单个立方体的操作。
 * @param {DomObject[]} cubes - 当前的立方体数组。
 * @param {HistoryInfo} historyInfo - 包含添加操作的历史信息。
 * @return {DomObject[] | []} - 操作后的立方体数组或空数组。
 */
const redoAdd = (cubes: DomObject[], historyInfo: HistoryInfo) => {
    const {nextData, index} = historyInfo;
    if (!nextData || index === undefined) {
        return cubes;
    }
    cubes.splice(index, 0, <DomObject>nextData);
    return cubes;
};

/**
 * 重做添加一组立方体的操作。
 * @param {DomObject[]} cubes - 当前的立方体数组。
 * @param {HistoryInfo} historyInfo - 包含添加操作的历史信息。
 * @return {DomObject[] | []} - 操作后的立方体数组或空数组。
 */
const redoAddGroup = (cubes: DomObject[], historyInfo: HistoryInfo): DomObject[] | [] => {
    const {indexArr, nextDatas} = historyInfo;
    if (!indexArr || !nextDatas) return cubes;
    indexArr.forEach((index, idx) => {
        cubes.splice(index, 0, nextDatas[idx]);
    });
    return cubes;
};

/**
 * 重做删除单个立方体的操作。
 * @param {DomObject[]} cubes - 当前的立方体数组。
 * @param {HistoryInfo} historyInfo - 包含删除操作的历史信息。
 * @return {DomObject[] | []} - 操作后的立方体数组或空数组。
 */
const redoRemove = (cubes: DomObject[], historyInfo: HistoryInfo) => {
    const {index} = historyInfo;
    if (index === undefined) {
        return cubes;
    }
    cubes.splice(index, 1);
    return cubes;
}
;

/**

 重做删除一组立方体的操作。
 @param {DomObject[]} cubes - 当前的立方体数组。
 @param {HistoryInfo} historyInfo - 包含删除操作的历史信息。
 @return {DomObject[] | []} - 操作后的立方体数组或空数组。
 */
const redoRemoveGroup = (cubes: DomObject[], historyInfo: HistoryInfo): DomObject[] | [] => {
    const {indexArr} = historyInfo;
    if (!indexArr) return cubes;
    indexArr.forEach(index => {
        cubes.splice(index, 1);
    });
    return cubes;
};
/**

 提供编辑器钩子的函数，包括撤销和重做操作。
 @return {Object} - 包含 undo 和 redo 两个方法的对象。 */ export const UseEditorHooks = () => {
    return {undo: editorUndo, redo: editorRedo};
};
