/**
 * 切换tab
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Select } from 'antd';
import './index.less';

// 消息类型配置
const msgTypeOption = [
  { value: 'text', label: '文本类型' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'image', label: '图片类型' },
  { value: 'news', label: '图文类型' },
];
const { Option } = Select;

@inject('TaskStore')
@observer
class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { publishModel, msgTypeValue } = this.props.TaskStore;

    return (
      <div className="d-flex justify-content-between align-items-center f-18">
        <div>
          <div className={publishModel === 0 ? 'card-title-item title-item-active ' : 'card-title-item'} onClick={() => { return this.props.TaskStore.selectModel(0); }}>即时消息</div>
          <div className={publishModel === 1 ? 'card-title-item title-item-active ' : 'card-title-item'} onClick={() => { return this.props.TaskStore.selectModel(1); }}>定时消息</div>
        </div>
        <div>
          <Select
            defaultValue={msgTypeValue}
            className="select-small"
            style={{ width: 100 }}
            onChange={(e) => { return this.props.TaskStore.handleDropdownChange('msgTypeValue', e); }}
          >
            {
              msgTypeOption.map((item, index) => { return (<Option value={item.value} key={index}>{item.label}</Option>); })
            }
          </Select>
        </div>
      </div>
    );
  }
}
export default Tab;
