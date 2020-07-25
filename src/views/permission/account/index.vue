<template>
  <div class="workspace">
    <div class="operations">
      <Button size="large" @click="accountAdd" icon="md-add" type="primary">
        账户</Button
      >
    </div>

    <div class="items">
      <Table border :columns="headers" :data="accounts"></Table>
      <Page
        class-name="pager"
        :total="total"
        :current="pager.current"
        :page-size="pager.pageSize"
        show-elevator
        show-sizer
        show-total
        @on-change="handleChange"
        @on-page-size-change="handlePageSizeChange"
      />
    </div>

    <account-dialog ref="accountDialog" />
  </div>
</template>

<script>
import accountDialog from './component/account-dialog'

export default {
  components: {
    accountDialog
  },

  created() {
    if (this.$store.state.role.allRoles.length === 0) {
      this.$store.dispatch('role/doGetRolesAll').catch(error => {
        this.$Message.error({
          content: '获取角色出错：' + error
        })
      })
    }

    this.doGetAccountsAllPerPage()
  },

  data() {
    return {
      headers: [
        {
          title: '昵称',
          key: 'nickname',
          align: 'center',
          width: 150
        },
        {
          title: 'Email',
          key: 'email',
          align: 'center',
          width: 200
        },
        {
          title: '角色',
          key: 'roles',
          align: 'center',
          render: (h, params) => {
            if (!this.allRolesMap) {
              return h('span', {}, params.row.roles)
            }

            var roles = JSON.parse(params.row.roles)
            var rolesHr = roles.map((currentValue, index, arr) => {
              return this.allRolesMap[currentValue].name
            })

            return h('span', {}, rolesHr.join(' '))
          }
        },
        {
          title: '状态',
          key: 'state',
          align: 'center',
          width: 100,
          render: (h, params) => {
            return h('span', {}, this.states[params.row.state])
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.accountEdit(params.index)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.accountDelete(params.index)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],

      pager: {
        pageSize: 10,
        current: 1
      },

      states: {
        A: '激活',
        F: '冻结'
      }
    }
  },

  computed: {
    accounts() {
      return this.$store.state.account.aPageOfAllAccounts
    },

    total() {
      return this.$store.state.account.allTotal
    },

    allRolesMap() {
      if (this.$store.state.role.allRoles.length === 0) {
        return null
      }

      var allRolesMap = {}
      this.$store.state.role.allRoles.forEach((currentValue, arr, index) => {
        allRolesMap[currentValue.id] = currentValue
      })

      return allRolesMap
    }
  },

  methods: {
    /* page */
    handleChange(page) {
      this.pager.current = page
      this.doGetAccountsAllPerPage()
    },

    handlePageSizeChange(pageSize) {
      this.pager.pageSize = pageSize
      this.doGetAccountsAllPerPage()
    },

    /* dialog */
    accountAdd() {
      this.$refs.accountDialog.accountAdd()
    },

    accountEdit(index) {
      this.$refs.accountDialog.accountEdit(this.accounts[index])
    },

    accountDelete(index) {
      this.$Modal.confirm({
        title: '删除',
        content: '您确定要删除该账户吗？',
        onOk: () => {
          this.doDeleteAccount(this.accounts[index])
        },
        onCancel: () => {}
      })
    },

    /* action */
    doGetAccountsAllPerPage() {
      this.$Spin.show()

      this.$store
        .dispatch('account/doGetAccountsAllPerPage', {
          page: this.pager.current,
          pageSize: this.pager.pageSize
        })
        .catch(error => {
          this.$Message.error({
            content: '获取账户出错：' + error
          })
        })
        .finally(() => {
          this.$Spin.hide()
        })
    },

    doDeleteAccount(account) {
      this.$Spin.show()

      this.$store
        .dispatch('account/doDeleteAccount', {
          account: account
        })
        .catch(error => {
          this.$Message.error({
            content: '删除账户出错：' + error
          })
        })
        .finally(() => {
          this.$Spin.hide()
        })
    }
  }
}
</script>

<style>
@import '~@/css/main.css';
</style>
