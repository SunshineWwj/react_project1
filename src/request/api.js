import request from './request'

//注册
export const RegisterApi = (params) => request.post('/register', params)

//登录
export const LoginApi = (params) => request.post('/login', params)

//获取文章列表
export const ArticleListApi = (params) => request.get('/article', {
    params
})

//新增文章
export const ArticleAddApi = (params) => request.post('/article/add', params)

//查询文章详情
export const ArticleDetailApi = (params) => request.get(`/article/${params.id}`)

//修改文章
export const ArticleUpdateApi = (params) => request.put('/article/update',params)

//删除文章
export const ArticleDelApi = (params) => request.post('/article/remove',params)

//查询用户资料
export const UserDataGetApi = () => request.get('/info')

//修改用户资料
export const UserDataUpdateApi = (params) => request.put('/info',params)