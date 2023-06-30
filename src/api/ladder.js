import request from '@/utils/request'

export function getPicVideo(params) {
    return request({
        url: '/api/ces/PicVideo',
        method: 'get',
        params:{...params}
    })
}
export function addPicVideo(params) {
    return request({
        url: '/api/ces/PicVideo',
        method: 'post',
        data:params
    })
}
export function delPicVideo(params) {
    return request({
        url: '/api/ces/PicVideo',
        method: 'delete',
        data:params
    })
}

// 操作记录get
export function getPhysicalDelRecord(params) {
    return request({
        url: '/api/ces/PhysicalDelRecord',
        method: 'get',
        params:{...params,userId:null}
    })
}

// 操作记录post
export function addPhysicalDelRecord(params) {
    return request({
        url: '/api/ces/PhysicalDelRecord',
        method: 'post',
        data:params
    })
}
