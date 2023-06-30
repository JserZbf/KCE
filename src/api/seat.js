import request from '@/utils/request'

export function getStation(params) {
    return request({
        url: '/api/cep/Station',
        method: 'get',
        params:{enable:1,...params}
    })
}
export function addStation(params) {
    return request({
        url: '/api/cep/Station',
        method: 'post',
        data:params
    })
}
export function delStation(params) {
    return request({
        url: '/api/cep/Station',
        method: 'delete',
        data:params

    })
}
export function putStation(params) {
    return request({
        url: '/api/cep/Station',
        method: 'put',
        data:params

    })
}

// 操作记录get
export function getPhysicalDelRecord(params) {
    return request({
        url: '/api/cep/PhysicalDelRecord',
        method: 'get',
        params:{...params}
    })
}
