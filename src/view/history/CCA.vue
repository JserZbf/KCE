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

        <el-form-item :label="$t('form.line')">
          <el-select
            clearable
            style="width: 180px"
            v-model="formInline.line"
            :placeholder="$t('form.line')"
            filterable
            :filter-method="dataFilter"
            @change="stationChange"
          >
            <el-option
              v-for="(item, i) in CCAList"
              :key="i"
              :label="item"
              :value="item"
            />
          </el-select>

          <!-- <el-input
              style="width: 180px"
              v-model="formInline.line"
              placeholder="输入产线"
              @input="lineChange"
              @keyup.enter.native="onSubmit"
            /> -->
        </el-form-item>
        <el-form-item :label="$t('form.station')">
          <el-select
            clearable
            style="width: 180px"
            v-model="formInline.stationID"
            :placeholder="$t('form.station')"
            filterable
            :filter-method="dataFilter"
          >
            <!-- <el-option label="" value="" /> -->
            <el-option
              v-for="(item, i) in stationList"
              :key="i"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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
        <el-form-item :label="$t('form.state')">
          <el-select
            style="width: 180px"
            v-model="formInline.status"
            :placeholder="$t('form.state')"
          >
            <el-option label="全部" value="" />
            <el-option label="已完成" value="已完成" />
            <el-option label="拍照失败" value="拍照失败" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="">
              <el-button type="primary" @click="onSubmit" round :icon="Search"
            >搜索</el-button
          >
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
        <el-table-column :label="$t('table.line')" prop="line" align="center" />
        <el-table-column :label="$t('table.station')" align="center">
          <template #default="{ row }">
            {{ stationLists.find((item) => row.stationID == item.id)?.name }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.fileView')" align="center">
          <template #default="{ row }">
            <el-image
              style="width: 100px; height: 60px"
              :src="row.filePath"
              :preview-src-list="[row.filePath]"
            >
              <template #error>
                <div class="flex-c-c" style="width: 20px; height: 20px">
                  <el-icon><icon-picture /></el-icon>
                </div>
              </template>
            </el-image>
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

        <el-table-column :label="$t('table.state')" align="center">
          <template #default="{ row }">
            <el-tag class="ml-2" type="success" v-if="row.status === '已完成'"
              >已完成</el-tag
            >
            <el-tag class="ml-2" type="danger" v-if="row.status === '拍照失败'"
              >拍照失败</el-tag
            >
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
      <el-popconfirm :title="$t('msg.delMsg')" @confirm="delThat">
        <template #reference>
          <el-button type="primary" v-hasRole="['admin']" plain>{{
            $t("form.del")
          }}</el-button>
        </template>
      </el-popconfirm>

      <el-pagination
        background
        :page-size="20"
        @current-change="selectSize"
        v-model:current-page="current"
        :total="total"
        layout="total, prev, pager, next"
      />
    </div>

    <el-dialog v-model="dialogVisible" title="video" width="40%">
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
import { Picture as IconPicture } from "@element-plus/icons-vue";
import { getPic, delPic } from "@/api/cca";
import { getImg } from "@/api/upload";
import { getStation } from "@/api/seat";
import { ElMessage } from "element-plus";
import { baseUrl } from "@/utils/baseUrl";
// import { CCAList } from "@/config/config";
import { addPhysicalDelRecord } from "@/api/ladder";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const CCAList = ref([]);
const tableData = ref([]);
const formInline = ref({ status: "已完成", stationID: "" });
const timeVal = ref([]);
const dialogVisible = ref(false);
const thatRow = ref({});
const stationList = ref([]); // 工位
const stationLists = ref([]); // 工位
const current = ref(1);
const pageSize = ref(1);
const total = ref(0);
var user = JSON.parse(localStorage.getItem("$user"));

const onSubmit = (type) => {
  console.log(timeVal.value);
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

const download = (file, params) => {
  fetch(file)
    .then((res) => res.blob())
    .then((blob) => {
      let row = stationLists.value.find((item) => params.stationID == item.id);
      const elink = document.createElement("a");
      elink.download = `${params.line}-${row.name}-${params.sn}.jpg`;
      elink.style.display = "none";
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    });
};

// setInterval(() => {
//   formInline.value = {
//     ...formInline.value,
//     startDate: timeVal.value[0],
//     endDate: timeVal.value[1],
//   };
//   //   current.value = 1;
//   getTable({
//     ...formInline.value,
//     pageNum: current.value,
//   });
// }, 3000);
const getItemImg = (params) => {
  getImg(params).then((res) => {
    console.log(res);
  });
};

// const dataFilter = (val) => {
//   console.log(val);
//   formInline.value.stationID = val?val:formInline.value.stationID;
//   if (val) {
//     stationLists.value = stationList.value.filter((item) => {
//       if (
//         !!~item.line.indexOf(val) ||
//         !!~item.line.toUpperCase().indexOf(val.toUpperCase())
//       ) {
//         return true;
//       }
//     });
//   } else {
//     stationLists.value = stationList.value;
//   }
// };

// const lineChange = (ev) => {
//   //   formInline.value.stationID = ev;
//   let newArr = [];
//   stationList.value.forEach((el) => {
//     if (
//       !!~el.line.indexOf(ev) ||
//       !!~el.line.toUpperCase().indexOf(ev.toUpperCase())
//     ) {
//       newArr.push(el);
//     }
//   });
//   if (newArr.length > 0) {
//     stationLists.value = newArr;
//   } else {
//     stationLists.value = stationList.value;
//   }
//   //   dataFilter(ev)
// };

const getTable = (params) => {
  if (!params.line) {
    params.line = "CCA";
  }
  getPic({ status: "已完成", line: "CCA", ...params }).then((res) => {
    console.log(res);
    res.data.picList.forEach((el, idx) => {
      //   res.data.picList[idx].filePath = el.filePath.replace(
      //     "http://58.211.121.58:81",
      //     "http://192.168.204.11"
      //   );
      // getItemImg({fileId:el.id})
      res.data.picList[idx].filePath =
        baseUrl + "/api/ces/File/download?fileId=" + el.id;

      // console.log(el.filePath.replace("http://58.211.121.58:81","http://192.168.204.11"));
    });

    tableData.value = res?.data?.picList;
    total.value = res?.data?.count;
    current.value = res.total ? res.total : current.value;
  });
};
// const thatOn = (row) => {
//   dialogVisible.value = true;
//   thatRow.value = row;
// };
const getStationList = (data, type) => {
  getStation({
    ...data,
    line: formInline.value.line ? formInline.value.line : "CCA",
  }).then((res) => {
    console.log("工位：", res.data);
    stationList.value = res.data;
    if (type) {
      let arr = [];
      res.data.forEach((el) => {
        if (!arr.includes(el.line)) {
          arr.push(el.line);
        }
      });
      CCAList.value = arr;
      stationLists.value = res.data;
    }
  });
};
const stationChange = (val) => {
  getStationList();
};
const selectSize = (num) => {
  current.value = num;
  getTable({ ...formInline.value, pageNum: current.value });
};

const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

var delNum = 0;
const setPicVideo = (params) => {
  --delNum;
  //   type: "physical"
  delPic({ id: params.id, type: "logic" }).then((res) => {
    if (delNum == 0) {
      ElMessage({
        message: "删除成功",
        type: "success",
      });
      onSubmit("del");
    }
    let msg = `${user.userName} 在 CCA工厂 删除了订单号为： ${params.sn} 的记录图片`;
    addPhysicalDelRecord({ content: msg });
  });
  //   if (delNum == multipleSelection.value.length) {
  //     onSubmit();
  //   }
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
getStationList({}, "original");
getTable({});
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
    padding: 27px 0 0 0;

    .demo-form-inline {
      //   display: flex;
      //   align-items: center;
      width: 100%;
      height: 100%;
      flex-wrap: wrap;
      .el-form-item {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        //   .el-range-editor.el-input__wrapper{
        //     background: #eee !important;
        //   }
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
