/**
 * 日志部分
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import dayjs from 'dayjs';
import { Tooltip } from 'antd';

import './index.less';


@inject('LogStore')
@observer
class Log extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
  }

  renderTitle = (item) => {
    const content = item.replace(/(\r\n)|(\n)/g, '<br />');
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  render() {
    const { logList } = this.props.LogStore;

    return (
      <section className="card-warp mt-20">
        <div className="card-title title-main">
          <span className="color-white-normal f-18">历史执行记录</span>
          <span className="color-white-light f-14 ml-8">（最近5条执行记录）</span>
        </div>
        <div className="card-content">

          {logList.length
            ? (
              <div>

                {
                  logList.map((item, index) => {
                    return (
                      <Tooltip title={this.renderTitle(item.remark || '')} key={index}>
                        <div className="content-item d-flex justify-content-around align-items-center">
                          <div className="m-w-150">{dayjs(item.createDate).format('YYYY年MM月DD日 HH:mm:ss')}</div>
                          <div className="ml-5px m-w-50 text-nowrap">
                            {item.methond === '0' ? '手动触发' : '自动触发'}
                            ：
                            {item.remark || ''}
                          </div>
                          <div className="ml-auto">{item.status === '0' ? '执行失败' : '执行成功'}</div>
                        </div>
                      </Tooltip>

                    );
                  })
                }
              </div>
            )
            : (<p className="text-center pt-40">暂无执行日志</p>)}
        </div>
      </section>

    );
  }
}
export default Log;
