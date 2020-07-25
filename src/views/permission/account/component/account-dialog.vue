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
          <FormItem label="昵称：" prop="nickname">
            <Input v-model="formValidate.nickname" placeholder="请输入" />
          </FormItem>
        </i-col>

        <i-col span="24">
          <FormItem label="邮箱：" prop="email">
            <Input v-model="formValidate.email" placeholder="请输入" />
          </FormItem>
        </i-col>

        <i-col span="24" v-if="title === '新增账户'">
          <FormItem label="密码：" prop="passwd">
            <Input
              v-model="formValidate.passwd"
              type="password"
              placeholder="请输入"
            />
          </FormItem>
        </i-col>

        <i-col span="24" v-if="title === '新增账户'">
          <FormItem label="请再次输入密码：" prop="repeatPasswd">
            <Input
              v-model="formValidate.repeatPasswd"
              type="password"
              placeholder="请输入"
            />
          </FormItem>
        </i-col>

        <i-col span="24">
          <FormItem label="角色:" prop="roles">
            <Transfer
              :data="roles"
              :target-keys="formValidate.roles"
              :render-format="rolesRender"
              @on-change="handleRolesChange"
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
    const validatePasswd = (rule, value, callback) => {
      if ('' === value) {
        callback(new Error('密码不能为空！'))

        return
      }

      var rag = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/
      if (!rag.test(value)) {
        callback(new Error('密码应为 6-12 位字母数字组合！'))

        return
      }

      callback()
    }

    const validateAgainPasswd = (rule, value, callback) => {
      if (value !== this.formValidate.passwd) {
        callback(new Error('两次输入的密码不一致！'))
      }

      callback()
    }

    return {
      show: false,
      title: '',

      formValidate: {
        id: -1,
        nickname: '',
        email: '',
        passwd: '',
        repeatPasswd: '',
        roles: []
      },

      ruleValidate: {
        email: [
          {
            required: true,
            message: 'Email 不能为空！',
            trigger: 'blur'
          },
          { type: 'email', message: 'Email 不正确！', trigger: 'blur' }
        ],
        nickname: [
          {
            required: true,
            message: '昵称不能为空！',
            trigger: 'blur'
          }
        ],
        passwd: [
          { required: true, validator: validatePasswd, trigger: 'blur' }
        ],
        repeatPasswd: [
          { required: true, validator: validateAgainPasswd, trigger: 'blur' }
        ],
        roles: [
          {
            required: true,
            type: 'array',
            min: 1,
            message: '角色不能为空！'
          }
        ]
      }
    }
  },

  computed: {
    roles() {
      return this.$store.state.role.allRoles.map((currentValue, index, arr) => {
        return { key: currentValue.id, name: currentValue.name }
      })
    }
  },

  methods: {
    /* Transfer */
    handleRolesChange(newTargetKeys, direction, moveKeys) {
      this.formValidate.roles = newTargetKeys
    },

    rolesRender(role) {
      return role.name
    },

    /* dialog */
    accountAdd() {
      this.title = '新增账户'
      this.show = true
    },

    accountEdit(account) {
      this.title = '编辑账户'
      this.show = true

      this.formValidate = {
        id: account.id,
        nickname: account.nickname,
        email: account.email,
        roles: JSON.parse(account.roles)
      }
    },

    /* form */
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (!valid) {
          this.$Message.error('输入错误，请检查您的输入！')

          return
        }

        var account = {
          id: this.formValidate.id,
          nickname: this.formValidate.nickname,
          email: this.formValidate.email,
          passwd: this.formValidate.passwd,
          roles: JSON.stringify(this.formValidate.roles)
        }

        if ('新增账户' === this.title) {
          this.doAddAccount(account)
        } else if ('编辑账户' === this.title) {
          this.doEditAccount(account)
        }
      })
    },

    handleReset(name) {
      this.$refs[name].resetFields()
      this.formValidate.id = -1
      this.show = false
    },

    /* action */
    doAddAccount(account) {
      this.$Spin.show()

      this.$store
        .dispatch('account/doAddAccount', {
          account: account
        })
        .then(value => {
          this.handleReset('formValidate')
        })
        .catch(error => {
          this.$Message.error({
            content: '新增账户出错：' + error
          })
        })
        .finally(() => {
          this.$Spin.hide()
        })
    },

    doEditAccount(account) {
      this.$Spin.show()

      this.$store
        .dispatch('account/doEditAccount', {
          account: account
        })
        .then(value => {
          this.handleReset('formValidate')
        })
        .catch(error => {
          this.$Message.error({
            content: '编辑账户出错：' + error
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
