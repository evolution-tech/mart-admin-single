<template>
  <div class="workspace">
    <div class="operations">
      <Button size="large" @click="roleAdd" icon="md-add" type="primary">
        角色</Button
      >
    </div>

    <div class="items">
      <Table border :columns="headers" :data="roles"></Table>
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

    <role-dialog ref="roleDialog" />
  </div>
</template>

<script>
import roleDialog from './component/role-dialog'

export default {
  components: {
    roleDialog
  },

  created() {
    if (this.$store.state.permission.allPermissions.length === 0) {
      this.$store.dispatch('permission/doGetPermissionsAll').catch(error => {
        this.$Message.error({
          content: '获取权限出错：' + error
        })
      })
    }

    this.doGetRolesAllPerPage()
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
          title: '权限',
          key: 'permissions',
          align: 'center',
          render: (h, params) => {
            if (!this.allPermissionsMap) {
              return h('span', {}, params.row.permissions)
            }

            var permissions = JSON.parse(params.row.permissions)
            var permissionsHr = permissions.map((currentValue, index, arr) => {
              return this.allPermissionsMap[currentValue].name
            })

            return h('span', {}, permissionsHr.join(' '))
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
                      this.roleEdit(params.index)
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
                      this.roleDelete(params.index)
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
    roles() {
      return this.$store.state.role.aPageOfAllRoles
    },

    total() {
      return this.$store.state.role.allTotal
    },

    allPermissionsMap() {
      if (this.$store.state.permission.allPermissions.length === 0) {
        return null
      }

      var allPermissionsMap = {}
      this.$store.state.permission.allPermissions.forEach(
        (currentValue, arr, index) => {
          allPermissionsMap[currentValue.code] = currentValue
        }
      )

      return allPermissionsMap
    }
  },

  methods: {
    /* page */
    handleChange(page) {
      this.pager.current = page
      this.doGetRolesAllPerPage()
    },

    handlePageSizeChange(pageSize) {
      this.pager.pageSize = pageSize
      this.doGetRolesAllPerPage()
    },

    /* dialog */
    roleAdd() {
      this.$refs.roleDialog.roleAdd()
    },

    roleEdit(index) {
      this.$refs.roleDialog.roleEdit(this.roles[index])
    },

    roleDelete(index) {
      this.$Modal.confirm({
        title: '删除',
        content: '您确定要删除该角色吗？',
        onOk: () => {
          this.doDeleteRole(this.roles[index])
        },
        onCancel: () => {}
      })
    },

    /* action */
    doGetRolesAllPerPage() {
      this.$Spin.show()

      this.$store
        .dispatch('role/doGetRolesAllPerPage', {
          page: this.pager.current,
          pageSize: this.pager.pageSize
        })
        .catch(error => {
          this.$Message.error({
            content: '获取角色出错：' + error
          })
        })
        .finally(() => {
          this.$Spin.hide()
        })
    },

    doDeleteRole(role) {
      this.$Spin.show()

      this.$store
        .dispatch('role/doDeleteRole', {
          role: role
        })
        .catch(error => {
          this.$Message.error({
            content: '删除角色出错：' + error
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
