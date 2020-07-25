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
      <FormItem label="名称：" prop="name">
        <Input v-model="formValidate.name" placeholder="请输入" />
      </FormItem>

      <FormItem label="组长：" prop="leader">
        <Select v-model="formValidate.leader" placeholder="请选择">
          <Option
            v-for="account in accounts"
            :value="account.key"
            :key="account.key"
            >{{ account.nickname }}</Option
          >
        </Select>
      </FormItem>

      <FormItem label="组员：" prop="members">
        <Transfer
          :data="accounts"
          :target-keys="formValidate.members"
          :render-format="membersRender"
          @on-change="handleMembersChange"
        >
        </Transfer>
      </FormItem>
    </Form>

    <span slot="footer" class="dialog-footer">
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
        name: '',
        leader: '',
        members: []
      },

      ruleValidate: {
        name: [{ required: true, message: '名称不能为空！', trigger: 'blur' }],
        leader: [{ required: true, message: '组长不能为空！' }],
        members: [
          {
            required: true,
            type: 'array',
            min: 1,
            message: '组员不能为空！'
          }
        ]
      }
    }
  },

  computed: {
    accounts() {
      return this.$store.state.account.allAccounts.map(
        (currentValue, index, arr) => {
          return { key: currentValue.id, nickname: currentValue.nickname }
        }
      )
    }
  },

  methods: {
    /* Transfer */
    handleMembersChange(newTargetKeys, direction, moveKeys) {
      this.formValidate.members = newTargetKeys
    },

    membersRender(account) {
      return account.nickname
    },

    handleReset(name) {
      this.$refs[name].resetFields()
      this.formValidate.id = -1
      this.show = false
    },

    /* dialog */
    teamAdd() {
      this.title = '新增小组'
      this.show = true
    },

    teamEdit(team) {
      this.title = '编辑小组'
      this.show = true

      this.formValidate = {
        id: team.id,
        name: team.name,
        leader: team.leader,
        members: team.members
      }
    },

    /* form */
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (!valid) {
          this.$Message.error('输入错误，请检查您的输入！')

          return
        }

        var team = {
          id: this.formValidate.id,
          name: this.formValidate.name,
          leader: this.formValidate.leader,
          members: JSON.stringify(this.formValidate.members)
        }

        if ('新增小组' === this.title) {
          this.doAddTeam(team)
        } else if ('编辑小组' === this.title) {
          this.doEditTeam(team)
        }
      })
    },

    /* action */
    doAddTeam(team) {
      this.$Spin.show()

      this.$store
        .dispatch('team/doAddTeam', {
          team: team
        })
        .then(value => {
          this.handleReset('formValidate')
        })
        .catch(error => {
          this.$Message.error({
            content: '新增小组出错：' + error
          })
        })
        .finally(() => {
          this.$Spin.hide()
        })
    },

    doEditTeam(team) {
      this.$Spin.show()

      this.$store
        .dispatch('team/doEditTeam', {
          team: team
        })
        .then(value => {
          this.handleReset('formValidate')
        })
        .catch(error => {
          this.$Message.error({
            content: '编辑小组出错：' + error
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
