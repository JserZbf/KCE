<template>
  <div class="main_seat">
    <div class="search flex0 flex-ac-sb">
      <!-- <el-form
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
      </el-form> -->
      <div></div>
      <div class="flex">
        <el-button type="primary" @click="onSubmit" round :icon="Search">{{
          $t("form.search")
        }}</el-button>

        <el-button type="primary" @click="onAdd" round :icon="Plus">{{
          $t("form.add")
        }}</el-button>
      </div>
    </div>

    <div class="content flex1">
      <div class="headStorage">
        <div class="card w100">服务器存储状态：{{ storage }}</div>
      </div>
      <el-table
        :data="tableData"
        :border="parentBorder"
        style="width: 100%; height: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" /> -->
        <el-table-column type="expand">
          <template #default="{ row }">
            <ul class="infinite-list">
              <li
                v-for="(item, idx) in row.mailList"
                :key="idx"
                class="infinite-list-item"
              >
                {{ item }}
              </li>
            </ul>
          </template>
        </el-table-column>

        <el-table-column
          type="index"
          :label="$t('table.idx')"
          align="center"
          width="55"
        />
        <el-table-column :label="$t('table.factory')" prop="sn" align="center">
          <template #default="{ row }">
            {{ row.content.factory }}
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('table.threshold')"
          prop="sn"
          align="center"
        >
          <template #default="{ row }">
            {{ row.content.threshold }}
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('table.frequency')"
          prop="sn"
          align="center"
        >
          <template #default="{ row }">
            {{ row.frequency }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('table.lasttime')" prop="sn" align="center">
          <template #default="{ row }">
            {{ dateFormat("YYYY-mm-dd HH:MM:SS", new Date(row.lastTime)) }}
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

        <el-table-column width="100px" label="编辑" align="center">
          <template #default="scope">
            <el-button
              v-hasRole="['admin', 'superCES']"
              link
              type="primary"
              size="small"
              @click.prevent="editChange(scope.row, scope.$index)"
            >
              编辑
            </el-button>

            <el-popconfirm
              title="确认删除？"
              @confirm="removeChange(scope.row, scope.$index)"
            >
              <template #reference>
                <el-button
                  v-hasRole="['admin', 'superCES']"
                  link
                  type="danger"
                  size="small"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- <div class="footPage flex0 flex-ac-sb">
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
    </div> -->

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType ? '新增' : '配置'"
      width="36%"
      align-center
      :append-to-body="true"
    >
      <el-form
        ref="dialogForm"
        :label-position="labelPosition"
        label-width="120px"
        :model="formModal"
        :rules="rulesModal"
        style="padding-right: 40px; box-sizing: border-box"
      >
        <el-form-item :label="$t('table.factory')" prop="factory">
          <el-input
            style="width: 340px"
            v-model="formModal.factory"
            :placeholder="$t('table.factory')"
          />
        </el-form-item>

        <el-form-item :label="$t('table.threshold')" prop="threshold">
          <!-- <el-input
            style="width: 340px"
            v-model="formModal.threshold"
            :placeholder="$t('table.threshold')"
          /> -->
          <el-input-number v-model="formModal.threshold" :min="1" :max="10" :step="1" />
        </el-form-item>

        <el-form-item :label="$t('table.frequency')" prop="frequency">
          <!-- <el-input
            style="width: 340px"
            v-model="formModal.frequency"
            :placeholder="$t('table.frequency')"
          /> -->
          <el-input-number v-model="formModal.frequency" :min="1" :max="24" :step="1" />

        </el-form-item>

        <el-form-item
          :label="$t('table.email')"
          v-for="(val, idx) in formModal.mailList"
          :key="idx"
        >
          <div class="flex-ac">
            <el-input
              class="w100"
              style="width: calc(width: 340px - 100px)"
              v-model="formModal.mailList[idx]"
              :placeholder="$t('table.email')"
            />

            <div class="flex-ac-sb" style="width: 100px">
              <el-button
                v-if="formModal.mailList.length - 1 == idx"
                v-hasRole="['admin', 'superCES']"
                link
                type="primary"
                size="small"
                @click="addEmail()"
              >
                新增
              </el-button>
              <el-popconfirm title="确认删除？" @confirm="removeEmail(idx)">
                <template #reference>
                  <el-button
                    v-hasRole="['admin', 'superCES']"
                    link
                    type="danger"
                    size="small"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="(dialogVisible = false), (dialogType = false)"
            >取消</el-button
          >
          <el-button
            type="primary"
            @click="dialogTrueChange"
            :disabled="setForm"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Search, Plus } from "@element-plus/icons-vue";
