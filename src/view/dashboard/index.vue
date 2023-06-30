<template>
  <div class="main font40">{{ $t(`dashboard.txt`) }}:{{ user.userName }}</div>
</template>
<script setup>
// data-server
import { ref, reactive } from "vue";
const user = ref(JSON.parse(localStorage.getItem("$user")));

</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  text-align: left;
  
}
</style>
