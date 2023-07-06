import request from "@/utils/request";

export function get_cca(params) {
  return request({
    url: "/api/cca/pic",
    method: "get",
    params: { ...params },
  });
}
export function get_cep(params) {
  return request({
    url: "/api/cep/pic",
    method: "get",
    params: { ...params },
  });
}

export function get_ces(params) {
  return request({
    url: "/api/ces/PicVideo",
    method: "get",
    params: { ...params },
  });
}


export function del_ces(params) {
    return request({
        url: '/api/ces/PicVideo',
        method: 'delete',
        data:params
    })
}


export function del_cca(params) {
    return request({
        url: '/api/cca/pic',
        method: 'delete',
        data:params
    })
}

export function del_cep(params) {
    return request({
        url: '/api/cep/pic',
        method: 'delete',
        data:params
    })
}