import { Picture as IconPicture } from "@element-plus/icons-vue";
import { getList, addNotify, delNotify, putNotify } from "@/api/notification";
import { getImg } from "@/api/upload";
import { getStation } from "@/api/seat";
import { ElMessage } from "element-plus";
import { baseUrl } from "@/utils/baseUrl";
// import { CCAList } from "@/config/config";
import { addPhysicalDelRecord } from "@/api/ladder";
import { useI18n } from "vue-i18n";
// const { t } = useI18n();

const tableData = ref([]);
const formInline = ref({ status: "已完成", stationID: "" });
const timeVal = ref([]);
const dialogVisible = ref(false);
const current = ref(1);
const dialogType = ref(false);
const storage = ref("");
const formModal = ref({
  factory: "",
  threshold: "",
  type: "",
  content: { factory: "", threshold: "" },
  mailList: [""],
  frequency: 24,
  lastTime: "",
});
const rulesModal = ref({
  factory: [{ required: true, message: "请输入工厂", trigger: "blur" }],
  threshold: [{ required: true, message: "请输入报警年限", trigger: "blur" }],
  frequency: [{ required: true, message: "请输入检查频率", trigger: "blur" }],
});
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

const editChange = (item, idx) => {
  dialogVisible.value = true;
  dialogType.value = false;
  formModal.value = JSON.parse(JSON.stringify({ ...item, ...item.content }));
  formModal.value.userID = user.id;
};
const removeChange = (item) => {
  delNotify({ id: item.id, userID: user.id }).then((res) => {
    ElMessage({
      message: "删除成功",
      type: "success",
    });
    getTable();
  });
};
const addEmail = () => {
  formModal.value.mailList.push("");
};
const removeEmail = (idx) => {
  formModal.value.mailList.splice(idx, 1);
};
const getTable = (params) => {
  getList({}).then((res) => {
    res?.data?.forEach((el, idx) => {
      res.data[idx].content = JSON.parse(el.content);
      res.data[idx].mailList = JSON.parse(el.mailList);
    });
    console.log(res.data);
    tableData.value = res?.data;
  });
};
const onAdd = () => {
  dialogVisible.value = true;
  dialogType.value = true;
  formModal.value.userID = user.id;
  formModal.value = {
    ...formModal.value,
    factory: "",
    threshold: "",
    type: "",
    content: { factory: "", threshold: "" },
    mailList: [""],
    frequency: 24,
    lastTime: "",
  };
  //   tisImg({configID:});
};
const dialogForm = ref(null);
const dialogTrueChange = () => {
  if (!dialogForm) return;
  dialogForm.value.validate((valid) => {
    if (valid) {
      if (dialogType.value) {
        let params = {
          ...formModal.value,
          content: JSON.stringify({
            factory: formModal.value.factory,
            threshold: formModal.value.threshold,
          }),
          mailList: JSON.stringify(formModal.value.mailList),
          factory: undefined,
          threshold: undefined,
        };
        addNotify(params).then((res) => {
          ElMessage({
            message: "新增成功",
            type: "success",
          });
          dialogVisible.value = false;
          getTable();
        });
      } else {
        let params = {
          ...formModal.value,
          content: JSON.stringify({
            factory: formModal.value.factory,
            threshold: formModal.value.threshold,
          }),
          mailList: JSON.stringify(formModal.value.mailList),
          factory: undefined,
          threshold: undefined,
        };
        putNotify([params]).then((res) => {
          ElMessage({
            message: "修改成功",
            type: "success",
          });
          dialogVisible.value = false;
          getTable();
        });
      }
    } else {
      return false;
    }
  });
};
const getNotify = () => {
  getList({ type: "storage" }).then((res) => {
    console.log("服务器：", res.data);
    storage.value = res.data;
  });
};
getNotify();
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
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
// getStationList({}, "original");
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
    .headStorage {
      padding: 24px;
      box-sizing: border-box;
      .w100 {
        width: 100%;
        text-align: left;
        border-radius: 12px;
      }
    }

    :deep(.el-table) {
      .el-table__cell {
        //解决层级穿透 使得 子元素不与其产生新的层叠关系
        position: static;
      }
    }

    .infinite-list {
      //   height: 300px;
      padding: 0;
      margin: 0;
      list-style: none;
    }
    .infinite-list .infinite-list-item {
      display: flex;
      align-items: center;
      //   justify-content: center;
      //   height: 0px;
      background: var(--el-color-primary-light-9);
      margin: 10px;
      //   color: var(--el-color-primary);
      padding: 12px;
      box-sizing: border-box;
      border-radius: 4px;
    }
    .infinite-list .infinite-list-item + .list-item {
      margin-top: 10px;
    }
  }
  .search {
    width: 100%;
    // margin-bottom: 26px;
    border-bottom: 1px solid #eee;
    padding: 27px 0 8px 0;

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
