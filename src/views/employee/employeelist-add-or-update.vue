<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="职员姓名" prop="empName">
      <el-input v-model="dataForm.empName" placeholder="职员姓名"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-select v-model="dataForm.sex" placeholder="性别" style="width: 100%">
        <el-option
          v-for="item in sexs"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="年龄" prop="age">
      <el-input v-model="dataForm.age" placeholder="年龄"></el-input>
    </el-form-item>
    <el-form-item label="部门名称" prop="deptName">
      <el-select v-model="dataForm.deptName" placeholder="部门名称" style="width: 100%">
        <el-option
          v-for="item in departments"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="学历" prop="empDegreeName">
      <el-select v-model="dataForm.empDegreeName" placeholder="学历" style="width: 100%">
        <el-option
          v-for="item in degrees"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import request from "@/utils/request";

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          empName: '',
          sex: '',
          age: '',
          deptName: '',
          empDegreeName: ''
        },
        sexs: [{
          value: '1',
          label: '男'
        },{
          value: '0',
          label: '女'
        }],
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
          value: '大专',
          label: '大专'
        },{
          value: '本科',
          label: '本科'
        }, {
          value: '研究生',
          label: '研究生'
        }],
        dataRule: {
          empName: [
            { required: true, message: '职员姓名不能为空', trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '性别不能为空', trigger: 'blur' }
          ],
          age: [
            { required: true, message: '年龄不能为空', trigger: 'blur' }
          ],
          deptName: [
            { required: true, message: '部门名称不能为空', trigger: 'blur' }
          ],
          empDegreeName: [
            { required: true, message: '学历不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            request({
              url: `/employeelist/info/${this.dataForm.id}`,
              method: 'get',
            }).then((res) => {
              var data=res.employeeList
              console.log(res)
              if (res && res.code === 20000) {
                this.dataForm.empName = data.empName
                this.dataForm.sex = data.sex==1?"男":"女"
                this.dataForm.age = data.age
                this.dataForm.deptName = data.deptName
                this.dataForm.empDegreeName = data.empDegreeName
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // if(this.dataForm.sex=="男"){
            //   this.dataForm.sex=1;
            // }else{
            //   this.dataForm.sex=0;
            // }
            request({
              url:  `/employeelist/${!this.dataForm.id ? 'save' : 'update'}`,
              method: 'post',
              data: ({
                'id': this.dataForm.id || undefined,
                'empName': this.dataForm.empName,
                'sex': this.dataForm.sex,
                'age': this.dataForm.age,
                'deptName': this.dataForm.deptName,
                'empDegreeName': this.dataForm.empDegreeName
              })
            }).then((res) => {
              if (res && res.code === 20000) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(res.message)
              }
            })
          }
        })
      }
    }
  }
</script>
