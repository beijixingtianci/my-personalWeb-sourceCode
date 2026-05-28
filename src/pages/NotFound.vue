<template>
  <div class="not-found">
    <h1>404</h1>
    <p>你访问的页面不存在</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script setup>
// 纯展示页面，不需要逻辑
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #a1f2ea;
  font-family: 'Microsoft YaHei', sans-serif;
}
.not-found h1 {
  font-size: 6rem;
  margin: 0;
}
.not-found p {
  font-size: 1.2rem;
  margin: 1rem 0 2rem;
}
.not-found a {
  color: #a1f2ea;
  text-decoration: underline;
  font-size: 1rem;
}
</style>
