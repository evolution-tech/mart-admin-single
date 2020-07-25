<template>
  <Modal
    width="600"
    v-model="show"
    :title="title"
    :mask-closable="false"
    @on-cancel="handleReset('formValidate')"
  >
    <Form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="120"
    >
      <Row>
        <i-col span="24">
          <FormItem label="名称：" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入" />
          </FormItem>
        </i-col>

        <i-col span="24">
          <FormItem label="权限：" prop="permissions">
            <Transfer
              :data="permissions"
              :target-keys="formValidate.permissions"
              :render-format="permissionsRender"
              @on-change="handlePermissionsChange"
            ></Transfer>
          </FormItem>
        </i-col>
      </Row>
    </Form>

    <span slot="footer">
      <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
      <Button @click="handleReset('formValidate')">取消</Button>
    </span>
  </Modal>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      title: '',

      formValidate: {
        id: -1,
        name: '',
        permissions: []
      },

      ruleValidate: {
        name: [
          {
            required: true,
            message: '名称不能为空！',
            trigger: 'blur'
          }
        ],
        permissions: [
          {
            required: true,
            type: 'array',
            min: 1,
            message: '权限不能为空！'
          }
        ]
      }
    }
  },

  computed: {
    permissions() {
      return this.$store.state.permission.allPermissions.map(
        (currentValue, index, arr) => {
          return { key: currentValue.code, name: currentValue.name }
        }
      )
    }
  },

  methods: {
    /* Transfer */
    handlePermissionsChange(newTargetKeys, direction, moveKeys) {
      this.formValidate.permissions = newTargetKeys
    },

    permissionsRender(permission) {
      return permission.name
    },

    /* dialog */
    roleAdd() {
      this.title = '新增角色'
      this.show = true
    },

    roleEdit(role) {
      this.title = '编辑角色'
      this.show = true

      this.formValidate = {
        id: role.id,
        name: role.name,
        permissions: JSON.parse(role.permissions)
      }
    },

    /* form */
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (!valid) {
          this.$Message.error('输入错误，请检查您的输入！')

          return
        }

        var role = {
          id: this.formValidate.id,
          name: this.formValidate.name,
          permissions: JSON.stringify(this.formValidate.permissions)
        }

        if ('新增角色' == this.title) {
          this.doAddRole(role)
        } else if ('编辑角色' === this.title) {
          this.doEditRole(role)
        }
      })
    },

    handleReset(name) {
      this.$refs[name].resetFields()
      this.formValidate.id = -1
      this.show = false
    },

    /* action */
    doAddRole(role) {
      this.$Spin.show()

      this.$store
        .dispatch('role/doAddRole', {
          role: role
        })
        .then(value => {
          this.handleReset('formValidate')
        })
        .catch(error => {
          this.$Message.error({
            content: '新增角色出错：' + error
          })
        })
        .finally(() => {
          this.$Spin.hide()
        })
    },

    doEditRole(role) {
      this.$Spin.show()
      console.log(role)

      this.$store
        .dispatch('role/doEditRole', {
          role: role
        })
        .then(value => {
          this.handleReset('formValidate')
        })
        .catch(error => {
          this.$Message.error({
            content: '编辑角色出错：' + error
          })
        })
        .finally(() => {
          this.$Spin.hide()
        })
    }
  }
}
</script>

<style></style>
