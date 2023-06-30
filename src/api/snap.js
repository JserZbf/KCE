import request from '@/utils/request'

export function getPic(params) {
    return request({
        url: '/api/cep/pic',
        method: 'get',
        params:{...params}
    })
}

export function delPic(params) {
    return request({
        url: '/api/cep/pic',
        method: 'delete',
        data:params
    })
}