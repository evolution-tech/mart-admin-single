<template>
  <div class="workspace">
    <div class="operations">
      <Button size="large" @click="teamAdd" icon="md-add" type="primary">
        小组</Button
      >
    </div>

    <div class="items">
      <Table row-key="id" border :columns="headers" :data="teams"></Table>
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

    <team-dialog ref="teamDialog" />
  </div>
</template>

<script>
import teamDialog from './component/team-dialog.vue'

export default {
  components: {
    teamDialog
  },

  created() {
    if (this.$store.state.account.allAccounts.length === 0) {
      this.$store.dispatch('account/doGetAccountsAll').catch(error => {
        this.$Message.error({
          content: '获取账户出错：' + error
        })
      })
    }

    this.doGetTeamsAllPerPage()
  },

  data() {
    return {
      headers: [
        {
          title: '名称',
          key: 'name',
          align: 'center',
          width: 150
        },
        {
          title: '组长',
          key: 'leader',
          align: 'center',
          width: 150,
          render: (h, params) => {
            console.log(params.row.leader)
            if (!this.allAccountsMap) {
              return h('span', {}, params.row.leader)
            }

            return h(
              'span',
              {},
              this.allAccountsMap[params.row.leader].nickname
            )
          }
        },
        {
          title: '组员',
          key: 'members',
          align: 'center',
          render: (h, params) => {
            if (!this.allAccountsMap) {
              return h('span', {}, params.row.members)
            }

            var members = JSON.parse(params.row.members)
            var membersHr = members.map((currentValue, index, arr) => {
              return this.allAccountsMap[currentValue].nickname
            })

            return h('span', {}, membersHr.join(' '))
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
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
                      this.teamEdit(params.index)
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
                  on: {
                    click: () => {
                      this.teamDelete(params.index)
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
      }
    }
  },

  computed: {
    teams() {
      return this.$store.state.team.aPageOfAllTeams
    },

    total() {
      return this.$store.state.team.allTotal
    },

    allAccountsMap() {
      if (this.$store.state.account.allAccounts.length === 0) {
        return null
      }

      var allAccountsMap = {}
      this.$store.state.account.allAccounts.forEach(
        (currentValue, arr, index) => {
          allAccountsMap[currentValue.id] = currentValue
        }
      )

      return allAccountsMap
    }
  },

  methods: {
    /* page */
    handleChange(page) {
      this.pager.current = page
      this.doGetTeamsAllPerPage()
    },

    handlePageSizeChange(pageSize) {
      this.pager.pageSize = pageSize
      this.doGetTeamsAllPerPage()
    },

    /* dialog */
    teamAdd() {
      this.$refs.teamDialog.teamAdd()
    },

    teamEdit(index) {
      this.$refs.teamDialog.teamEdit(this.teams[index])
    },

    teamDelete(index) {
      this.$Modal.confirm({
        title: '删除',
        content: '您确定要删除该小组吗？',
        onOk: () => {
          this.doDeleteTeam(this.teams[index])
        },
        onCancel: () => {}
      })
    },

    /* action */
    doGetTeamsAllPerPage() {
      this.$Spin.show()

      this.$store
        .dispatch('team/doGetTeamsAllPerPage', {
          page: this.pager.current,
          pageSize: this.pager.pageSize
        })
        .catch(error => {
          this.$Message.error({
            content: '获取小组出错：' + error
          })
        })
        .finally(() => {
          this.$Spin.hide()
        })
    },

    doDeleteTeam(team) {
      this.$Spin.show()

      this.$store
        .dispatch('team/doDeleteTeam', {
          team: team
        })
        .catch(error => {
          this.$Message.error({
            content: '删除小组出错：' + error
          })
        })
        .finally(() => {
          this.$Spin.hide()
        })
    }
  }
}
</script>

<style lang="less">
@import '~@/css/main.css';
</style>
