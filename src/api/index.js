import request from '@/utils/request'

export function login(params) {
    return request({
        url: '/api/cep/login',
        method: 'post',
        data:params
    })
}
