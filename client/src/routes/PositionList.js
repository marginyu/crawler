import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import request from '../utils/request';


class PositionList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
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
          title: '薪资',
          dataIndex: 'salary'
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

  render(){
    return(<Table
    pagination={{
      pageSize: 20,
      total: this.state.count,
      onChange: (current) => {
        this.getDate(current)
      },
    }}
    dataSource={this.state.dataSource}
    columns={this.state.columns} />);
  }
}

export default connect()(PositionList);
