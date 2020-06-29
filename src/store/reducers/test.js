import merge from 'lodash/merge';

let initialState = {
  categories: [],
  list: [],
  detailInfo: {},
  page: 1,
  detail: {}
};

export default function test(state = initialState, action = {}) {
  switch (action.type) {
    case 'GET_CATEGORY':
      state.categories = action.categories
      return merge({}, state);

    case 'GET_LIST':
      state.list = [...state.list, ...action.list]
      state.page = action.page
      return merge({}, state);
    case "GET_DETAIL_INFO":
      state.detailInfo = action.detailInfo
      return merge({}, state);

    default:
      return state;
  }
}