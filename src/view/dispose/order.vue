<template>
  <div class="main_seat">
    <div class="search flex0 flex-ac-sb">
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline flex-c-c"
      >
        <el-form-item label="订单号">
          <el-input v-model="formInline.user" placeholder="输入订单号" />
        </el-form-item>

      </el-form>
      <div>
        <el-button type="primary" @click="onSubmit" round :icon="Search"
          >搜索</el-button
        >
        <!-- <el-button type="primary" @click="onAdd" round :icon="Plus"
          >新增</el-button
        > -->
      </div>
    </div>

    <div class="content flex1">
      <el-table :data="tableData" :border="parentBorder" style="width: 100%">
        <el-table-column type="expand">
          <template #default="props">
            <el-timeline :data-m="props">
              <el-timeline-item
                v-for="(item, idx) in 10"
                :key="idx"
                timestamp="2018/4/12"
                placement="top"
                :color="idx == 0 ? '#1aad19' : '#eee'"
              >
                <el-card>
                  <h4>Update Github template</h4>
                  <p>Tom committed 2018/4/12 20:46</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name" />
        <el-table-column label="时间" prop="date" />
        <el-table-column label="状态" prop="date">
          <template #default="props">
            <el-tag class="ml-2" type="success">完成</el-tag>
            <el-tag class="ml-2" type="info">未完成</el-tag>
            <el-tag class="ml-2" type="danger">错误</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <div class="footPage flex0 flex-ac-sb">
      <el-button type="primary" plain @click="delThat">批量删除</el-button>
      <el-pagination
        background
        :total="1000"
        layout="total, prev, pager, next"
      />
    </div>
  </div>
</template>

<script setup>
import { Search, Plus } from "@element-plus/icons-vue";
import { ref, reactive } from "vue";
const tableData = ref([
  {
    name: "KCPW2",
    region: "",
    type: "",
    date: Date.now(),
    value: 1,
  },
  {
    name: "KCPW2",
    region: "",
    type: "",
    date: Date.now(),
    value: 1,
  },
  {
    name: "KCPW2",
    region: "",
    type: "",
    date: Date.now(),
    value: 1,
  },
  {
    name: "KCPW2",
    region: "",
    type: "",
    date: Date.now(),
    value: 1,
  },
]);
const dialogType = ref(true);
const labelPosition = ref("right");
const multipleSelection = ref([]);
const formInline = reactive({
  user: "",
  region: "",
});

const onSubmit = () => {
  console.log("submit!");
};

const formLabelAlign = reactive({
  name: "",
  region: "",
  type: "",
});
const dialogVisible = ref(false);
const deleteRow = (idx) => {
  dialogVisible.value = true;
  formLabelAlign.value = tableData[idx];
};
const onAdd = () => {
  dialogVisible.value = true;
  dialogType.value = true;
};
const dialogTrueChange = () => {
  dialogVisible.value = false;
  tableData.value.push({ ...formLabelAlign.value, value: 1 });
  formLabelAlign.value = {
    name: "",
    region: "",
    type: "",
  };
};
const delThat = () => {
  tableData.value.forEach((el, idx) => {
    multipleSelection.value.forEach((ele) => {
      if (el.date === ele.date) {
        tableData.value.splice(idx, 1);
      }
    });
  });
};
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};
</script>
<style lang="scss" scoped>
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
