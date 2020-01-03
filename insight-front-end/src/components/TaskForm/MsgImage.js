/**
 * image类型表单
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Input } from 'antd';

const { TextArea } = Input;

@inject('TaskStore')
@observer
class MsgImage extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { publishImageBase65, publishImageMd5 } = this.props.TaskStore;

    return (
      <>
        <TextArea
          value={publishImageMd5}
          placeholder="发布图片的MD5"
          maxLength={30}
          className="mt-15"
          onChange={(e) => { return this.props.TaskStore.handleTextChange('publishImageMd5', e); }}
          autoSize={{ minRows: 2, maxRows: 2 }}
        />
        <TextArea
          value={publishImageBase65}
          placeholder="发布图片的Base64"
          className="mt-15"
          onChange={(e) => { return this.props.TaskStore.handleTextChange('publishImageBase65', e); }}
          autoSize={{ minRows: 6, maxRows: 8 }}
        />
        <div className="color-white-light mt-15 mb-6">
          <p className="mb-3px">
            将图片转化为Md5，请点击
                        <a rel="noopener noreferrer" href="https://md5file.com/calculator" target="_blank" className="a-main">这里</a>
          </p>
          <p className="mb-3px">
            将图片转化为Base64，请点击
                        <a rel="noopener noreferrer" href="https://www.browserling.com/tools/file-to-base64" className="a-main" target="_blank">这里</a>
          </p>
          <p>图片太大有可能会发送失败</p>
        </div>
      </>
    );
  }
}

export default MsgImage;
