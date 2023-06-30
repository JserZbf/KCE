
import request from '@/utils/request'

export function getImg(params) {
    return request({
        url: '/api/ces/File/download',
        method: 'get',
        params:{...params}
    })
}
