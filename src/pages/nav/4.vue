<template>
  <div class="main">
    <div class="container">
      <div class="head box">
        head
      </div>
      <div class="b1 box">
        <p class="content">
          1
        </p>
      </div>
      <div class="b2 box">
        <a>测试文字</a>
      </div>
      <div class="b3 box">
        3
      </div>
      <div class="b4 box">
        4
      </div>
      <div class="b5 box">
        5
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  cursor: not-allowed;
  background-color: #eee;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container {
  color: #303133;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-direction: row;
}
.box {
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 100px;
}
.head {
  cursor: pointer;
  transition: 100ms linear all;
  border: 1px solid #d9e8ff;
  background: #fff;
  box-shadow: 0 2px 0 0 #d9e8ff;
}
.head:hover {
  border: 1px solid #b8d4ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 0 0 #b8d4ff;
}

.b1 {
  cursor: pointer;
  position: relative;
  transition: 80ms linear all;
  border: 1px solid #dcf4f1;
  background: linear-gradient(180deg, #f5fdfc 0%, #fcfefe 100%);
  box-shadow: 0 2px 0 0 #dcf4f1;
  width: 200px; /* 示例尺寸 */
  height: 100px;
  overflow: hidden;
}
.b1::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #fff 0%, #fcfefe 100%);
  opacity: 0;
  transition: opacity 150ms linear;
}

.b1:hover {
  border: 1px solid #b8f1ea;
  box-shadow: 0 4px 0 0 #b8f1ea;
  transform: translateY(-1px);
}
.b1:hover::before {
  /* 通过伪元素的透明度控制颜色变化 */
  opacity: 1;
}

.content {
  position: relative;
  z-index: 1;
}

a {
  cursor: pointer;
  transition: 100ms linear all;
  color: inherit;
}
a:hover {
  /* 使用主色作为hover后的颜色 */
  color: #1b5cae;
}
</style>
