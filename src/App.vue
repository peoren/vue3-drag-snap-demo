<script setup lang="ts">
import Selecto from "vue3-selecto";
import Moveable, {makeAble} from "vue3-moveable";
import {computed, ref, shallowRef, triggerRef} from "vue";
import {boxSquareList} from "./consts"
import { v4 as uuidv4 } from 'uuid'
import {DomObject} from "./types";
import {HistoryInfo, HistoryManager, ManagerType} from "./drag-editor-hooks/historyManager";
import {cssObjectToString} from "./utils";
import {UseEditorHooks} from "./drag-editor-hooks/editor-hooks";
const props = defineProps({
  dragOffset: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  },
  list: {
    type: Array,
    default: () => []
  }
})
const containerRef = ref<HTMLElement | null>(null)
const targets = ref<any>([])
const moveableRef = ref<any>(null)
const selectoRef = ref<any>(null)
const cubes = shallowRef<DomObject[]>([])
const cubeClass = computed(() => {
  return cubes.value.map(v => `.${v.className}`)
})
// -----------------------delete-----------------------------

const Editable = {
  name: 'editable',
  props: [],
  events: [],
  render(moveable: any, React: any) {
    const rect = moveable.getRect()
    const { pos2, target } = moveable.state
    let idx = undefined

    if (target) {
      idx = Number(target.id)
      if (isNaN(idx)) {
        throw new Error('编辑功能id缺失')
      }
    }
    const EditableViewer = moveable.useCSS(
        'div',
        `
        {
            position: absolute;
            left: 0px;
            top: 0px;
            will-change: transform;
            transform-origin: 0px 0px;
        }
        .custom-button {
            width: 24px;
            height: 24px;
            margin-bottom: 4px;
            background: #4af;
            border-radius: 4px;
            appearance: none;
            border: 0;
            color: white;
            font-weight: bold;
        }
            `
    )
    return React.createElement(
        EditableViewer,
        {
          key: 'editable-viewer',
          className: 'moveable-editable',
          style: {
            transform: `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${rect.rotation}deg) translate(10px)`
          }
        },
        [
          // '\n            ',
          // React.createElement(
          //   'button',
          //   {
          //     className: 'custom-button',
          //     onClick: () => {
          //       alert('+')
          //     }
          //   },
          //   ['+']
          // ),
          // '\n            ',
          // React.createElement(
          //   'button',
          //   {
          //     className: 'custom-button',
          //     onClick: () => {
          //       alert('-')
          //     }
          //   },
          //   ['-']
          // ),
          '\n        ',
          React.createElement(
              'button',
              {
                className: 'custom-button',
                onClick: () => {
                  try {
                    const delArr: number[] = []
                    const indexArr: number[] = []
                    targets.value.map((v: any) => {
                      delArr.push(Number(v.id))
                      indexArr.push(Number(v.id))
                    })

                    delArr.sort((a, b) => b - a)

                    // 添加历史记录
                    const prevDatas = indexArr.map((idx: number) => JSON.parse(JSON.stringify(cubes.value[idx])))
                    const historyInfo: HistoryInfo = {
                      type: ManagerType.RemoveGroup,
                      prevDatas,
                      nextDatas: [],
                      indexArr
                    }
                    historyManager.addAction(historyInfo)
                    // 删除元素
                    delArr.forEach(v => {
                      cubes.value.splice(v, 1)
                    })
                    triggerRef(cubes)
                    targets.value = []
                  } catch (e) {
                    throw new Error('删除失败')
                  }
                }
              },
              ['x']
          )
        ]
    )
  }
}
// -----------------------events-----------------------------
// 创建一个可移动组件的事件处理器，用于处理鼠标进入和离开事件
const MouseEnterLeaveAble = makeAble('enterLeave', {
  // 当鼠标移动到可移动元素上时触发的事件
  mouseEnter(moveable) {
    if (moveable.moveables) {
      moveable.moveables.forEach((child: any) => {
        // 记录鼠标进入的子元素
        console.log('enter', child)
        // 此处可以添加代码来响应鼠标进入事件，例如改变子元素的背景色
        // do something

        // child.state.target.style.backgroundColor = '#e55'
      })
    } else {
      // 如果没有子元素，可以在这里添加对单个元素的鼠标进入响应
      // moveable.state.target.style.backgroundColor = '#e55'
    }
  },
  // 当鼠标从可移动元素上移开时触发的事件

  mouseLeave(moveable) {
    if (moveable.moveables) {
      moveable.moveables.forEach((child: any) => {
        console.log('leave', child)
        // child.state.target.style.backgroundColor = ''
      })
    } else {
      // moveable.state.target.style.backgroundColor = ''
    }
  }
})
/**
 * 处理Selecto组件选择组的点击事件
 * @param e - 事件对象，包含了inputEvent和inputTarget等属性
 */
