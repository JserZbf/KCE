<template>
  <!-- <div class="main font40">{{ $t(`dashboard.txt`) }}:{{ user.userName }}</div> -->
  <div class="main">
    <el-form
      ref="ruleFormRef"
      role="formRole"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item :label="$t('form.factory')" prop="factory">
        <el-select
          clearable
          v-model="ruleForm.factory"
          :placeholder="$t('form.factory')"
          @change="stationChange"
        >
          <el-option
            v-for="(item, idx) in factoryList"
            :disabled="user.role != item.role && user.role != 'admin'"
            :key="idx"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="选择时间" required>
        <el-col :span="8">
          <el-tooltip placement="bottom">
            <template #content> 只能选择{{ yearNum }}年之前的时间 </template>
            <el-form-item prop="date">
              <el-date-picker
                style="width: 340px"
                v-model="ruleForm.date"
                :default-value="defaultTime"
                :disabled-date="disabledDate"
                :shortcuts="shortcuts"
                type="datetimerange"
                :range-separator="$t('form.to')"
                :start-placeholder="$t('form.startTime')"
                :end-placeholder="$t('form.endTime')"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-tooltip>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm()"> 查询确认 </el-button>
        <el-button
          @click="delBtn"
          type="danger"
          v-hasRole="['admin', 'superCES', 'superCCA', 'superCEP']"
          >{{ $t("form.del") }}</el-button
        >
        <!-- <el-popconfirm :title="$t('msg.delMsg')" @confirm="delThat()">
          <template #reference>
           
          </template>
        </el-popconfirm> -->
      </el-form-item>
    </el-form>

    <div class="content flex1" v-if="tableData.length != 0">
      <el-table
        class="flex1"
        :data="tableData"
        :border="parentBorder"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="55" /> -->
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
        <!-- <el-table-column :label="$t('table.line')" prop="line" align="center" /> -->
        <!-- <el-table-column :label="$t('table.station')" align="center">
          <template #default="{ row }">
            {{ stationLists.find((item) => row.stationID == item.id)?.name }}
          </template>
        </el-table-column> -->
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

        <!-- <el-table-column :label="$t('table.state')" align="center">
          <template #default="{ row }">
            <el-tag class="ml-2" type="success" v-if="row.status === '已完成'"
              >已完成</el-tag
            >
            <el-tag class="ml-2" type="danger" v-if="row.status === '拍照失败'"
              >拍照失败</el-tag
            >
          </template>
        </el-table-column> -->
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

      <div class="footPage flex0 flex-ac-sb">
        <div></div>
        <el-pagination
          background
          :page-size="20"
          @current-change="selectSize"
          v-model:current-page="current"
          :total="total"
          layout="total, prev, pager, next"
        />
      </div>
    </div>

    <el-dialog
      v-model="showDel"
      title="确认删除"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <span>确认删除这些数据吗，删除后无法恢复！</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDel = false">取消</el-button>
          <el-button type="danger" @click="delThat()" :disabled="delNum">
            确认 <span v-if="delNum != 0">{{ delNum + "秒" }}</span>
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
// data-server
import { ref, reactive } from "vue";
import { factoryList } from "@/config/config";
import { getStation } from "@/api/seat";
import {
  get_cca,
  get_ces,
  get_cep,
  del_cca,
  del_ces,
  del_cep,
} from "@/api/monitor";
import { getList } from "@/api/notification";

import { baseUrl } from "@/utils/baseUrl";
import { ElMessage } from "element-plus";
const user = ref(JSON.parse(localStorage.getItem("$user")));
let yearNum = reactive(4);
const defaultTime = ref([
  Date.now() - 3600 * 1000 * 24 * 365 * yearNum,
  Date.now() - 3600 * 1000 * 24 * 365 * yearNum,
]);
const disabledDate = (time) => {
  return time.getTime() + 31536000000 * yearNum > Date.now() - 8.64e7;
};

const shortcuts = ref([
  {
    text: "全部",
    value: () => {
      const end = new Date();
      const start = new Date("2000-01-01 00:00:00");
      start.setTime(start.getTime());
      end.setTime(end.getTime() - 3600 * 1000 * 24 * 365 * yearNum);
      return [start, end];
    },
  },
  {
    text: yearNum + "年前",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * (yearNum * 2));
      end.setTime(end.getTime() - 3600 * 1000 * 24 * 365 * yearNum);
      return [start, end];
    },
  },
]);
// const timeChenge = () => {
//   if (!this.value3) {
//     this.timeDefaultShow = new Date();
//     this.timeDefaultShow.setDate(new Date().getDate() + 1);
//     this.value3 = this.timeDefaultShow;
//   }
// };
//   const RuleForm = ref({
//     name: "",
//     region: "",
//     count: "",
//     date1: "",
//     date2: "",
//     delivery: false,
//     type: [],
//     resource: "",
//     desc: "",
//   })

const formSize = ref("default");
const ruleFormRef = ref(null);
const formRole = ref(null);
const LineList = ref([]);
const stationList = ref([]); // 工位
const stationLists = ref([]); // 工位
const tableData = ref([]);
const current = ref(1);
const pageSize = ref(1);
const total = ref(0);
const delNum = ref(10);
const showDel = ref(false);
const thatType = ref(null);

const timeRule = (rule, value, callback) => {
  console.log(value);
  if (!value?.length) {
    return callback(new Error("请选择日期范围"));
  }
  callback();
};
const ruleForm = ref({
  factory: "",
  line: "",
  date: [],
});

