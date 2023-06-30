<template>
  <div class="tag">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: thatRoute.path }">
        <template class="flex-ac">
          <viewfinder
            theme="outline"
            size="24"
            fill="#327ff2"
            v-if="thatRoute.name == '工位配置'"
          />
          <history
            theme="outline"
            size="24"
            fill="#327ff2"
            v-if="thatRoute.name == '历史记录'"
          />
          <server
            theme="outline"
            size="24"
            fill="#327ff2"
            v-if="thatRoute.name == '服务器状态监控'"
          />
          <span class="tagName">{{ thatRoute.name }}</span>
        </template>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter } from "vue-router";
import { Viewfinder, History ,Server} from "@icon-park/vue-next";

const $router = useRouter();
const thatRoute = ref([]);
watchEffect(() => {
  thatRoute.value = $router.currentRoute.value;
  // console.log('tag route',thatRoute.value)
});
</script>

<style lang="scss" scoped>
.tag {
  margin: 10px 0;
  padding: 0 14px;
  box-sizing: border-box;
  .tagName{
    margin-left: 6px;
  }
}
</style>
