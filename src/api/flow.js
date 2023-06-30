import request from '@/utils/request'

export function getPicVideoFlowItemConfig(params) {
    return request({
        url: '/api/ces/PicVideoFlowItemConfig',
        method: 'get',
        params:{...params,enable:1}
    })
}
export function addPicVideoFlowItemConfig(params) {
    return request({
        url: '/api/ces/PicVideoFlowItemConfig',
        method: 'post',
        data:params
    })
}
export function delPicVideoFlowItemConfig(params) {
    return request({
        url: '/api/ces/PicVideoFlowItemConfig',
        method: 'delete',
        data:params

    })
}
export function putPicVideoFlowItemConfig(params) {
    return request({
        url: '/api/ces/PicVideoFlowItemConfig',
        method: 'put',
        data:params

    })
}

export function getPicVideoFlowTypeConfig(params) {
    return request({
        url: '/api/ces/PicVideoFlowTypeConfig',
        method: 'get',
        params:{...params,enable:1}
    })
}
export function addPicVideoFlowTypeConfig(params) {
    return request({
        url: '/api/ces/PicVideoFlowTypeConfig',
        method: 'post',
        data:params
    })
}
export function delPicVideoFlowTypeConfig(params) {
    return request({
        url: '/api/ces/PicVideoFlowTypeConfig',
        method: 'delete',
        data:params

    })
}
export function putPicVideoFlowTypeConfig(params) {
    return request({
        url: '/api/ces/PicVideoFlowTypeConfig',
        method: 'put',
        data:params

    })
}