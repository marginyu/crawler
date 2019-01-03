import React, { Component } from 'react';
import { connect } from 'dva';
import { Table,Popover,Button, message,Input,Select } from 'antd';
import request,{post} from '../utils/request';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from "bizcharts";
import styles from './PositionList.css';
import config from '../config/index';
const Option = Select.Option;

class PositionList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      financeStage: 'all',
      size: 'all',
      district: 'all',
      realFlag: 'all',
      focusFlag: 'all',
      field: 'all',
      sort: 0,
      condition:{
        financeOptions:[],
        sizeOptions:[],
        fieldOptions:[],
        districtOptions:[],
      },
      current: 1,
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
          width: 200,
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
            let focusContent = null;
            let delContent = null;
            if(record["attention"] == 1){
              focusContent = <a href="javascript:void(0)" onClick={()=>this.focus(text, false)}>取消关注</a>
            }else{
              focusContent = <a href="javascript:void(0)" onClick={()=>this.focus(text)}>关注</a>
            }
            if(record["flag"] == 0){
              delContent = <a href="javascript:void(0)" onClick={()=>this.del(record["companyId"])}>删除</a>;
            }else{
              delContent = <a href="javascript:void(0)" onClick={()=>this.del(record["companyId"], false)}>恢复</a>;
            }
            return <div>{focusContent}&nbsp;{delContent}</div>
          }
        }]
    };
  }

  componentWillMount() {
    this.getData(1);
    this.getStatis();
  }

  del = (companyId, flag = true)=>{
    const params = {
      id: companyId,
      flag
    };
    post(`${config.server}/del`, params).then((data)=>{
      message.success('操作成功');
      this.getData(this.state.current);
    });
  };

  focus = (positionId, flag = true)=>{
    const params = {
      id: positionId,
      flag,
    };
    post(`${config.server}/focus`, params).then((data)=>{
      message.success('操作成功');
      this.getData(this.state.current);
    });
  };

  getData = (current)=>{
    console.log('current', current);
    const {financeStage,size,field,district,realFlag,focusFlag,sort} = this.state;
    const params = {
      financeStage,
      size,
      field,
      district,
      realFlag,
      focusFlag,
      sort,
      pageIndex: current
    };
    post(`${config.server}/getPositionList`, params).then((data)=>{
      console.log('获取职位列表', data);
      if(data !== false){
        this.setState({
          dataSource: data.result,
          count: data.count
        });
        if(data.condition.districtOptions.length > 0){
          this.setState({
            condition:data.condition
          });
        }
      }
    });
  };

  getStatis = ()=>{
    request(`${config.server}/getStatis`).then((data)=>{
      console.log('获取统计信息', data);
      if(data !== false){
        const _data = data.map((d,index)=>{
          d.averageSalary = d.averageSalary + 'k';
          return d;
        });
        this.setState({
          statis: _data
        });
      }
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
      <Chart data={this.state.statis}  forceFit height={500}>
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
            current: this.state.current,
            showQuickJumper: true,
            pageSize: 20,
            total: this.state.count,
            onChange: (current) => {
              this.setState({
                current
              });
              this.getData(current)
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


  handleChange = (key, value) => {
    console.log(`selected ${value}`);
    const obj = {};
    obj[key] = value;
    obj.current = 1;
    this.setState(obj, ()=>{
      this.getData();
    });
  };


  renderCondition = ()=>{
    const {condition} = this.state;
    return (
      <div>
        <div className="item">
          <div className={styles.left}>
            <span className={styles.conditionName}>公司</span><Input style={{ width:120 }} />
          </div>
          <div className={styles.right}>
            <span className={styles.conditionName}>融资阶段</span><Select onChange={(value)=>this.handleChange('financeStage', value)} defaultValue="all" style={{ width: 120 }}>
            <Option value="all">全部</Option>
            {
              condition.financeOptions.map((item)=>{
                return  <Option value={item}>{item}</Option>;
              })
            }
          </Select>

          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.left}>
            <span className={styles.conditionName}>规模</span><Select onChange={(value)=>this.handleChange('size', value)} defaultValue="all" style={{ width: 120 }}>
            <Option value="all">全部</Option>
            {
              condition.sizeOptions.map((item)=>{
                return  <Option value={item}>{item}</Option>;
              })
            }
          </Select>
          </div>
          <div className={styles.right}>
            <span className={styles.conditionName}>领域</span>
            <Select onChange={(value)=>this.handleChange('field', value)} defaultValue="all" style={{ width: 120 }}>
              <Option value="all">全部</Option>
              {
                condition.fieldOptions.map((item)=>{
                  return  <Option value={item}>{item}</Option>;
                })
              }
            </Select>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.left}>
            <span className={styles.conditionName}>工作地点</span>
            <Select onChange={(value)=>this.handleChange('district', value)} defaultValue="all" style={{ width: 120 }}>
              <Option value="all">全部</Option>
              {
                condition.districtOptions.map((item)=>{
                  return  <Option value={item}>{item}</Option>;
                })
              }
            </Select>
          </div>
          <div className={styles.right}>
            <span className={styles.conditionName}>真实性</span>
            <Select onChange={(value)=>this.handleChange('realFlag', value)} defaultValue="all" style={{ width: 120 }}>
            <Option value="all">全部</Option>
            <Option value="1">真实</Option>
            <Option value="0">虚假</Option>
          </Select>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.left}>
            <span className={styles.conditionName}>关注情况</span>
            <Select onChange={(value)=>this.handleChange('focusFlag', value)} defaultValue="all" style={{ width: 120 }}>
              <Option value="all">全部</Option>
              <Option value="1">已关注</Option>
              <Option value="0">未关注</Option>
            </Select>
          </div>
          <div className={styles.right}>
            <span className={styles.conditionName}>排序</span>
            <Select onChange={(value)=>this.handleChange('sort', value)} defaultValue="0" style={{ width: 120 }}>
              <Option value="0">平均工资降序</Option>
              <Option value="1">工资上限降序</Option>
              <Option value="2">工资下限降序</Option>
            </Select>
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
