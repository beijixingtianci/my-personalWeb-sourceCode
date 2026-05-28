<template>
    <div v-if="visible" class="notice-fixed">
        <div class="notice-content">
            <p>{{ message }}</p>
            <button class="notice-close" @click="closeNotice">×</button>
        </div>
    </div>
</template>

<script>
export default{
    name: 'NoticeFloating',
    data(){
        return{
            visible: true,  // 每次组件加载时默认显示
            message: '网站为个人练习，会不定期更新。\n如有bug或建议，请联系我'
        }
    },

    methods:{
        closeNotice(){
            this.visible = false;          // 点击关闭，隐藏提示
        }
    }
}
</script>

<style scoped>
.notice-fixed {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1001;
  max-width: 360px;
  animation: slideInRight 0.3s ease;
}

.notice-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 12px 32px 12px 32px !important;   /* 左右内边距对称，为居中留空间 */
  position: relative;
  text-align: center;              /* 文字水平居中 */
  font-size: 0.85rem;
  line-height: 1.4;
  color: #2c3e50;
}

.notice-content p {
  margin: 0;
  white-space: pre-line;  /* 保持换行格式 */
}

.notice-close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
  line-height: 1;
}

.notice-close:hover {
  color: #e74c3c;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .notice-fixed {
    bottom: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  .notice-content {
    padding: 12px 32px 12px 32px;  /* 手机上也保持对称内边距 */
  }
}
</style>