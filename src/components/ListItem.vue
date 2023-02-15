<template>
  <div class="item" :class="active ? 'active' : ''">

    <div class="text">
      <h4>{{ devicename }}</h4>
    </div>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  devicename: {
    type: String,
    required: false,
    default: "",
  },
  text: {
    type: String,
    required: false,
    default: "",
  },
  showDel: {
    type: Boolean,
    required: false,
    default: false,
  },
  active: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<style scoped lang="scss">
.item {
  height: 40px;
  display: flex;
  // border-top: 1px solid rgba(94, 89, 89, 0.63);
  border-bottom: 1px solid rgba(94, 89, 89, 0.63);
  margin-bottom: 1px;
  align-items: center;
  justify-content:center;

  &:hover {
    background-color: #cccccc98;
  }


  .text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content:center;
    height: 100%;

  }
}

.active {
  background-color: #cccccc98;
  border-right: 1px solid rgba(94, 89, 89, 0.63);
}
</style>
