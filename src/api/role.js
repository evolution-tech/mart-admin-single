import axios from '@/libs/api.request'
import store from '@/store'

export const getRolesAllPerPage = (page, pageSize) => {
  return axios.request({
    url: '/roles',
    params: {
      p: page,
      ps: pageSize
    },
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: 'Bearer ' + store.state.user.token
    },
    method: 'get'
  })
}

export const getRolesAll = () => {
  return axios.request({
    url: '/roles/all',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: 'Bearer ' + store.state.user.token
    },
    method: 'get'
  })
}

export const postRoles = role => {
  let data = {
    data: [
      { name: 'name', value: role.name },
      { name: 'permissions', value: role.permissions }
    ]
  }

  return axios.request({
    url: '/roles',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: 'Bearer ' + store.state.user.token
    },
    method: 'post'
  })
}

export const putRole = role => {
  let data = {
    data: [
      { name: 'name', value: role.name },
      { name: 'permissions', value: role.permissions }
    ]
  }

  return axios.request({
    url: '/roles/' + role.id,
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: 'Bearer ' + store.state.user.token
    },
    method: 'put'
  })
}

export const deleteRole = role => {
  return axios.request({
    url: '/roles/' + role.id,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: 'Bearer ' + store.state.user.token
    },
    method: 'delete'
  })
}
