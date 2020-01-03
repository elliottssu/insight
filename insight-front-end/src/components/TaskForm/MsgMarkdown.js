/**
 * markdown类型表单
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Input } from 'antd';

const { TextArea } = Input;

@inject('TaskStore')
@observer
class MsgMarkdown extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { publishMarkdownContent } = this.props.TaskStore;

    return (
      <>
        <TextArea
          value={publishMarkdownContent}
          placeholder="请输入markdown格式的内容"
          maxLength={500}
          className="mt-15"
          onChange={(e) => { return this.props.TaskStore.handleTextChange('publishMarkdownContent', e); }}
          autoSize={{ minRows: 6, maxRows: 8 }}
        />
      </>
    );
  }
}

export default MsgMarkdown;
