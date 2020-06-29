import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import Meta from "@/components/meta";
import { withRouter } from "react-router";
import { getDetail } from "@/store/actions/test";

import './index.scss'

function Detail({ detailInfo, match, ...props }) {
  return (
    <Fragment>
      <Meta title={detailInfo.title}>
        <meta name="description" content={detailInfo.title}></meta>
      </Meta>
      <div>id: { match.params && match.params.id || ''}</div>
      <div>{detailInfo.title}</div>
      <div className='detail-content' dangerouslySetInnerHTML={{ __html: detailInfo.content }}></div>
    </Fragment>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    detailInfo: state.test.detailInfo,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // getDetail: (params) => dispatch(getDetail(param))
  };
};

Detail = connect(mapStateToProps, mapDispatchToProps)(Detail);
Detail.preFetch = ({ store, match, query }) => {
  return new Promise(async function (resolve, reject) {
    let { dispatch, getState } = store;

    const promises = [dispatch(getDetail(match.params))];
    const [data] = await Promise.all(promises);
    resolve({
      code: 200,
    });
  });
};

export default Detail;