const rules = ref({
  factory: [
    {
      required: true,
      message: "请选择工厂",
      trigger: "change",
    },
  ],
  date: [
    {
      validator: timeRule,
      trigger: "blur",
    },
  ],
});
const yearNumList = ref([]);
const getYear = () => {
  getList({}).then((res) => {
    var arr = [];
    res?.data?.forEach((el, idx) => {
      res.data[idx].content = JSON.parse(el.content);
      //   res.data[idx].mailList = JSON.parse(el.mailList);
      arr.push({
        factory: el.content.factory,
        year: el.content.threshold,
      });
    });
    console.log(arr);
    yearNumList.value = arr;
  });
};
getYear();
const dataArrange = (res, type) => {
  if (type) {
    res.data.picList = res.data.picVideoList;
  }
  total.value = res?.data?.count;
  if (res?.data?.count == 0) {
    ElMessage({
      message: "未查到数据",
      type: "error",
    });
    return;
  }
  res.data.picList.forEach((el, idx) => {
    res.data.picList[idx].filePath =
      baseUrl + "/api/ces/File/download?fileId=" + el.id;
  });
  tableData.value = [];
  tableData.value = res?.data?.picList;
  total.value = res?.data?.count;
  current.value = res.total ? res.total : current.value;
  console.log(tableData.value);
};
const selectSize = (num) => {
  current.value = num;
  getTable({ ...ruleForm.value, pageNum: current.value }, thatType.value);
};
const getTable = (params, type) => {
  params.line = type;
  thatType.value = type;
  console.log(type);
  if (type == "CCA") {
    get_cca({
      line: "CCA",
      startDate: ruleForm.value.date[0],
      endDate: ruleForm.value.date[1],
      pageNum: current.value,
    }).then((res) => {
      dataArrange(res);
    });
  } else if (type == "CES") {
    get_ces({
      line: "CES",
      startDate: ruleForm.value.date[0],
      endDate: ruleForm.value.date[1],
      pageNum: current.value,
    }).then((res) => {
      dataArrange(res, "ces");
    });
  } else if (type == "CEP") {
    get_cep({
      line: "KCE",
      startDate: ruleForm.value.date[0],
      endDate: ruleForm.value.date[1],
      pageNum: current.value,
    }).then((res) => {
      dataArrange(res);
    });
  }
};

const submitForm = () => {
  if (!ruleFormRef) return;
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      if (ruleFormRef.value) {
        console.log(user.value.role);
        thatType.value = ruleForm.value.factory.toUpperCase();
        let type = thatType.value;
        if (user.value.role == "superCCA") {
          getTable(ruleForm.value, "CCA");
        } else if (user.value.role == "superCES") {
          getTable(ruleForm.value, "CES");
        } else if (user.value.role == "superCEP") {
          getTable(ruleForm.value, "CEP");
        }
        if (user.value.role === "admin") {
          getTable(ruleForm.value, type);
        }
      }
    } else {
      return false;
    }
  });
};
const delThat = (params) => {
  if (!ruleFormRef) return;
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      if (ruleFormRef.value) {
        let type = thatType.value;
        if (type == "CCA") {
          del_cca({
            factory: "cca",
            startDate: new Date(ruleForm.value.date[0]),
            endDate: new Date(ruleForm.value.date[1]),
            type: "physical",
          }).then((res) => {
            ElMessage({
              message: "删除成功",
              type: "success",
            });
          });
        } else if (type == "CES") {
          del_ces({
            factory: "ces",
            startDate: new Date(ruleForm.value.date[0]),
            endDate: new Date(ruleForm.value.date[1]),
            type: "physical",
          }).then((res) => {
            ElMessage({
              message: "删除成功",
              type: "success",
            });
          });
        } else if (type == "CEP") {
          del_cep({
            factory: "cep",
            startDate: new Date(ruleForm.value.date[0]),
            endDate: new Date(ruleForm.value.date[1]),
            type: "physical",
          }).then((res) => {
            ElMessage({
              message: "删除成功",
              type: "success",
            });
          });
        }
      }
    } else {
      return false;
    }
  });
};

const delTimeout = () => {
  if (delNum.value === 0) {
    return;
  } else {
    setTimeout(function () {
      --delNum.value;
      delTimeout();
    }, 1000);
  }
};

const delBtn = () => {
  if (!ruleFormRef) return;
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      if (ruleFormRef.value) {
        if (total.value == 0) {
          ElMessage({
            message: "要删除的数据为空",
            type: "error",
          });
          return;
        }
        delNum.value = 10;
        showDel.value = true;
        console.log(showDel.value);
        delTimeout();
      }
    } else {
      return false;
    }
  });
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

// const getStationList = (data, type) => {
//   console.log("---->");
//   getStation({
//     ...data,
//     line: ruleForm.value.factory,
//   }).then((res) => {
//     console.log("工位：", res.data);
//     stationList.value = res.data;
//     if (type) {
//       let arr = [];
//       res.data.forEach((el) => {
//         if (!arr.includes(el.line)) {
//           arr.push(el.line);
//         }
//       });
//       LineList.value = arr;
//       stationLists.value = res.data;
//     }
//   });
// };
// getStationList({}, "original");
const stationChange = (val) => {
  thatType.value = val;
  let info = yearNumList.value.find((el) => el.factory == val) || 4;
  yearNum = info.year || 4;
  shortcuts.value = [
    {
      text: "全部",
      value: () => {
        const end = new Date();
        const start = new Date("2000-01-01 00:00:00");
        start.setTime(start.getTime());
        end.setTime(end.getTime() - 3600 * 1000 * 24 * 365 * yearNum);
        return [start, end];
      },
    },
    {
      text: yearNum + "年前",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * (yearNum * 2));
        end.setTime(end.getTime() - 3600 * 1000 * 24 * 365 * yearNum);
        return [start, end];
      },
    },
  ];
  ruleForm.value.date = [];
  console.log(yearNum);
};
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  text-align: left;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    & > .flex1 {
      margin-bottom: 10px;
    }
  }
}
</style>
