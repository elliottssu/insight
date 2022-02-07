/**
 * 时间组件
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Select, Switch, Input, Icon, Tooltip } from 'antd';

const { Option } = Select;

@inject('TaskStore')
@observer
class Timing extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  // 生成时间
  generateTime = (type, len) => {
    const option = [];
    for (let i = 0; i < len; i++) {
      let time = String(i);
      if (i < 10) {
        time = `0${time}`;
      }
      option.push({
        type,
        value: time,
        label: time,
      });
    }
    return option;
  }

  render() {
    // 时分秒
    const hourOption = this.generateTime('hourValue', 24);
    const minuteOption = this.generateTime('minuteValue', 60);
    const secondOption = this.generateTime('secondValue', 60);
    // 周
    const weekOption = [{ value: '7', label: '日' }, { value: '1', label: '一' }, { value: '2', label: '二' }, { value: '3', label: '三' }, { value: '4', label: '四' }, { value: '5', label: '五' }, { value: '6', label: '六' }];


    const {
      hourValue, minuteValue, secondValue, weekList, publishCronText, publishIsWorkday, publishIsCustomizeCron, publishCustomizeCron,
    } = this.props.TaskStore;

    return (
      <>
        <div className="form-area mb-15 ">


          <div className="mb-20 text-right mr-16">
            <Switch size="small" checked={publishIsCustomizeCron} onChange={(e) => { return this.props.TaskStore.handleSwitchChange('publishIsCustomizeCron', e); }} />
            <span className="ml-8">自定义cron表达式</span>
          </div>

          {/* 自定义cron表达式 */}
          {
            publishIsCustomizeCron && (
              <div className=" d-flex flex-column justify-content-center align-items-center mt-30">
                <div className="m-w-250">
                  <Input size="large" maxLength="12" placeholder="输入自定义cron表达式" value={publishCustomizeCron} onChange={(e) => { return this.props.TaskStore.handleTextChange('publishCustomizeCron', e); }}></Input>
                </div>

                <div className="mt-15 color-white-light">
                  Cron表达式使用请点击访问 <a href="https://crontab.guru/#1/30_*_*_*_*" rel="noopener noreferrer" target="_blank" className="a-gray">https://crontab.guru/</a>
                </div>

                <div className="mt-4px color-white-light">
                  表达式不正确会导致定时任务失败，请务必按照上方链接格式填写
              </div>
              </div>
            )
          }

          {/* 日历选择型 */}
          {
            !publishIsCustomizeCron && (
              <div className="mt-20">
                <div className="d-flex justify-content-center align-items-center">
                  <Select
                    value={hourValue}
                    style={{ width: 60 }}
                    suffixIcon={(<i />)}
                    className="select-simple"
                    dropdownClassName="select-list"
                    onChange={(e) => { return this.props.TaskStore.handleDropdownChange('hourValue', e); }}
                  >
                    {
                      hourOption.map((item, index) => { return (<Option value={item.value} key={index}>{item.label}</Option>); })
                    }
                  </Select>
                  <span className="ml-6 mr-6 f-weight-bold">:</span>
                  <Select
                    value={minuteValue}
                    style={{ width: 60 }}
                    suffixIcon={(<i />)}
                    className="select-simple"
                    dropdownClassName="select-list"
                    onChange={(e) => { return this.props.TaskStore.handleDropdownChange('minuteValue', e); }}
                  >
                    {
                      minuteOption.map((item, index) => { return (<Option value={item.value} key={index}>{item.label}</Option>); })
                    }
                  </Select>
                  <span className="ml-6 mr-6 f-weight-bold">:</span>
                  <Select
                    disabled
                    value={secondValue}
                    style={{ width: 60 }}
                    suffixIcon={(<i />)}
                    className="select-simple"
                    dropdownClassName="select-list"
                    onChange={(e) => { return this.props.TaskStore.handleDropdownChange('secondValue', e); }}
                  >
                    {
                      secondOption.map((item, index) => { return (<Option value={item.value} key={index}>{item.label}</Option>); })
                    }
                  </Select>
                </div>
                <div className="d-flex justify-content-center align-items-center mt-20">
                  {weekOption.map((item, index) => {
                    return (<span key={index} className={weekList.includes(item.value) ? 'label-block label-block-active' : 'label-block'} onClick={() => { return this.props.TaskStore.handleWeekChange(item.value); }}>{item.label}</span>);
                  })}
                  <span />
                </div>
                <div className="d-flex justify-content-center align-items-center mt-20">
                  <Switch size="small" checked={publishIsWorkday} onChange={(e) => { return this.props.TaskStore.handleSwitchChange('publishIsWorkday', e); }} />
                  <span className="ml-8">工作日（智能跳过节假日）</span>
                </div>
              </div>
            )
          }



          <div className="text-center f-20 mt-20">{publishCronText}</div>
        </div>
      </>
    );
  }
}

export default Timing;
