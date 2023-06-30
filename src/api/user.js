import request from '@/utils/request'

export function getUser(params) {
    return request({
        url: '/api/cep/user',
        method: 'get',
        params:{enable:1,...params}
    })
}
export function addUser(params) {
    return request({
        url: '/api/cep/user',
        method: 'post',
        data:params
    })
}
export function delUser(params) {
    return request({
        url: '/api/cep/user',
        method: 'delete',
        data:params

    })
}
export function putUser(params) {
    return request({
        url: '/api/cep/user',
        method: 'put',
        data:params

    })
}
export function setPassword(params) {
    return request({
        url: '/api/cep/Password',
        method: 'post',
        data:params

    })
}