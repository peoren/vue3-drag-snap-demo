<script setup lang="ts">
import Selecto from "vue3-selecto";
import Moveable from "vue3-moveable";
import {computed, ref, shallowRef, triggerRef} from "vue";
const containerRef = ref(null)
const targets = ref([]);
const moveableRef = ref(null);
const selectoRef = ref(null);
const cubes = shallowRef([]);

const cubeClass = computed(() => {
  return cubes.value.map((v) => '.'+v.className);
});

// -----------------------events-----------------------------
const onClickGroup = e => {
  selectoRef.value.clickTarget(e.inputEvent, e.inputTarget);
};
const onDrag = e => {
  e.target.style.transform = e.transform;
  const idx = e.target.id
  const cur = cubes.value[idx];
  cur.style.transform = e.transform;
};
const onResize = e => {
  e.target.style.width = `${e.width}px`;
  e.target.style.height = `${e.height}px`;
  const idx = e.target.id
  const cur = cubes.value[idx];
  cur.style.width = e.width;
  cur.style.height = e.height
};
const onRotate = e => {
  e.target.style.transform = e.drag.transform;
  const idx = e.target.id
  const cur = cubes.value[idx];
  cur.style.transform = e.drag.transform;
};
const onDragGroup = e => {
  e.events.forEach(ev => {
    onDrag(ev)
    // ev.target.style.transform = ev.transform;
    // // 同步数据
    // const idx = ev.target.id
    // const cur = cubes.value[idx];
    // cur.style.transform = ev.transform;
  });
};
const onResizeGroup = (e)=>{
  e.events.forEach(ev => {
    onResize(ev)
    // ev.target.style.width = `${ev.width}px`;
    // ev.target.style.height = `${ev.height}px`;
    // const idx = ev.target.id
    // const cur = cubes.value[idx];
    // cur.style.width = ev.width;
    // cur.style.height = ev.height
  });
}
const onRotateGroup = (e)=>{
  e.events.forEach(ev => {
    onRotate(ev)
  });
}
const onDragStart = e => {
  const moveable = moveableRef.value;
  const target = e.inputEvent.target;
  if (moveable.isMoveableElement(target)
      || targets.value.some(t => t === target || t.contains(target))
  ) {
    e.stop();
  }
};
const onSelectEnd = e => {
  const moveable = moveableRef.value;
  if (e.isDragStart) {
    e.inputEvent.preventDefault();
    moveable.waitToChangeTarget().then(() => {
      moveable.dragStart(e.inputEvent);
    });
  }

  targets.value = e.selected;
  console.log("%c ---> targets.value: ","color:#F0F;", targets.value);
};

// -----------------------box-----------------------------
const metaSquare = {
  tag:'div',
  class:'cube',
  position:'absolute',
  style:{
    top:30,
    left:40,
    width:200,
    height:200,
    backgroundColor:'red',
    transform:'translate(0px, 0px) rotate(0deg) scale(1, 1)'
  }
}
interface BoxSquare {
  tagName: string;
  className: string;
  style: {
    top: number;
    left: number;
    width: number;
    height: number;
    backgroundColor: string;
    transform: string;
  };
}
const boxSquareList = [
  {
    tagName: 'div',
    className: 'cube',
    style: {
      top: 0,
      left: 0,
      width: 50,
      height: 50,
      backgroundColor: 'red',
      transform: 'translate(0px, 0px) rotate(0deg) scale(1, 1)'
    }
  },
  {
    tagName: 'div',
    className: 'cube',
    style: {
      top: 100,
      left: 0,
      width: 70,
      height: 90,
      backgroundColor: 'blue',
      transform: 'translate(0px, 0px) rotate(0deg) scale(1, 1)'
    }
  },
  {
    tagName: 'div',
    className: 'cube',
    style: {
      top: 100,
      left: 0,
      width: 100,
      height: 70,
      backgroundColor: 'green',
      transform: 'translate(0px, 0px) rotate(0deg) scale(1, 1)'
    }
  }
];
const translateStyle = (style)=>{
  return {
    ...style,
    top: style.top + 'px',
    left: style.left + 'px',
    width: style.width + 'px',
    height: style.height + 'px',
    backgroundColor: style.backgroundColor
  }

}
let dragOffset = {x:0,y:0}
const dragStartHandler = (ev)=>{
  const {offsetX,offsetY} = ev;
  dragOffset = {x:offsetX,y:offsetY}
  ev.dataTransfer.setData("index", ev.target.id);
  ev.dataTransfer.dropEffect = "move";

}
const containerDragHandler = (ev)=>{
  ev.preventDefault();
  const data = ev.dataTransfer.getData("index");
  const {clientX,clientY} = ev;
  const {x,y} = containerRef.value.getBoundingClientRect()
  const cur = boxSquareList[data];
  const style = {
    top: clientY - y - dragOffset.y,
    left: clientX - x - dragOffset.x,
    width: cur.style.width,
    height: cur.style.height,
    backgroundColor: cur.style.backgroundColor,
    transform: cur.style.transform
  }
  const newBox = {
    tagName: 'div',
    className: `cube${cubes.value.length}`,
    style
  }
  cubes.value.push(newBox);
  triggerRef(cubes);
}
</script>

<template>
  <div class="root">
    <div class="container" ref="containerRef"  @drop.stop="containerDragHandler" @dragover.prevent>
      <Moveable
          ref="moveableRef"
          :resizable="true"
          :draggable="true"
          :rotatable="true"
          :target="targets"
          :snappable="true"
          :elementGuidelines="cubeClass"
          :snapGap="true"
          @clickGroup="onClickGroup"
          @drag="onDrag"
          @dragGroup="onDragGroup"
          @resizeGroup="onResizeGroup"
          @rotateGroup="onRotateGroup"
          @resize="onResize"
          @rotate="onRotate"
      ></Moveable>
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
      ></Selecto>
      <div class="elements selecto-area">
        <div
            :id="idx"
            :key="idx"
            v-for="(cube,idx) in cubes"
            :class="cube.className"
            :style="translateStyle(cube.style)"
            style="position: absolute"
            class="cube"
        ></div>
      </div>
      <div class="empty elements"></div>
    </div>
    <div class="box-container">
      <div draggable="true"  @dragstart="dragStartHandler"  v-for="(box,idx) in boxSquareList" :style="{width:box.style.width+'px',height:box.style.height+'px',backgroundColor: box.style.backgroundColor}"  :key="idx" :id="idx" ></div>
    </div>
  </div>
</template>
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
