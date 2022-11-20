import request from "@/utils/request";


// 查询
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })


// 添加或修改
export const reqAddOrUpdataTradeMark = (tradeMark) => {
    if (tradeMark.id) {
        return request({ url: `/admin/product/baseTrademark/update`, method: 'put', data: tradeMark })
    } else {
        return request({ url: `/admin/product/baseTrademark/save`, method: 'post', data: tradeMark })
    }
}
// 删除
export const deleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })