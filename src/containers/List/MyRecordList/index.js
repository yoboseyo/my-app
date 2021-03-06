import React, { Component } from 'react';
import style from './index.css';
import {ActivityIndicator, Tabs,} from 'antd-mobile';
import {connect} from "react-redux";
import {RecordReleaseItem,RecordPurchaseItem} from "components/RecordItem";
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import Blank from "components/Blank";
const TabPane = Tabs.TabPane;

class MyRecordList extends Component {
	state = {
		loading:false,
		recordings:[],
		type:"created",
		page:1
	}
	componentDidMount(){
		this.getList();
	}
	getList = ()=>{
		this.setState({
			loading:true
		})
		window.HOCFetch({ needToken:true })(global.url.doctors_recordings + "?token=" + this.props.userInfo.token + "&type="+ this.state.type +"&page="+ this.state.page + "&per_page=10")
		.then((response)=>response.json())
		.then((data)=>{
			this.setState({
				loading:false,
				recordings:this.state.recordings.concat(data.recordings),
				total_pages:data.meta.total_pages
			})
		})
	}
	scrollEnd = (iScrollInstance) =>{
		if(
			Math.abs(iScrollInstance.scrollerHeight)>iScrollInstance.wrapperHeight &&
			iScrollInstance.maxScrollY === iScrollInstance.y &&
			this.state.page < this.state.total_pages
		){
			console.log("到达最底部")
			this.setState({
				page:this.state.page+1
			},()=>{
				this.getList()
			})
		}
	}
	render() {
		let {recordings} = this.state;
		return (
			<div className={style.myRecordList}>
				<Tabs swipeable={false} defaultActiveKey="created" onTabClick={(key)=>{
						this.setState({
							type:key,
							page:1,
							recordings:[]
						},()=>{
							this.getList();
						})
					}}>
					<TabPane tab="已发起" key="created" className={style.tabItemWrap}  >
						{
							recordings.length>0 ?
							<ReactIScroll
								iScroll={iScroll}
								options={{...global.iscrollOptions}}
								onScrollEnd={this.scrollEnd}
							>
								<div>
									{
										recordings.map((item,index)=>{
											return <RecordReleaseItem key={item.id} {...item} />
										})
									}
								</div>
							</ReactIScroll>
							:
							<div className={style.blank}>
								<Blank text="暂无已发起的录播"/>
							</div>
						}
					</TabPane>
					<TabPane tab="已购买" key="bought" className={style.tabItemWrap} >
						{
							recordings.length>0 ?
							<ReactIScroll
								iScroll={iScroll}
								options={{...global.iscrollOptions}}
								onScrollEnd={this.scrollEnd}
							>
								<div>
									{
										recordings.map((item,index)=>{
											return <RecordPurchaseItem key={item.id} {...item} />
										})
									}
								</div>
							</ReactIScroll>
							:
							<div className={style.blank}>
								<Blank text="暂无已购买的录播"/>
							</div>
						}
					</TabPane>
				</Tabs>
				<ActivityIndicator toast animating={this.state.loading} />
			</div>
		);
	}
}

export default connect (
	(state)=>{
		return {
			userInfo:state.userInfo
		}
	},
	(dispatch)=>{
		return {
		}
	}
)(MyRecordList);










