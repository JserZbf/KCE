<template>
  <div class="main_seat">
    <div class="content flex flex-sb flex1">
      <div class="leftMenu">
        <h4 style="text-align: left">{{ $t("flow.leftTitle") }}</h4>
        <div class="flex-ac" style="margin-bottom: 10px">
          <el-input
            v-model="filterText"
            :placeholder="$t('form.search')"
            @keyup.enter.native="onSearch"
          >
            <template #append>
              <el-button :icon="Search" type="primary" @click="onSearch" />
            </template>
          </el-input>
          <el-button
            :icon="Plus"
            type="primary"
            @click="onAdd"
            v-hasRole="['admin', 'superCES']"
          />
        </div>
        <el-menu
          :default-active="menuActive"
          class="el-menu-vertical-demo"
          @select="handleSelect"
        >
          <el-menu-item v-for="(item, i) in leftMenuList" :key="i" :index="i">
            <div class="custom-tree-node flex-ac-sb">
              <div class="nodeName flex-c-c">{{ item.flowTypeName }}</div>
              <div class="nodeBtn flex-ac-sb" :show="isConfig">
                <el-button
                  v-hasRole="['admin', 'superCES']"
                  type="primary"
                  :icon="Edit"
                  circle
                  @click="editChange(item)"
                  size="small"
                />

                <el-popconfirm
                  :title="$t('msg.isDel')"
                  @confirm="removeChange(item)"
                >
                  <template #reference>
                    <el-button
                      v-hasRole="['admin', 'superCES']"
                      type="danger"
                      :icon="Delete"
                      circle
                      size="small"
                    />
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </el-menu-item>
        </el-menu>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType ? $t('form.add') : $t('form.update')"
      width="30%"
      align-center
      :append-to-body="true"
    >
      <el-form
        ref="leftForm"
        :label-position="labelPosition"
        label-width="120px"
        :model="formInline"
        :rules="leftRules"
        style="max-width: 460px; padding-right: 90px; box-sizing: border-box"
      >
        <el-form-item :label="$t('form.flow')" prop="flowTypeName">
          <el-input
            v-model="formInline.flowTypeName"
            :placeholder="$t('form.flow')"
            @keyup.enter.native="dialogTrueChange"
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
import { Search, Plus, Delete, Edit } from "@element-plus/icons-vue";
import { ref, reactive, defineEmits } from "vue";
import {
  getPicVideoFlowTypeConfig,
  addPicVideoFlowTypeConfig,
  delPicVideoFlowTypeConfig,
  putPicVideoFlowTypeConfig,
} from "@/api/flow";
import { ElMessage } from "element-plus";
const leftForm = ref(null);
const emit = defineEmits("loginChange");
const leftMenuList = ref([]);
const dialogType = ref(true);
const labelPosition = ref("right");
const filterText = ref("");
const menuActive = ref(0);
const dialogVisible = ref(false);
const formInline = ref({ flowTypeName: "" });
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const leftRules = ref({
  flowTypeName: [{ required: true, message: t('form.flow'), trigger: "blur" }],
});
const user = JSON.parse(localStorage.getItem("$user"));

// const formLabelAlign = reactive({
//   name: "",
//   region: "",
//   type: "",
// });
// const deleteRow = (idx) => {
//   dialogVisible.value = true;
//   formLabelAlign.value = tableData[idx];
// };
const onAdd = () => {
  dialogVisible.value = true;
  dialogType.value = true;
  formInline.value = { flowTypeName: "" };
};
const onSearch = () => {
  getLeftMenu({ flowTypeName: filterText.value });
};
const dialogTrueChange = () => {
  if (!leftForm) return;
  leftForm.value.validate((valid) => {
    if (valid) {
      if (dialogType.value) {
        addPicVideoFlowTypeConfig({ ...formInline.value }).then((res) => {
          console.log(res);
          ElMessage({
            message: t("msg.add"),
            type: "success",
          });
          dialogVisible.value = false;
          getLeftMenu();
        });
      } else {
        putPicVideoFlowTypeConfig([
          { ...formInline.value, userID: user.id },
        ]).then((res) => {
          console.log(res);
          ElMessage({
            message: t("msg.update"),
            type: "success",
          });
          dialogVisible.value = false;
          getLeftMenu();
        });
      }
    } else {
      return false;
    }
  });
};
const handleSelect = (index) => {
  let item = leftMenuList.value[index];
  menuActive.value = index;
  emit("seleteChange", { FlowTypeID: item.id });
};
const getLeftMenu = (params) => {
  getPicVideoFlowTypeConfig({ ...params }).then((res) => {
    console.log(res);
    if (res?.data && res?.data?.length) {
      leftMenuList.value = res.data;
      menuActive.value = 0;
      emit("seleteChange", { FlowTypeID: res.data[0].id });
    }
  });
};
getLeftMenu();
const editChange = (item) => {
  dialogVisible.value = true;
  dialogType.value = false;
  formInline.value = JSON.parse(JSON.stringify(item));
  formInline.value.userID = user.id;
};
const removeChange = (item) => {
  delPicVideoFlowTypeConfig({ id: item.id, userID: user.id }).then((res) => {
    ElMessage({
      message: t("msg.del"),
      type: "success",
    });
    getLeftMenu();
  });
};
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  // height: 100%;
  background: #eff1f4;
  border-radius: 12px;

  .leftMenu {
    width: 100%;
    height: 100%;
    background: #fff;
    // padding: 12px;
    box-sizing: border-box;
    border-radius: 12px;

    .custom-tree-node {
      width: 100%;
      height: 100%;
      .nodeName {
        height: 100%;
      }
      .nodeBtn {
        // width: 70px;
        height: 100%;
        :deep(.el-icon) {
          margin: 0 !important;
        }
      }
    }

    :deep(.el-tree--highlight-current) {
      .el-tree-node.is-current > .el-tree-node__content {
        background-color: linear-gradient(
          178deg,
          #b5d7fe 0%,
          #5aa9fc 100%
        ) !important;
        border-radius: 12px;
        color: #468ef4;
      }
    }
    // .el-tree--highlight-current
  }
  .rightData {
    width: 70%;
    background: #fff;
    border-radius: 12px;
    overflow-y: scroll;
  }
}
</style>
