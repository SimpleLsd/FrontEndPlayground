<template>
  <div class="main">
    <div class="info">
      <span>
        以下板块使用计算网格布局，表单容器宽度：{{ containerWidth }}px，计算的列数：{{ columnNum }}
        <!-- ,{{ customFormWidth }},{{ typeof customFormWidth }} -->
      </span>
      <span class="input-group">
        最小宽度设置
        <!-- <input v-model="customFormWidth" type="number" class="info-input" value="360"> -->
        <el-input-number v-model="customFormWidth" style="width: 120px" size="small" />
      </span>
    </div>
    <div ref="formContainer" class="form-container-computed">
      <div v-for="i in 10" :key="i" class="form-item">
        Item {{ i }}
      </div>
    </div>
    <div class="info">
      以下板块使用媒体识别控制列数
    </div>
    <div ref="formContainer" class="form-container-media">
      <div v-for="i in 10" :key="i" class="form-item">
        Item {{ i }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineModel, onMounted, ref } from 'vue'

const formContainer = ref<HTMLElement | null>(null)

const containerWidth = ref(0)

// const formMinWidth: number = 360
const gap: number = 16
const padding: number = 16
const customFormWidth = defineModel<number>({ })
customFormWidth.value = 360

const columnNum = computed(() => {
  return getColumnNum(customFormWidth.value ? customFormWidth.value : 0, gap, containerWidth.value)
})

function getColumnNum(formMinWidth: number, gap: number, containerWidth: number): number {
  return ~~((containerWidth + gap) / (formMinWidth + gap))
}

function updateContainerWidth() {
  if (formContainer.value) {
    containerWidth.value = formContainer.value.clientWidth - padding * 2
  }
  else {
    containerWidth.value = 1000 // 回退值
  }
}

onMounted(() => {
  updateContainerWidth()
  window.addEventListener('resize', updateContainerWidth)
})
</script>

<style scoped>
.main {
  width: 100%;
  text-align: left;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #f5f7fa;
  box-sizing: border-box;
  padding: 16px;
}
.info {
  width: 100%;
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
}
.input-group {
  display: flex;
  gap: 6px;
}
.info-input {
  width: 60px;
  border: 1px solid #dcdfe6;
}
.form-container-computed {
  width: 100%;
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  display: grid;
  grid-template-columns: repeat(v-bind(columnNum), minmax(0px, 1fr));
  gap: 16px;
}
.form-item {
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  text-align: center;
  line-height: 40px;
}
.form-container-media {
  width: 100%;
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  display: grid;
  gap: 16px;
}
@media (max-width: 800px) {
  .form-container-media {
    grid-template-columns: repeat(1, minmax(0px, 1fr));
  }
}
@media (min-width: 801px) and (max-width: 1360px) {
  .form-container-media {
    grid-template-columns: repeat(2, minmax(0px, 1fr));
  }
}
@media (min-width: 1361px) and (max-width: 1740px) {
  .form-container-media {
    grid-template-columns: repeat(3, minmax(0px, 1fr));
  }
}
@media (min-width: 1741px) and (max-width: 2120px) {
  .form-container-media {
    grid-template-columns: repeat(4, minmax(0px, 1fr));
  }
}
@media (min-width: 2121px) {
  .form-container-media {
    grid-template-columns: repeat(5, minmax(0px, 1fr));
  }
}
</style>
