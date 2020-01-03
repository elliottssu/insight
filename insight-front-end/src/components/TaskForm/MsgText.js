/**
 * 文本类型表单
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Input } from 'antd';

const { TextArea } = Input;

@inject('TaskStore')
@observer
class MsgText extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { publishTextContent } = this.props.TaskStore;

    return (
      <>
        <TextArea
          value={publishTextContent}
          placeholder="想说点什么..."
          maxLength={500}
          className="mt-15"
          onChange={(e) => { return this.props.TaskStore.handleTextChange('publishTextContent', e); }}
          autoSize={{ minRows: 6, maxRows: 8 }}
        />
      </>
    );
  }
}

export default MsgText;
