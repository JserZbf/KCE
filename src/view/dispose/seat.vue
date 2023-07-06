<template>
  <div class="main_seat">
    <div class="search flex0 flex-ac-sb">
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline flex-c-c"
      >
        <el-form-item :label="$t('form.station')">
          <el-input
            v-model="formInline.name"
            :placeholder="$t('form.station')"
            @keyup.enter.native="onSubmit"
          />
        </el-form-item>
        <el-form-item :label="$t('form.line')">
          <el-input
            v-model="formInline.line"
            :placeholder="$t('form.line')"
            @keyup.enter.native="onSubmit"
          />
        </el-form-item>
      </el-form>
      <div>
        <el-button type="success" @click="onExport" round>{{
          $t("form.export")
        }}</el-button>
        <el-button type="primary" @click="onSubmit" round :icon="Search">{{
          $t("form.search")
        }}</el-button>
        <el-button
          type="primary"
          @click="onAdd"
          round
          :icon="Plus"
          v-hasRole="['admin']"
          >{{ $t("form.add") }}</el-button
        >
      </div>
    </div>

    <div class="content flex1">
      <el-table
        :data="stationList"
        style="width: 100%"
        height="100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <!-- <el-table-column label="工序号" prop="index" align="center" /> -->
        <el-table-column label="产线" prop="line" align="center" />
        <el-table-column label="工位" prop="name" align="center" />
        <el-table-column label="排序" prop="index" align="center" />
        <el-table-column label="服务器（IP）" prop="serverIP" align="center" />
        <el-table-column
          label="服务器（端口）"
          prop="serverPort"
          align="center"
        />
        <el-table-column label="盒子名称" prop="boxName" align="center" />
        <el-table-column label="盒子（IP）" prop="boxIP" align="center" />
        <el-table-column label="盒子（端口）" prop="boxPort" align="center" />

        <el-table-column label="摄像头（IP）" prop="cameraIP" align="center" />
        <el-table-column
          label="摄像头（端口）"
          prop="cameraPort"
          align="center"
        />

        <!-- <el-table-column label="服务器（端口）" prop="boxIP" align="center" />
        <el-table-column label="采集网关/ip" prop="boxIP" align="center" />
        <el-table-column label="相机/ip" prop="cameraIP" align="center" />
        <el-table-column label="产线结构" prop="" align="center" /> -->
        <el-table-column label="操作" align="center">
          <!-- <template #default="scope" class="flex-c-c">
            <span :class="scope.row.value ? 'c409EFF' : '#000'">
              {{ scope.row.value ? "启用" : "禁用" }}
            </span>
            <el-switch v-model="scope.row.value" size="large" />
          </template> -->
          <template #default="scope">
            <el-button
              v-hasRole="['admin']"
              link
              type="primary"
              size="small"
              @click.prevent="editChange(scope.row)"
            >
              编辑
            </el-button>

            <el-popconfirm
              title="确认删除？"
              @confirm="removeChange(scope.row)"
            >
              <template #reference>
                <el-button
                  v-hasRole="['admin']"
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

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType ? '新增' : '配置'"
      width="26%"
      align-center
      :append-to-body="true"
    >
      <el-form
        :label-position="labelPosition"
        label-width="120px"
        :rules="rules"
        ref="dialogForm"
        :model="formLabelAlign"
        style="max-width: 460px; padding-right: 20px; box-sizing: border-box"
      >
        <el-form-item :label="$t('form.line')" prop="line">
          <el-input
            v-model="formLabelAlign.line"
            :placeholder="$t('form.line')"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="$t('form.station')" prop="line">
          <el-input
            v-model="formLabelAlign.name"
            :placeholder="$t('form.station')"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="$t('form.sort')">
          <el-input-number v-model="formLabelAlign.index" :min="1" />
        </el-form-item>

        <el-form-item :label="$t('form.boxName')" prop="boxName">
          <el-input
            v-model="formLabelAlign.boxName"
            :placeholder="$t('form.boxName')"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item :label="$t('form.boxIP')" prop="boxIP">
          <el-input
            v-model="formLabelAlign.boxIP"
            :placeholder="$t('form.boxIP')"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="$t('form.boxPort')" prop="boxPort">
          <el-input
            v-model="formLabelAlign.boxPort"
            :placeholder="$t('form.boxPort')"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item :label="$t('form.cameraIP')" prop="cameraIP">
          <el-input
            v-model="formLabelAlign.cameraIP"
            :placeholder="$t('form.cameraIP')"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="$t('form.cameraPort')" prop="cameraIP">
          <el-input
            v-model="formLabelAlign.cameraPort"
            :placeholder="$t('form.cameraPort')"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item :label="$t('form.serverIP')" prop="serverIP">
          <el-input
            v-model="formLabelAlign.serverIP"
            :placeholder="$t('form.serverIP')"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item :label="$t('form.serverPort')" prop="serverPort">
          <el-input
            v-model="formLabelAlign.serverPort"
            :placeholder="$t('form.serverPort')"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="(dialogVisible = false), (dialogType = false)">{{
            $t("form.btn.cancel")
          }}</el-button>
          <el-button
            type="primary"
            @click="dialogTrueChange"
            :disabled="setForm"
          >
            {{ $t("form.btn.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Search, Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { getStation, addStation, delStation, putStation } from "@/api/seat";
import { getUser } from "@/api/user";
import * as XLSX from "xlsx";

const user = JSON.parse(localStorage.getItem("$user"));
const stationList = ref([]); // 工位
const userList = ref([]); // 用户
const dialogType = ref(false); // 新增or修改
const formModal = ref({}); // 编辑项
const setForm = ref(false);
const labelPosition = ref("right");
const multipleSelection = ref([]);
const dialogForm = ref(null);
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const formInline = reactive({
  name: "",
});

const onSubmit = () => {
  getStationList({ ...formInline });
};
const onExport = () => {
  const data = XLSX.utils.json_to_sheet(stationList.value); //此处tableData.value为表格的数据
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, data, "工位配置"); //test-data为自定义的sheet表名
  XLSX.writeFile(wb, "工位配置.xlsx"); //test.xlsx为自定义的文件名
};

const formLabelAlign = ref({
  line: "",
  name: "",
  boxIP: "",
  boxPort: 8000,
  boxName: "",
  cameraIP: "",
  cameraPort: 8000,
  serverIP: "10.106.21.10",
  serverPort: 8091,
  userID: "",
  index: 1,
});
const rules = ref({
  line: [{ required: true, message: t("form.line"), trigger: "blur" }],
  name: [{ required: true, message: t("form.station"), trigger: "blur" }],

  boxIP: [{ required: true, message: t("form.boxIP"), trigger: "blur" }],
  // boxPort: [{ required: true, message: "请输入盒子端口", trigger: "blur" }],
  cameraIP: [{ required: true, message: t("form.cameraIP"), trigger: "blur" }],
  cameraPort: [
    { required: true, message: t("form.cameraPort"), trigger: "blur" },
  ],

  // index: [{ required: true, message: "请输入序号", trigger: "blur" }],
});
const dialogVisible = ref(false);
const deleteRow = (idx) => {
  dialogVisible.value = true;
  formLabelAlign.value = stationList.value[[idx]];
};
const onAdd = () => {
  dialogType.value = true;
  dialogVisible.value = true;
  formLabelAlign.value = {
    line: "CCA3",
    name: "CCA3-OP",
    boxIP: "192.168.1.10",
    boxPort: 8000,
    boxName: "CCA3-OP",
    cameraIP: "10.100.254.133",
    cameraPort: "820",
    serverIP: "10.106.21.10",
    serverPort: 8091,
    userID: "",
    index: 1,
  };
};
const dialogTrueChange = () => {
  if (!dialogForm) return;
  dialogForm.value.validate((valid) => {
    if (valid) {
      if (dialogType.value) {
        addStation({
          ...formLabelAlign.value,
          //   boxName: `${formLabelAlign.value.line}-${formLabelAlign.value.name}`,
        }).then((res) => {
          ElMessage({
            message: t("msg.add"),
            type: "success",
          });
          dialogVisible.value = false;
          getStationList();
        });
      } else {
        putStation([{ ...formLabelAlign.value }]).then((res) => {
          ElMessage({
            message: t("msg.update"),
            type: "success",
          });
          dialogVisible.value = false;
          getStationList();
        });
      }
    } else {
      return false;
    }
  });

  // setForm.value = true;
  // if (dialogType.value) {
  //   stationList.value.push({ ...formLabelAlign.value, value: 1 });
  //   formLabelAlign.value = {
  //     name: "",
  //     region: "",
  //     type: "",
  //   };
  // }
  // setTimeout(function () {
  //   setForm.value = false;
  // }, 2000);
  // dialogType.value = false;
  // dialogVisible.value = false;
};
const delThat = () => {
  stationList.value.forEach((el, idx) => {
    multipleSelection.value.forEach((ele) => {
      if (el.date === ele.date) {
        stationList.value.splice(idx, 1);
      }
    });
  });
};
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};
// ====================================================
// 删除
const removeChange = (item) => {
  delStation({ id: item.id, userID: user.id }).then((res) => {
    ElMessage({
      message: t("msg.del"),
      type: "success",
    });
    getStationList();
  });
};
// 编辑
const editChange = (item) => {
  dialogVisible.value = true;
  dialogType.value = false;
  formLabelAlign.value = JSON.parse(JSON.stringify(item));
  formLabelAlign.value.userID = user.id;
};
const getUserList = (data) => {
  getUser({ ...data }).then((res) => {
    console.log("用户：", res.data);
    userList.value = res.data;
  });
};
const getStationList = (data) => {
  getStation({ ...data }).then((res) => {
    console.log("工位：", res.data);
    stationList.value = res.data;
  });
};
getUserList();
getStationList({});
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
