import {
  getRolesAllPerPage,
  getRolesAll,
  postRoles,
  putRole,
  deleteRole
} from '@/api/role'

const state = {
  allRoles: [],

  aPageOfAllRoles: [],
  allTotal: 0
}

const getters = {
  allRoles: state => state.allRoles,

  aPageOfAllRoles: state => state.aPageOfAllRoles,
  allTotal: state => state.allTotal
}

const mutations = {
  setAllRoles(state, payload) {
    state.allRoles = payload.allRoles
  },

  setAPageOfAllRoles(state, payload) {
    state.aPageOfAllRoles = payload.aPageOfAllRoles
  },

  setAllTotal(state, payload) {
    state.allTotal = payload.allTotal
  }
}

const actions = {
  doGetRolesAllPerPage({ state, commit }, { page, pageSize }) {
    return new Promise((resolve, reject) => {
      try {
        getRolesAllPerPage(page, pageSize)
          .then(value => {
            console.log(value.data.collection)
            var total = value.data.collection.total
            var items = value.data.collection.items

            var roles = []
            items.forEach(currentItem => {
              var datas = currentItem.data

              var role = {}
              datas.forEach(currentData => {
                role[currentData['name']] = currentData['value']
              })

              roles.push(role)
            })

            commit('setAPageOfAllRoles', { aPageOfAllRoles: roles })
            commit('setAllTotal', { allTotal: total })

            resolve(roles)
          })
          .catch(error => {
            reject(error)
          })
      } catch (error) {
        reject(error)
      }
    })
  },

  doGetRolesAll({ state, commit }) {
    return new Promise((resolve, reject) => {
      try {
        getRolesAll()
          .then(value => {
            var items = value.data.collection.items

            var roles = []
            items.forEach(currentItem => {
              var datas = currentItem.data

              var role = {}
              datas.forEach(currentData => {
                role[currentData['name']] = currentData['value']
              })

              roles.push(role)
            })

            commit('setAllRoles', { allRoles: roles })

            resolve(roles)
          })
          .catch(error => {
            reject(error)
          })
      } catch (error) {
        reject(error)
      }
    })
  },

  doAddRole({ state, commit }, { role }) {
    return new Promise((resolve, reject) => {
      try {
        postRoles(role)
          .then(value => {
            resolve(value.data)
          })
          .catch(error => {
            reject(error)
          })
      } catch (error) {
        reject(error)
      }
    })
  },

  doEditRole({ state, commit }, { role }) {
    return new Promise((resolve, reject) => {
      try {
        putRole(role)
          .then(value => {
            resolve(value.data)
          })
          .catch(error => {
            reject(error)
          })
      } catch (error) {
        reject(error)
      }
    })
  },

  doDeleteRole({ state, commit }, { role }) {
    return new Promise((resolve, reject) => {
      try {
        deleteRole(role)
          .then(value => {
            resolve(value.data)
          })
          .catch(error => {
            reject(error)
          })
      } catch (error) {
        reject(error)
      }
    })
  }
}

const role = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

export default role