const onClickGroup = (e: any) => {
  // 调用Selecto组件的clickTarget方法，传入点击事件和目标元素

  selectoRef.value?.clickTarget(e.inputEvent, e.inputTarget)
}
// -----------------------render events-----------------------------
const onRenderStart = (e: any) => {
  e.datas.prevData = JSON.parse(JSON.stringify(cubes.value[e.target.id]))
  e.datas.isRender = false
}
const onRender = (e: any) => {
  const { target } = e
  target.style.cssText += e.cssText
  e.datas.isRender = true
}
const onRenderEnd = (e: any) => {
  if (!e.datas.isRender) {
    return
  }
  const { target } = e
  const idx = target.id
  cubes.value[idx].cssText = target.style.cssText
  // 添加历史记录
  const historyInfo: HistoryInfo = {
    type: ManagerType.Move,
    prevData: e.datas.prevData,
    nextData: cubes.value[idx],
    index: idx
  }
  historyManager.addAction(historyInfo)

  e.datas = {}
}
const onRenderGroupStart = (e: any) => {
  e.datas.prevDatas = e.targets.map((target: any) => {
    const idx = target.id
    return JSON.parse(JSON.stringify(cubes.value[idx]))
  })
  e.datas.isRender = false
}

const onRenderGroup = (e: any) => {
  e.events.forEach((ev: any) => {
    // ev.target.style.cssText += ev.cssText
    onRender(ev)
  })
  e.datas.isRender = true
}
const onRenderGroupEnd = (e: any) => {
  if (!e.datas.isRender) {
    return
  }
  const indexArr: number[] = []
  const nextDatas = e.targets.map((target: any) => {
    const idx = target.id
    cubes.value[idx].cssText = target.style.cssText
    indexArr.push(Number(idx))
    return cubes.value[idx]
  })
  // 添加历史记录
  const historyInfo: HistoryInfo = {
    type: ManagerType.MoveGroup,
    prevDatas: e.datas.prevDatas,
    nextDatas,
    indexArr
  }
  historyManager.addAction(historyInfo)
  console.log('%c ---> onRenderEnd: ', 'color:#F00;', e)
  e.datas = {}
}
const onDragStart = (e: any) => {
  const moveable = moveableRef.value
  const target = e.inputEvent.target
  if (moveable.isMoveableElement(target) || targets.value.some((t: any) => t === target || t?.contains(target))) {
    e.stop()
  }
}
const onSelectEnd = (e: any) => {
  const { inputEvent } = e
  // 排除点击元素tools的情况
  if (inputEvent.target.className.includes('custom-button')) {
    return
  }
  const moveable = moveableRef.value
  if (e.isDragStart) {
    e.inputEvent.preventDefault()
    moveable?.waitToChangeTarget().then(() => {
      moveable?.dragStart(e.inputEvent)
    })
  }

  targets.value = e.selected
}

/**
 * @description 内容区拖拽事件
 * @return {undefined} 描述返回值
 * @param ev
 */
