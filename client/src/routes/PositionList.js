import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import request from '../utils/request';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from "bizcharts";
import styles from './PositionList.css';

class PositionList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      statis:[],
      dataSource: [],
      columns:
        [{
          title: '公司',
          dataIndex: 'companyFullName',
          render: (text,record)=>{
            let h = `https://www.lagou.com/gongsi/${record['companyId']}.html`;
            return (<a target='blank' href={h}>{text}</a>);
          }
        }, {
          title: '岗位',
          dataIndex: 'positionName',
          render:(text, record)=>{
            let h = `https://www.lagou.com/jobs/${record["positionId"]}.html`;
            return (<a target='blank' href={h}>{text}</a>);
          }
        }, {
          title: '薪资范围',
          dataIndex: 'salary'
        }, {
          title: '平均薪资',
          dataIndex: 'averageSalary',
          render: text => text+'k'
        }, {
          title: '规模',
          dataIndex: 'companySize'
        }, {
          title: '融资阶段',
          dataIndex: 'financeStage'
        }, {
          title: '城市',
          dataIndex: 'city'
        }, {
          title: '区域',
          dataIndex: 'district'
        }]
    };
  }

  componentWillMount() {
    this.getDate(1);
    this.getStatis();
  }

  getDate = (current)=>{
    console.log('current', current);
    request('http://127.0.0.1:8081/getPositionList?pageIndex='+current).then((data)=>{
      console.log(data);
      this.setState({
        dataSource: data.data.result,
        count: data.data.count
      });
    });
  };

  getStatis = ()=>{
    request('http://127.0.0.1:8081/getStatis').then((data)=>{
      console.log(data);
      const _data = data.data.map((d,index)=>{
        d.averageSalary = d.averageSalary + 'k';
        return d;
      });
      this.setState({
        statis: _data
      });
    });
  };

  renderChart(){
    const cols = {
      count: {
        tickInterval: 20
      }
    };

    return (
      <div>
        <h1>薪资分布</h1>
      <Chart data={this.state.statis}  forceFit>
        <Axis name="averageSalary" />
        <Axis name="count" />
        <Tooltip
          crosshairs={{
            type: "y"
          }}
        />
        <Geom type="interval" position="averageSalary*count" />
      </Chart>
      </div>
    );
  }

  renderTable = ()=>{
    return (
      <div>
        <h1>岗位列表</h1>
        <div className={styles.num}>岗位数量：{this.state.count}</div>
        <Table
          pagination={{
            showQuickJumper: true,
            pageSize: 20,
            total: this.state.count,
            onChange: (current) => {
              this.getDate(current)
            },
          }}
          dataSource={this.state.dataSource}
          columns={this.state.columns} />
      </div>
    );
  };

  // 词云
  renderWordCloud = () => {

  };

  render(){
    return(
      <div className={styles.container}>
        {this.renderTable()}
        {this.renderChart()}
      </div>
        );
  }
}

export default connect()(PositionList);
