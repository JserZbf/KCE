import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/api/ces/Notify',
        method: 'get',
        params:{...params}
    })
}

export function addNotify(params) {
    return request({
        url: '/api/ces/Notify',
        method: 'post',
        data:params
    })
}

export function delNotify(params) {
    return request({
        url: '/api/ces/Notify',
        method: 'delete',
        data:params
    })
}

export function putNotify(params) {
    return request({
        url: '/api/ces/Notify',
        method: 'put',
        data:params
    })
}