const containerDragHandler = (ev: DragEvent) => {
  ev.preventDefault()
  const data = Number(ev?.dataTransfer?.getData('index'))
  if (isNaN(data)) {
    return
  }
  const { clientX, clientY } = ev
  const { x = 0, y = 0 } = containerRef.value?.getBoundingClientRect() ?? {}

  const cur: any = props.list[Number(data)]
  const style = {
    top: `${clientY - y - props.dragOffset.y}px`,
    left: `${clientX - x - props.dragOffset.x}px`,
    width: `${cur.style.width}px`,
    height: `${cur.style.height}px`,
    backgroundColor: cur.style.backgroundColor,
    border: cur.style.border,
    transform: cur.style.transform,
    fontSize: `${cur.style.fontSize}px`
  }
  const newBox = {
    id: uuidv4(),
    tagName: cur.tagName || 'div',
    className: `cube${cubes.value.length} ${cur.className}`,
    cssText: cssObjectToString(style)
  }
  cubes.value.push(newBox)
  // 添加历史记录
  const historyInfo: HistoryInfo = {
    type: ManagerType.Add,
    prevData: '',
    nextData: newBox,
    index: cubes.value.length - 1
  }
  historyManager.addAction(historyInfo)

  triggerRef(cubes)
}

// -----------------------undo-redo-----------------------------
const historyManager = new HistoryManager()
const { undo, redo } = UseEditorHooks()
const undoHandler = () => {
  const historyInfo = historyManager.undo()
  if (historyInfo) {
    cubes.value = undo(cubes.value, historyInfo)
    triggerRef(cubes)
  }
}
const redoHandler = () => {
  const historyInfo = historyManager.redo()
  if (historyInfo) {
    cubes.value = redo(cubes.value, historyInfo)
    triggerRef(cubes)
  }
}
</script>

<template>
  <div class="container" ref="containerRef" @drop.stop="containerDragHandler" @dragover.prevent>
    <Moveable
        ref="moveableRef"
        :resizable="true"
        :draggable="true"
        :rotatable="true"
        :target="targets"
        :snappable="true"
        :elementGuidelines="cubeClass"
        :snapGap="true"
        :props="{ enterLeave: true, editable: true }"
        :ables="[MouseEnterLeaveAble, Editable]"
        @clickGroup="onClickGroup"
        @renderStart="onRenderStart"
        @render="onRender"
        @renderEnd="onRenderEnd"
        @renderGroupStart="onRenderGroupStart"
        @renderGroup="onRenderGroup"
        @renderGroupEnd="onRenderGroupEnd"
    />
    <Selecto
        ref="selectoRef"
        dragContainer=".container"
        :selectableTargets="['.selecto-area .cube']"
        :hitRate="0"
        :selectByClick="true"
        :selectFromInside="false"
        :toggleContinueSelect="['shift']"
        :ratio="0"
        @dragStart="onDragStart"
        @selectEnd="onSelectEnd"
    />
    <div class="elements selecto-area">
      <component
          v-for="(cube, idx) in cubes"
          :is="cube.tagName"
          :uuid="cube.id"
          :id="idx.toString()"
          :key="idx"
          :class="cube.className"
          :style="cube.cssText"
          style="position: absolute"
          class="cube"
      >
        <span v-if="cube.tagName === 'div'" class="room-number">811{{ idx }}</span>
      </component>
    </div>
    <div class="editor-tools">
      <el-button @click="undoHandler">后退</el-button>
      <el-button @click="redoHandler">前进</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}

.room-number {
  position: absolute;
  right: 0;
  top: 0;
  padding: 4px;
  background: #eff9fd;
}

.selecto-area .cube:nth-child(3) {
  background: #c4c4c4 !important;
}
</style>

<style scoped>
html,
body {
  position: relative;
  height: 100%;
  margin: 0;
  padding: 0;
}

html:has(.no-relative),
body:has(.no-relative) {
  margin: 8px;
  padding: 8px;
  position: static;
  /* border: 8px solid red; */
}

html:has(.no-relative) {
  position: relative;
}

html:has(.margin),
body:has(.margin) {
  /* margin-top: 50px; */
}

.margin .root {
  position: static;
}



.root {
  position: relative;
}

.container {
  width: 50vw;
  height: 50vh;
  border: 1px solid #333;
  position: relative;
}





.nested .target {
  top: 50px;
  left: 50px
}




.control-padding .moveable-around-control {
  background: #f55 !important;
}





.box-container{
  position: absolute;
  right: 10px;
  top: 20px;
  width: 300px;
  height: auto;
  display: flex;
  flex-direction: column;
}
</style>
