const http = uni.$u.http
// // post请求，获取菜单
// export const postMenu = (params, config = {}) => http.post('/ebapi/public_api/index', params, config)

// // get请求，获取菜单，注意：get请求的配置等，都在第二个参数中，详见前面解释
// export const getMenu = (data) => http.get('/ebapi/public_api/index', data)
export const login = (params, config = {}) => http.post('/api/login', params, config)


export const getTypeConfig = (params) => http.get('/api/PicVideoFlowTypeConfig', {params})
export const getItemConfig = (params) => http.get('/api/PicVideoFlowItemConfig', {params})


export const addPicVideo = (params, config = {}) => http.post('/api/PicVideo', params, config)
export const getPicVideo = (params) => http.get('/api/PicVideo', {params})
export const delPicVideo = (params, config = {}) => http.delete('/api/PicVideo', params, config)
