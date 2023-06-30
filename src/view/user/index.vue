<template>
  <div class="main_seat">
    <div class="search flex0 flex-ac-sb">
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline flex-c-c"
      >
        <el-form-item :label="$t('form.userName')">
          <el-input
            v-model="formInline.userName"
            :placeholder="$t('form.userName')"
            @keyup.enter.native="onSubmit"
          />
        </el-form-item>
      </el-form>
      <div>
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
        :data="tableData"
        style="width: 100%"
        height="100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="index"
          :label="$t('table.idx')"
          width="85"
          align="center"
        />
        <el-table-column
          :label="$t('table.userName')"
          prop="userName"
          align="center"
        />
        <el-table-column
          :label="$t('table.work')"
          prop="workID"
          align="center"
        />
        <el-table-column :label="$t('table.role')" prop="role" align="center">
          <template #default="{ row }">
            {{ roleList.find((item) => item.value == row.role).label }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.createUser')"
          prop="createTime"
          align="center"
        >
          <template #default="{ row }">
            {{ tableData.find(item=>item.id == row.createUserID)?.userName }}
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
        <el-table-column
          :label="$t('table.operate')"
          align="center"
        >
          <template #default="{ row }">
            <el-button
              v-hasRole="['admin']"
              type="primary"
              link
              @click="onUpdatePas(row)"
              >{{ $t("table.updatePas") }}</el-button
            >
            <el-popconfirm :title="$t('msg.rPas')" @confirm="onResetting(row)">
              <template #reference>
                <el-button v-hasRole="['admin']" type="danger" link>{{
                  $t("table.rPas")
                }}</el-button>
              </template>
            </el-popconfirm>

            <el-button
              type="primary"
              v-hasRole="['admin']"
              link
              @click="onUpdate(row)"
              >{{ $t("table.update") }}</el-button
            >
            <el-popconfirm :title="$t('msg.isDel')" @confirm="ondel(row)">
              <template #reference>
                <el-button v-hasRole="['admin']" type="danger" link>{{
                  $t("table.del")
                }}</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- <div class="footPage flex0 flex-ac-sb">
      <div></div>
      <el-pagination
        background
        :total="1000"
        layout="total, prev, pager, next"
      />
    </div> -->
    <el-dialog
      v-model="isUpdatePawShow"
      :title="$t('form.updatePas')"
      width="30%"
      align-center
      :append-to-body="true"
    >
      <el-form
        ref="updatePasRef"
        label-width="120px"
        :model="updatePas"
        :rules="updatePasRules"
        style="max-width: 460px; padding-right: 90px; box-sizing: border-box"
      >
        <el-form-item :label="$t('form.oldPas')" prop="oldPassword">
          <el-input v-model="updatePas.oldPassword" />
        </el-form-item>

        <el-form-item :label="$t('form.newPas')" prop="newPassword">
          <el-input v-model="updatePas.newPassword" />
        </el-form-item>

        <el-form-item :label="$t('form.affirmPas')" prop="affirmPassword">
          <el-input v-model="updatePas.affirmPassword" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isUpdatePawShow = false">{{
            $t("form.btn.cancel")
          }}</el-button>
          <el-button
            type="primary"
            @click="upDatePas(ruleFormRef)"
            :disabled="setForm"
          >
            {{ $t("form.btn.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType ? $t('form.add') : $t('form.update')"
      width="30%"
      align-center
      :append-to-body="true"
    >
      <el-form
        ref="ruleFormRef"
        :label-position="labelPosition"
        label-width="120px"
        :model="formLabelAlign"
        :rules="rules"
        style="max-width: 460px; padding-right: 90px; box-sizing: border-box"
      >
        <el-form-item :label="$t('form.userName')" prop="userName">
          <el-input v-model="formLabelAlign.userName" />
        </el-form-item>
        <el-form-item
          :label="$t('form.pasw')"
          prop="password"
          v-if="dialogType"
        >
          <el-input v-model="formLabelAlign.password" />
        </el-form-item>
        <el-form-item :label="$t('form.work')">
          <el-input v-model="formLabelAlign.workID" />
        </el-form-item>
        <!-- <el-form-item label="工位" prop="workID">
          <el-select
            style="width: 100%"
            v-model="formLabelAlign.workID"
            placeholder="选择用户"
          >
            <el-option
              v-for="(item, i) in stationList"
              :key="i"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item :label="$t('form.role')" prop="role">
          <el-select
            v-model="formLabelAlign.role"
            :placeholder="$t('form.role')"
          >
            <el-option
              v-for="(item, idx) in roleList"
              :key="idx"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="(dialogVisible = false), (dialogType = false)">{{
            $t("form.btn.cancel")
          }}</el-button>
          <el-button
            type="primary"
            @click="dialogTrueChange(ruleFormRef)"
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
import { Search, Plus } from "@element-plus/icons-vue";
import { ref, reactive } from "vue";
import { getUser, addUser, delUser, putUser, setPassword } from "@/api/user";
import { getStation } from "@/api/seat";
import { roleList } from "@/config/config";
import { ElMessage } from "element-plus";
import md5 from "js-md5";

const isUpdatePawShow = ref(false); // 修改密码
const dialogType = ref(false);
const ruleFormRef = ref(null);
const updatePasRef = ref(null);
const setForm = ref(false);
const labelPosition = ref("right");
const multipleSelection = ref([]);
const tableData = ref([]);
const stationList = ref([]); // 工位
const formInline = reactive({
  workId: "",
  userName: "",
});
const formLabelAlign = ref({
  userName: "",
  password: "",
  workID: "",
  role: "",
});
const updatePas = ref({
  oldPassword: "",
  affirmPassword: "",
  newPassword: "",
});

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const equalToPassword = (rule, value, callback) => {
  if (updatePas.value.newPassword !== value) {
    callback(new Error(t("user.isPasTrue")));
  } else {
    callback();
  }
};
const rules = ref({
  userName: [{ required: true, message: t("user.userName"), trigger: "blur" }],
  password: [{ required: true, message: t("user.password"), trigger: "blur" }],
  workID: [{ required: true, message: t("user.workID"), trigger: "blur" }],
  role: [{ required: true, message: t("user.role"), trigger: "blur" }],
});
const updatePasRules = ref({
  oldPassword: [
    { required: true, message: t("user.oldPassword"), trigger: "blur" },
  ],
  newPassword: [
    { required: true, message: t("user.newPassword"), trigger: "blur" },
  ],
  affirmPassword: [
    { required: true, message: t("user.affirmPassword"), trigger: "blur" },
    { required: true, validator: equalToPassword, trigger: "blur" },
  ],
});

const onSubmit = () => {
  console.log("submit!");
  console.log({ ...formInline });
  getPage({ ...formInline });
};

const dialogVisible = ref(false);
const deleteRow = (idx) => {
  dialogVisible.value = true;
  formLabelAlign.value = tableData.value[[idx]];
};
const onAdd = () => {
  dialogType.value = true;
  dialogVisible.value = true;
  formLabelAlign.value = {
    userName: "",
    password: "",
    workID: "",
    role: "",
  };
};
const onUpdate = (row) => {
  dialogType.value = false;
  dialogVisible.value = true;
  formLabelAlign.value = row;
};
const onResetting = (row) => {
  let params = {
    ...row,
    password: md5("kone1234"),
  };
  putUser([params]).then((res) => {
    console.log(res);
    ElMessage({
      message: t("msg.pasword"),
      type: "success",
    });
    getPage();
  });
};
// 修改密码
const onUpdatePas = (row) => {
  isUpdatePawShow.value = true;
  formLabelAlign.value = row;
  updatePas.value = {};
};
const upDatePas = () => {
  if (!updatePasRef) return;
  updatePasRef.value.validate((valid) => {
    if (valid) {
      //   ElMessage({
      //     message: "未完成",
      //     type: "info",
      //   });
      var user = JSON.parse(localStorage.getItem("$user"));
      setPassword({
        id: user.id,
        oldPassword: md5(updatePas.value.oldPassword),
        newPassword: md5(updatePas.value.newPassword),
      }).then((res) => {
        ElMessage({
          message: "修改成功",
          type: "success",
        });
        isUpdatePawShow.value = false;
      });
    } else {
      return false;
    }
  });
};
const dialogTrueChange = () => {
  if (!ruleFormRef) return;
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      setForm.value = true;
      let postData = formLabelAlign.value;
      if (dialogType.value) {
        addUser({
          ...postData,
          password: md5(postData.password),
        }).then((res) => {
          console.log(res);
          ElMessage({
            message: "新增成功",
            type: "success",
          });
          getPage();
        });
      } else {
        putUser([{ ...postData }]).then((res) => {
          console.log(res);
          ElMessage({
            message: "修改成功",
            type: "success",
          });
          getPage();
        });
      }
      setTimeout(function () {
        setForm.value = false;
      }, 2000);
      dialogType.value = false;
      dialogVisible.value = false;
    } else {
      return false;
    }
  });
};
// ===============================================
const getStationList = (data) => {
  getStation({ ...data }).then((res) => {
    console.log("工位：", res.data);
    stationList.value = res.data;
  });
};
const getPage = (data) => {
  getUser({ ...data }).then((res) => {
    console.log(res.data);
    tableData.value = res.data;
  });
};
getStationList();
getPage();
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
const ondel = (row) => {
  delUser({ ...row, userId: "string" }).then((res) => {
    ElMessage({
      message: "删除成功",
      type: "success",
    });
  });
  getPage();
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
