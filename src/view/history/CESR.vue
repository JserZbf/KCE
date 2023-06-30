<template>
  <div class="main_seat">
    <div class="search flex0 flex-ac-sb">
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline flex-c-c"
      >
        <el-form-item label="订单号">
          <el-input
            v-model="formInline.sn"
            placeholder="输入订单号"
            @keyup.enter.native="onSubmit"
          />
        </el-form-item>
        <el-form-item label="工位" prop="stationID">
          <el-select
            style="width: 100%"
            v-model="formInline.stationID"
            placeholder="选择工位"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="(item, i) in stationList"
              :key="i"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期选择">
          <el-date-picker
            v-model="timeVal"
            type="datetimerange"
            range-separator="到"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="onSubmit" round :icon="Search"
          >搜索</el-button
        >
      </div>
    </div>

    <div class="content flex1">
      <el-table
        class=""
        :data="tableData"
        :border="parentBorder"
        style="width: 100%"
      >
        <el-table-column label="描述" prop="content" align="center">
          <template #default="{ row }">
            {{ row.content }}
          </template>
        </el-table-column>

        <el-table-column label="删除时间" prop="createTime" align="center">
          <template #default="{ row }">
            {{ dateFormat("YYYY-mm-dd HH:MM:SS", new Date(row.time)) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="footPage flex0 flex-ac-sb">
      <el-button type="primary" plain @click="delThat">批量删除</el-button>
      <div></div>
      <el-pagination
        background
        :page-size="20"
        @current-change="selectSize"
        v-model:current-page="current"
        :total="total"
        layout="total, prev, pager, next"
      />
    </div> -->
    <el-dialog v-model="dialogVisible" title="视频" width="40%">
      <video
        v-if="dialogVisible"
        style="max-width: 100%"
        :src="thatRow.filePath"
        controls="controls"
      ></video>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Search, Plus } from "@element-plus/icons-vue";
import { getPhysicalDelRecord, addPicVideo, delPicVideo } from "@/api/ladder";
import { getStation } from "@/api/seat";

const tableData = ref([]);
const formInline = ref({});
const timeVal = ref([]);
const dialogVisible = ref(false);
const thatRow = ref({});
const stationList = ref([]); // 工位

const onSubmit = () => {
  getTable({
    ...formInline.value,
    startDate: timeVal.value[0],
    endDate: timeVal.value[1],
  });
};
const getTable = (params) => {
  getPhysicalDelRecord({ ...params }).then((res) => {
    console.log(res);
    tableData.value = res.data;
  });
};
const thatOn = (row) => {
  dialogVisible.value = true;
  thatRow.value = row;
};
const getStationList = (data) => {
  getStation({ ...data }).then((res) => {
    console.log("工位：", res.data);
    stationList.value = res.data;
  });
};
getStationList();
const dateFormat = (fmt, date) => {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
};
getTable({});
</script>
<style lang="scss" scoped>
// .ei-flow-form .el-card__body {
//   // 解决大图预览其它地方层级穿透问题
//   z-index: initial !important;
// }

.main_seat {
  width: 100%;
  height: 100%;
  padding: 14px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .content {
    width: 100%;
    // height: 100%;
    overflow-y: scroll;
    :deep(.el-table) {
      .el-table__cell {
        //解决层级穿透 使得 子元素不与其产生新的层叠关系
        position: static;
      }
    }
  }
  .search {
    width: 100%;
    margin-bottom: 26px;
    border-bottom: 1px solid #eee;
    padding: 27px 0;

    .demo-form-inline {
      display: flex;
      align-items: center;

      .el-form-item {
        margin-bottom: 0;
      }
    }
    // height: 83px;
  }
  .footPage {
    width: 100%;
    margin-top: 10px;
  }
}
.ep-button {
  margin: 4px;
}
.ep-button + .ep-button {
  margin-left: 0;
  margin: 4px;
}
</style>
