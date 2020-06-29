import http from '@/utils/http'

function getCategoryAction(categories) {
  return {
    type: "GET_CATEGORY",
    categories
  }
}

export function getCategory() {
  return dispatch => {
    return new Promise((resolve, reject) => {

      http.get('/api/services/app/Category/GetAll')
        .then(data => {
          if (data && data.success) {
            dispatch(getCategoryAction(data.result.items))
            resolve(data)
          } else {
            reject && reject(data)
          }
        }, err => {
          reject && reject(err)
        })
    })
  }
}


function getListActions(list, page) {
  return {
    type: "GET_LIST",
    list,
    page: page + 1
  }
}

export function getList(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      http.get("/api/v1/topics", {
          params
        })
        .then(data => {
          if (data && data.success) {
            let {
              page
            } = params
            dispatch(getListActions(data.data, page))
            resolve(data)
          } else {
            reject(data)
          }
        }, err => {
          reject && reject(err)
        })
    })
  }
}



function getDetailAction(detailInfo) {
  return {
    type: "GET_DETAIL_INFO",
    detailInfo
  }
}

export function getDetail(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      http.get(`/api/v1/topic/${params.id}`)
        .then(data => {
          if (data && data.success) {
            dispatch(getDetailAction(data.data))
            resolve(data)
          } else {
            reject && reject(data)
          }
        }, err => {
          reject && reject(err)
        })
    })
  }
}