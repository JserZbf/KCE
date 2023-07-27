<template>
  <div class="main_seat">
    <div class="content flex flex-sb flex1">
      <div class="leftMenu">
        <leftMenu @seleteChange="seleteChange"></leftMenu>
      </div>
      <div class="rightData">
        <div class="search flex0 flex-ac-sb">
          <el-form
            :inline="true"
            :model="formInline"
            class="demo-form-inline flex-c-c"
          >
            <!-- <el-form-item label="订单号">
              <el-input
                v-model="formInline.orderId"
                placeholder="输入订单号"
                @keyup.enter.native="onSubmit"
              />
            </el-form-item> -->
            <!-- <el-form-item label="工位" prop="workID">
              <el-select
                style="width: 100%"
                v-model="formInline.workID"
                placeholder="选择工位"
              >
                <el-option
                  v-for="(item, i) in stationList"
                  :key="i"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="工位">
              <el-input v-model="formInline.workID" placeholder="输入工位" />
            </el-form-item> -->
          </el-form>
          <div>
            <!-- <el-button type="primary" @click="onSubmit" round :icon="Search">
              {{ $t("form.search") }}
            </el-button> -->
            <el-button
              type="primary"
              @click="onAdd"
              round
              :icon="Plus"
              v-hasRole="['admin', 'superCES']"
              >{{ $t("form.add") }}</el-button
            >
          </div>
        </div>

        <div class="rBox flex1">
          <el-table :data="tableData" style="width: 100%; height: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="85"
              align="center"
            />
            <el-table-column
              label="流程名称"
              prop="flowItemName"
              align="center"
            />
            <el-table-column
              label="流程序号"
              prop="flowItemIndex"
              align="center"
            />
            <!-- <el-table-column
            label="流程类型"
            prop="flowItemIndex"
            align="center"
          /> -->
            <el-table-column label="编辑" align="center">
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
      </div>
    </div>

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
        <el-form-item :label="$t('form.flow')" prop="flowItemName">
          <el-input
            style="width: 340px"
            v-model="formModal.flowItemName"
            :placeholder="$t('form.flow')"
          />
        </el-form-item>
        <el-form-item :label="$t('form.step')" prop="flowItemIndex">
          <el-input
            style="width: 340px"
            v-model="formModal.flowItemIndex"
            :placeholder="$t('form.step')"
          />
        </el-form-item>
        <el-form-item :label="$t('form.uploadFile')">
          <el-upload
            v-model:file-list="fileList"
            :action="baseUrl + '/api/ces/File/Upload'"
            list-type="picture-card"
            name="formFiles"
            :on-preview="handlePictureCardPreview"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model="img_dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
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
import { Search, Plus, Delete } from "@element-plus/icons-vue";
import { ref, reactive, watch } from "vue";
import leftMenu from "./components/leftMenu.vue";
import {
  getPicVideoFlowItemConfig,
  addPicVideoFlowItemConfig,
  delPicVideoFlowItemConfig,
  putPicVideoFlowItemConfig,
} from "@/api/flow";
import {
  getPicVideo,
  addPicVideo,
  delPicVideo,
  addPhysicalDelRecord,
} from "@/api/ladder";
import { getStation } from "@/api/seat";
import { ElMessage } from "element-plus";
import { baseUrl } from "@/utils/baseUrl";

// const stationList = ref([]); // 工位
const dialogForm = ref(null);
const user = JSON.parse(localStorage.getItem("$user"));
const tableData = ref([]);
const leftMenuId = ref(undefined);
const dialogType = ref(true);
const img_dialogVisible = ref(false);
const fileList = ref([]);
const oldfileList = ref([]);

const labelPosition = ref("right");
const dialogImageUrl = ref("");

const formInline = reactive({
  orderId: "",
  workId: "",
});

const formModal = ref({
  flowItemIndex: "",
  flowItemName: "",
});

const rulesModal = ref({
  flowItemName: [
    { required: true, message: "请输入配置名称", trigger: "blur" },
  ],
  flowItemIndex: [
    { required: true, message: "请输入当前步骤", trigger: "blur" },
  ],
});

const dialogVisible = ref(false);

const removeChange = (item) => {
  delPicVideoFlowItemConfig({ id: item.id, userID: user.id }).then((res) => {
    ElMessage({
      message: "删除成功",
      type: "success",
    });
    getRightData();
  });
};

const tisImg = (params, idx) => {
  getPicVideo({ ...params, FileType: "demoImg" }).then((res) => {
    let imgUrlList = [];
    res.data.picVideoList.forEach((el) => {
      el.filePath = baseUrl + "/api/ces/File/download?fileId=" + el.id;
      imgUrlList.push({
        name: "img",
        id: el.id,
        url: el.filePath,
      });
    });
    oldfileList.value = JSON.parse(JSON.stringify(imgUrlList));
    fileList.value = imgUrlList;
  });
};

