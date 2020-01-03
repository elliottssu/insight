/**
 * 图文类型表单
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Input } from 'antd';

const { TextArea } = Input;

@inject('TaskStore')
@observer
class MsgNews extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const {
      publishNewsTitle, publishNewsDescription, publishNewsUrl, publishNewsPicurl,
    } = this.props.TaskStore;

    return (
      <>
        <TextArea
          value={publishNewsTitle}
          placeholder="标题"
          maxLength={30}
          className="mt-15"
          onChange={(e) => { return this.props.TaskStore.handleTextChange('publishNewsTitle', e); }}
          autoSize={{ minRows: 2, maxRows: 2 }}
        />
        <TextArea
          value={publishNewsDescription}
          placeholder="描述（选填）"
          maxLength={200}
          className="mt-15"
          onChange={(e) => { return this.props.TaskStore.handleTextChange('publishNewsDescription', e); }}
          autoSize={{ minRows: 6, maxRows: 8 }}
        />
        <TextArea
          value={publishNewsUrl}
          placeholder="要跳转的链接"
          className="mt-15"
          maxLength={100}
          onChange={(e) => { return this.props.TaskStore.handleTextChange('publishNewsUrl', e); }}
          autoSize={{ minRows: 2, maxRows: 3 }}
        />
        <TextArea
          value={publishNewsPicurl}
          placeholder="图片链接（选填）"
          className="mt-15"
          maxLength={100}
          onChange={(e) => { return this.props.TaskStore.handleTextChange('publishNewsPicurl', e); }}
          autoSize={{ minRows: 2, maxRows: 3 }}
        />
      </>
    );
  }
}

export default MsgNews;
