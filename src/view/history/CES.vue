<template>
  <div class="main_seat">
    <div class="search flex0 flex-ac-sb">
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline flex-ac"
      >
        <el-form-item :label="$t('form.order')">
          <el-input
            style="width: 180px"
            v-model="formInline.sn"
            :placeholder="$t('form.order')"
            @keyup.enter.native="onSubmit"
          />
        </el-form-item>

        <el-form-item :label="$t('form.flow')">
          <el-select
            clearable
            style="width: 180px"
            v-model="formInline.flowTypeId"
            :placeholder="$t('form.flow')"
            filterable
            :filter-method="dataFilter"
            @change="flowTypeChange"
          >
            <el-option
              v-for="(item, i) in flowTypeList"
              :key="i"
              :label="item.flowTypeName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('form.station')" prop="configId">
          <el-select
            clearable
            style="width: 180px"
            v-model="formInline.configId"
            :placeholder="$t('form.station')"
            filterable
            :filter-method="dataFilter"
          >
            <el-option
              v-for="(item, i) in flowItemList"
              :key="i"
              :label="item.flowItemName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('form.userName')" prop="userName">
          <el-input
            style="width: 180px"
            v-model="formInline.userName"
            :placeholder="$t('form.userName')"
            @keyup.enter.native="onSubmit"
          />
        </el-form-item>
        <el-form-item :label="$t('form.work')" prop="workID">
          <el-input
            style="width: 180px"
            v-model="formInline.workID"
            :placeholder="$t('form.work')"
            @keyup.enter.native="onSubmit"
          />
        </el-form-item>

        <el-form-item :label="$t('form.videoName')" prop="workID">
          <el-input
            style="width: 180px"
            v-model="formInline.name"
            :placeholder="$t('form.videoName')"
            @keyup.enter.native="onSubmit"
          />
        </el-form-item>

        <el-form-item :label="$t('form.time')">
          <el-date-picker
            style="width: 340px"
            v-model="timeVal"
            type="datetimerange"
            :range-separator="$t('form.to')"
            :start-placeholder="$t('form.startTime')"
            :end-placeholder="$t('form.endTime')"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <!-- <el-form-item label="日期选择">
          <el-date-picker
            v-model="timeVal"
            type="datetimerange"
            range-separator="到"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item> -->
      </el-form>
      <div>
        <el-button type="primary" @click="onSubmit" round :icon="Search">{{
          $t("form.search")
        }}</el-button>
      </div>
    </div>

    <div class="content flex1">
      <el-table
        class=""
        :data="tableData"
        :border="parentBorder"
        style="width: 100%; height: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          type="index"
          :label="$t('table.idx')"
          width="85"
          align="center"
        />
        <el-table-column
          :label="$t('table.order')"
          prop="sn"
          width="120"
          align="center"
        />
        <el-table-column
          :label="$t('table.station')"
          prop="flowItemName"
          align="center"
        />
        <el-table-column
          :label="$t('table.name')"
          prop="userName"
          align="center"
        />
        <el-table-column
          :label="$t('table.work')"
          prop="workID"
          align="center"
        />
        <el-table-column
          :label="$t('form.videoName')"
          prop="name"
          align="center"
        >
          <template #default="{ row }">
            {{ row.name === "image" ? "图片" : "视频名称：" + row.name }}
          </template>
        </el-table-column>
        <!-- <el-table-column
          :label="$t('table.fileType')"
          prop="fileType"
          align="center"
        >
          <template #default="{ row }">
            {{ fileTypeList.find((item) => row.fileType  == item.value)?.lable }}
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="文件地址" prop="filePath" /> -->
        <el-table-column :label="$t('table.fileView')" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.fileType == 'image'"
              style="width: 60px; height: 60px"
              :src="row.filePath"
              :preview-src-list="[row.filePath]"
              z-index="99999999"
            >
              <template #error>
                <div class="flex-c-c" style="width: 20px; height: 20px">
                  <el-icon><icon-picture /></el-icon>
                </div>
              </template>
            </el-image>

            <el-image
              v-if="row.fileType == 'demoImg'"
              style="width: 100px; height: 100px"
              :src="row.filePath"
              :preview-src-list="[row.filePath]"
              z-index="99999999"
            >
              <template #error>
                <div class="flex-c-c" style="width: 20px; height: 20px">
                  <el-icon><icon-picture /></el-icon>
                </div>
              </template>
            </el-image>

            <video
              v-if="row.fileType == 'video'"
              style="width: 100px; height: 100px"
              class="table_video"
              :src="row.filePath"
              @click="thatOn(row)"
            >
              浏览器不支持视频播放
            </video>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('table.createTime')"
          prop="createTime"
          align="center"
        >
          <template #default="{ row }">
            {{ dateFormat("YYYY-mm-dd HH:MM:SS", new Date(row.createTime)) }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('table.operate')" align="center">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              @click="download(row.filePath, row)"
              >{{ $t("table.download") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footPage flex0 flex-ac-sb">
      <div>
        <el-popconfirm :title="$t('msg.delMsg')" @confirm="delThat">
          <template #reference>
            <el-button type="primary" v-hasRole="['admin', 'superCES']" plain>{{
              $t("form.del")
            }}</el-button>
          </template>
        </el-popconfirm>
      </div>
      <el-pagination
        background
        :page-size="20"
        @current-change="selectSize"
        v-model:current-page="current"
        :total="total"
        layout="total, prev, pager, next"
      />
    </div>
    <el-dialog v-model="dialogVisible" :title="videoName" width="40%" top="5vh">
      <video
        v-if="dialogVisible"
        style="max-width: 100%;height: calc(90vh - 100px);"
        :src="thatRow.filePath"
        controls="controls"
      ></video>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Search, Plus } from "@element-plus/icons-vue";
import {
  getPicVideo,
  addPicVideo,
  delPicVideo,
  addPhysicalDelRecord,
} from "@/api/ladder";
import { getPicVideoFlowTypeConfig } from "@/api/flow";
import { getPicVideoFlowItemConfig } from "@/api/flow";
import { getStation } from "@/api/seat";
import { baseUrl } from "@/utils/baseUrl";
import { getUser } from "@/api/user";
import { ElMessage } from "element-plus";
import { fileTypeList } from "@/config/config";

var user = JSON.parse(localStorage.getItem("$user"));

console.log("11111", user);
const tableData = ref([]);
const formInline = ref({});
const timeVal = ref([]);
const flowTypeList = ref([]);
const flowItemList = ref([]);
const dialogVisible = ref(false);
const thatRow = ref({});
const videoName = ref("");

// const stationList = ref([
//   { lable: "梳齿", value: "梳齿" },
//   { lable: "桁架", value: "桁架" },
//   { lable: "整梯", value: "整梯" },
//   { lable: "边框", value: "边框" },
// ]); // 工位
const userList = ref([]); // 工位

const current = ref(1);
const total = ref(0);
const selectSize = (num) => {
  current.value = num;
  getTable({ ...formInline.value, pageNum: current.value });
};

const onSubmit = (type) => {
  //   getTable({
  //     ...formInline.value,
  //     startDate: timeVal.value[0],
  //     endDate: timeVal.value[1],
  //   });

  formInline.value = {
    ...formInline.value,
    startDate: timeVal.value[0],
    endDate: timeVal.value[1],
  };
  if (type != "del") {
    current.value = 1;
  }
  getTable({
    ...formInline.value,
    pageNum: current.value,
  });
};

const getUserList = () => {
  getUser({}).then((res) => {
    userList.value = res.data;
  });
};
getUserList();
const getTable = (params) => {
  getPicVideo({ ...params }).then((res) => {
    console.log(res);
    res.data.picVideoList.forEach((el, idx) => {
      res.data.picVideoList[idx].filePath =
        baseUrl + "/api/ces/File/download?fileId=" + el.id;
    });
    tableData.value = res.data.picVideoList;
    total.value = res?.data?.count;
    current.value = res.total ? res.total : current.value;
  });
};
const getFlowType = (params) => {
  getPicVideoFlowTypeConfig({ ...params }).then((res) => {
    console.log("getPicVideoFlowTypeConfig", res);
    if (res?.data && res?.data?.length) {
      formInline.value.flowTypeId = res.data[0].id;
      getFlowItem({ FlowTypeID: res.data[0].id });
      flowTypeList.value = res.data;
    }
  });
};
const flowTypeChange = (val) => {
  if (val) {
    flowItemList.value = [];
    getFlowItem({ FlowTypeID: val });
  }
};
getFlowType();
const getFlowItem = (params) => {
  getPicVideoFlowItemConfig({ ...params }).then((res) => {
    flowItemList.value = res.data;
    // console.log(res);
    // if (res?.data && res?.data?.length) {
    //   flowItemList.value = res.data;
    // }
  });
};

const thatOn = (row) => {
  videoName.value = row.name;
  dialogVisible.value = true;
  thatRow.value = row;
};
// const getStationList = (data) => {
//   getStation({ ...data }).then((res) => {
//     console.log("工位：", res.data);
//     stationList.value = res.data;
//   });
// };
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

var delNum = 0;
const setPicVideo = (params) => {
  --delNum;
  //   type: "physical"
  delPicVideo({ id: params.id, type: "logic" }).then((res) => {
    if (delNum == 0) {
      ElMessage({
        message: "删除成功",
        type: "success",
      });
      onSubmit("del");
    }
    let msg = `${user.userName} 在 CES工厂 删除了订单号为： ${
      params.sn
    } 的记录${params.fileType == "image" ? "图片" : "视频"}`;
    addPhysicalDelRecord({ content: msg });
  });
};
const delThat = () => {
  var delList = multipleSelection.value;
  if (delList.length <= 0) {
    ElMessage({
      message: "请选择要删除的图片",
      type: "error",
    });
    return;
  }
  delNum = delList.length;
  if (delList.length > 0) {
    delList.forEach((el) => {
      setPicVideo(el);
    });
  }
};

// getStationList();
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
const download = (file, params) => {
  fetch(file)
    .then((res) => res.blob())
    .then((blob) => {
      let row = fileTypeList.find((item) => params.fileType == item.value);
      //   let row = stationLists.value.find((item) => params.stationID == item.id);
      const elink = document.createElement("a");
      let type = params.fileType == "video" ? ".mp4" : ".jpg";
      elink.download = `${params.flowItemName}-${params.userName}-${params.sn}${type}`;
      elink.style.display = "none";
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    });
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
      width: 100%;
      height: 100%;
      flex-wrap: wrap;

      .el-form-item {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
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