const onAdd = () => {
  dialogVisible.value = true;
  dialogType.value = true;
  formModal.value = {
    ...formModal.value,
    flowItemIndex: "",
    flowItemName: "",
  };
  //   tisImg({configID:});
};
const editChange = (item, idx) => {
  dialogVisible.value = true;
  dialogType.value = false;
  formModal.value = JSON.parse(JSON.stringify(item));
  formModal.value.userID = user.id;
  tisImg({ configID: item.id }, idx);
};
const dialogTrueChange = () => {
  if (!dialogForm) return;
  dialogForm.value.validate((valid) => {
    if (valid) {
      if (dialogType.value) {
        addPicVideoFlowItemConfig({ ...formModal.value }).then((res) => {
          ElMessage({
            message: "新增成功",
            type: "success",
          });

          //   if (oldfileList.value.length != fileList.value.length) {
          //     oldfileList.value.forEach((el) => {
          //       delPicVideo({ id: el.id, type: "physical" }).then((res) => {
          //         console.log("删除成功", res);
          //       });
          //     });
          //   }
          dialogVisible.value = false;
          getRightData();
        });
      } else {
        putPicVideoFlowItemConfig([{ ...formModal.value }]).then((res) => {
          ElMessage({
            message: "修改成功",
            type: "success",
          });

          //   if (oldfileList.value.length != fileList.value.length) {
          //     oldfileList.value.forEach((el) => {
          //       delPicVideo({ id: el.id, type: "physical" }).then((res) => {
          //         console.log("删除成功", res);
          //       });
          //     });
          //   }
          dialogVisible.value = false;
          getRightData();
        });
      }
    } else {
      return false;
    }
  });
};
const getRightData = (params) => {
  params = params || {};
  console.log(params);
  getPicVideoFlowItemConfig({ ...params, ...leftMenu.value }).then((res) => {
    tableData.value = res.data;
  });
};
const seleteChange = (params) => {
  formModal.value = {
    ...formModal.value,
    ...params,
  };
  leftMenu.value = params;
  getRightData({ ...params });
};
// const getStationList = (data) => {
//   getStation({ ...data }).then((res) => {
//     console.log("工位：", res.data);
//     stationList.value = res.data;
//   });
// };
const onSubmit = () => {
  seleteChange({ FlowTypeID: formModal.value.FlowTypeID });
  console.log("submit!");
};
const handleRemove = (uploadFile, uploadFiles) => {
  oldfileList.value.forEach((el, idx) => {
    fileList.value.forEach((ele) => {
      if (el.url === ele.url) {
        oldfileList.value.splice(idx, 1);
      }
    });
  });

  oldfileList.value.forEach((el) => {
    delPicVideo({ id: el.id, type: "physical" }).then((res) => {
        ElMessage({
            message: "删除成功",
            type: "success",
          });
      console.log("删除成功", res);
    });
  });

  console.log();
};

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  img_dialogVisible.value = true;
};
const uploadSuccess = (response) => {
  console.log(fileList.value);
  formModal.value = {
    ...formModal.value,
    filePath: response.data,
    fileType: "demoImg",
    name: "demoImg",
  };
  addPicVideo({
    ...formModal.value,
    sn: "0",
    ConfigID: formModal.value.id,
    fileType: "demoImg",
  }).then((res) => {
    console.log(res);
  });
};

// getStationList();
</script>
<style lang="scss" scoped>
// .appRouterView{
// box-shadow:none !important;
// }
.main_seat {
  width: 100%;
  height: 100%;
  overflow: hidden;
  // padding: 14px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  // background: #f0f2f5 !important  ;
  .search {
    width: 100%;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    padding: 27px 12px;
    background: #fff;
    box-sizing: border-box;
    border-radius: 12px;

    .demo-form-inline {
      display: flex;
      align-items: center;

      .el-form-item {
        margin-bottom: 0;
      }
    }
    // height: 83px;
  }
  .content {
    width: 100%;
    height: 100%;
    background: #eff1f4;
    border-radius: 12px;

    .leftMenu {
      width: 20%;
      height: 100%;
      background: #fff;
      padding: 12px;
      box-sizing: border-box;
      border-radius: 12px;

      :deep(.is-active) {
        background-color: linear-gradient(
          178deg,
          #b5d7fe 0%,
          #5aa9fc 100%
        ) !important;
        color: #468ef4;
      }

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
      width: 79%;
      height: 100%;
      padding: 12px;
      box-sizing: border-box;
      background: #fff;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      .rBox {
        // padding: 24px 0;
        // box-sizing: border-box;
        overflow-y: scroll;
        height: 100%;
      }
    }
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
