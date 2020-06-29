import React from "react";

import Meta from "@/components/meta";

export default class NotFound extends React.Component {
  static loadData({ store, match }) {
    return new Promise(async function(resolve, reject) {
      resolve({ code: 404 });
    });
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Meta title="404,无法找到该页面" />
        404,无法找到该页面
      </div>
    );
  }
}
