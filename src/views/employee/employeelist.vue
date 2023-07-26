<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.department" placeholder="部门">
          <el-option
            v-for="item in departments"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.degree" placeholder="学历">
          <el-option
            v-for="item in degrees"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
<!--        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
        <el-button type="primary" @click="printExcel()" :disabled="dataListSelections.length <= 0">导出excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="empName"
        header-align="center"
        align="center"
        label="职员姓名">
      </el-table-column>
      <el-table-column
        prop="sex"
        header-align="center"
        align="center"
        label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.sex == 1 ? '男':'女' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="age"
        header-align="center"
        align="center"
        label="年龄">
      </el-table-column>
      <el-table-column
        prop="deptName"
        header-align="center"
        align="center"
        label="部门名称">
      </el-table-column>
      <el-table-column
        prop="empDegreeName"
        header-align="center"
        align="center"
        label="学历">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './employeelist-add-or-update'
import request from '@/utils/request'

export default {
  data() {
    return {
      dataForm: {
        key: '',
        department: '',
        degree: '',
      },
      departments: [{
        value: '人事部',
        label: '人事部'
      },{
        value: '业务部',
        label: '业务部'
      }, {
        value: '后勤部',
        label: '后勤部'
      }],
      degrees: [{
        value: '专科',
        label: '专科'
      },{
        value: '本科',
        label: '本科'
      }, {
        value: '研究生',
        label: '研究生'
      }],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate,
    request
  },
  created() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      request({
        url: '/employeelist/list',
        method: 'get',
        params: ({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'key': this.dataForm.key,
          'dapartment': this.dataForm.dapartment,
          'degree': this.dataForm.degree
        })
      }).then((res) => {
        console.log(res)
        if (res && res.code === 20000) {
          this.dataList = res.data.list
          this.totalPage = res.data.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/employeelist/delete',
          method: 'post',
          data: ids
        }).then((res) => {
          console.log(res)
          if (res && res.code === 20000) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    //导出为excel
    printExcel(){
      var data =this.dataListSelections;
      request({
        url: '/employeelist/printExcel',
        method: 'get',
        params: JSON.stringify(data)
      }).then((res) => {
        if (res && res.code === 20000) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
          })
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>
