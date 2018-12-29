import React, { Component } from 'react';
import { connect } from 'dva';
import { Table,Popover,Button, message,Input,Select } from 'antd';
import request from '../utils/request';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from "bizcharts";
import styles from './PositionList.css';
const Option = Select.Option;

class PositionList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      current: 0,
      statis:[],
      list:[['foo', 12], ['bar', 6]],
      dataSource: [],
      columns:
        [{
          title: '公司',
          dataIndex: 'companyShortName',
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
        },{
          title: '要求',
          dataIndex: 'demandHtml',
          render: (text,record) => {
             const c = <div dangerouslySetInnerHTML={{__html: text}}></div>;
             const title = `【${record['companyShortName']}】你达到要求了吗？`;
             return (
               <Popover overlayStyle={{width:'600px'}} content={c} title={title}>
                 <Button type="primary">查看</Button>
               </Popover>
             );
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
          title: '领域',
          dataIndex: 'industryField',
        },
        //   {
        //   title: '城市',
        //   dataIndex: 'city'
        // },
          {
          title: '区域',
          dataIndex: 'district'
        },{
          title: '操作',
          dataIndex: 'positionId',
          render: (text,record) => {
            if(record["attention"]){
              return '已关注';
            }
            return <div><a href="javascript:void(0)" onClick={()=>this.focus(text)}>关注</a>&nbsp;<a href="javascript:void(0)" onClick={()=>this.del(text)}>删除</a></div>
          }
        }]
    };
  }

  componentWillMount() {
    this.getDate(1);
    this.getStatis();
  }

  del = (positionId)=>{
    request('http://127.0.0.1:8081/del?id='+positionId).then((data)=>{
      message.success('删除成功');
      this.getDate(this.state.current);
    });
  };

  focus = (positionId)=>{
    request('http://127.0.0.1:8081/focus?id='+positionId).then((data)=>{
      message.success('关注成功');
      this.getDate(this.state.current);
    });
  };

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
        <div className={styles.num}>岗位数量：{this.state.count}</div>
        <Table
          pagination={{
            showQuickJumper: true,
            pageSize: 20,
            total: this.state.count,
            onChange: (current) => {
              this.setState({
                current
              });
              this.getDate(current)
            },
          }}
          dataSource={this.state.dataSource}
          columns={this.state.columns} />
      </div>
    );
  };

  // 词云
  componentDidMount = () => {
    // eslint-disable-next-line
    //WordCloud(document.getElementById('canvas'), { list: this.state.list, backgroundColor: '#f0f0f0' } );
  };


  renderCondition = ()=>{
    return (
      <div>
        <div className="item">
          <div className={styles.left}>
            <span className={styles.conditionName}>公司</span><Input style={{ width:120 }} />
          </div>
          <div className={styles.right}>
            <span className={styles.conditionName}>融资阶段</span><Select defaultValue="all" style={{ width: 120 }}><Option value="all">全部</Option></Select>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.left}>
            <span className={styles.conditionName}>规模</span><Select defaultValue="all" style={{ width: 120 }}><Option value="all">全部</Option></Select>
          </div>
          <div className={styles.right}>
            <span className={styles.conditionName}>领域</span><Select defaultValue="all" style={{ width: 120 }}><Option value="all">全部</Option></Select>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.left}>
            <span className={styles.conditionName}>工作地点</span><Select defaultValue="all" style={{ width: 120 }}><Option value="all">全部</Option></Select>
          </div>
          <div className={styles.right}>
            <span className={styles.conditionName}>真实性</span><Select defaultValue="all" style={{ width: 120 }}><Option value="all">全部</Option></Select>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.left}>
            <span className={styles.conditionName}>关注情况</span><Select defaultValue="all" style={{ width: 120 }}><Option value="all">全部</Option></Select>
          </div>
        </div>
      </div>
    );
  };

  render(){
    return(
      <div className={styles.container}>
        <h1>岗位列表</h1>
        {this.renderCondition()}
        {this.renderTable()}
        {this.renderChart()}
        {/*
         <div>
          <h1>岗位要求</h1>
          <canvas id="canvas" className={styles.canvas} ></canvas>
        </div>
        */}
      </div>
        );
  }
}

export default connect()(PositionList);
