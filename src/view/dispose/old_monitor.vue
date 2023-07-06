<template>
    <div class="main_seat">
      <div class="search flex0 flex-ac-sb">
        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline flex-c-c"
        >
          <el-form-item label="服务器名称">
            <el-input v-model="formInline.user" placeholder="输入服务器名称" />
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" @click="onSubmit" round :icon="Search"
            >搜索</el-button
          >
        </div>
      </div>
  
      <div class="content flex1 flex-y">
        <div class="card w100">服务器存储状态：{{ storage }}</div>
        <div class="content_item flex" v-if="false">
          <div class="card flex-y flex-sb" v-for="(item, idx) in 10" :key="idx">
            <div class="flex-ac-sb">
              <server class="" theme="outline" size="75" fill="#308aea" />
              <div class="rightTxt">
                <!-- <div>网络:{{ "连通" }}</div> -->
                <!-- <div>在线状态:{{ "" }}</div>
                <div>心跳:{{ "" }}</div>
                <div>cpu:{{ "35%" }}</div>
                <div>内存:{{ "60%" }}</div> -->
                <div>硬盘:{{ "70%（1.4T/2T）" }}</div>
              </div>
            </div>
            <!-- <div class="flex-ac-sb">
              <el-button type="primary" :icon="Edit" size="small">编辑</el-button>
              <el-button type="danger" :icon="Delete" size="small"
                >删除</el-button
              >
              <el-button type="info" :icon="DocumentCopy" size="small"
                >复制</el-button
              >
              <el-button type="warning" :icon="CircleCheck" size="small"
                >未启用</el-button
              >
            </div> -->
          </div>
        </div>
      </div>
  
      <!-- <div class="footPage flex0 flex-ac-sb">
        <el-button type="primary" plain @click="delThat">批量删除</el-button>
        <el-pagination
          background
          :total="1000"
          layout="total, prev, pager, next"
        />
      </div> -->
  
      <el-dialog
        v-model="dialogVisible"
        title="配置"
        width="30%"
        align-center
        :append-to-body="true"
      >
        <el-form
          :label-position="labelPosition"
          label-width="100px"
          :model="formLabelAlign"
          style="max-width: 460px; padding-right: 90px; box-sizing: border-box"
        >
          <el-form-item label="IP:">
            <el-input v-model="formLabelAlign.name" />
          </el-form-item>
          <el-form-item label="端口:">
            <el-input v-model="formLabelAlign.region" />
          </el-form-item>
          <el-form-item label="协议:">
            <el-input v-model="formLabelAlign.type" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogTrueChange"> 确定 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  <script setup>
  import { Server } from "@icon-park/vue-next";
  import { ref, reactive } from "vue";
  import { Search, Plus } from "@element-plus/icons-vue";
  import { ElMessage } from "element-plus";
  import { getList } from "@/api/monitor";
  
  const tableData = ref([
    {
      name: "服务器1",
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
  const storage = ref("");
  const getNotify = () => {
    getList({ type: "storage" }).then((res) => {
      console.log("服务器：", res.data);
      storage.value = res.data;
    });
  };
  getNotify();
  const onSubmit = () => {
    console.log("submit!");
    getNotify();
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
      flex-wrap: nowrap;
      padding: 24px;
      box-sizing: border-box;
      .w100{
          width: 100%;
          text-align: left;
          border-radius: 12px;
      }
      .content_item {
        width: 100%;
        height: 100%;
        padding: 12px;
        box-sizing: border-box;
        flex-wrap: wrap;
        .card {
          width: 28%;
          min-width: 345px;
          max-width: 380px;
          height: 230px;
          min-height: 230px;
          border-radius: 12px;
          margin-bottom: 22px;
          margin-right: 22px;
          .rightTxt {
            width: 200px;
            margin-right: 14px;
            div {
              padding: 6px 0px 6px 40px;
              box-sizing: border-box;
              border-radius: 12px;
              background: #f5f5f5;
              margin-bottom: 6px;
              text-align: left;
            }
          }
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