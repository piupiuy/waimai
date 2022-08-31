// 对api接口进行统一的管理
import axios from "axios";
import requests from "./request";
import secRequests from './secRequest';

// 经纬度
export const reqGeo=()=>secRequests({url:'/location/ip?ak=7khcth5v6N9ddhW0spLMGg8ZuF5HAbzq&coor=bd09ll',method:"get"})
// 获取地址
export const reqAddress=(geo)=>requests({url:`https://restapi.amap.com/v3/geocode/regeo?key=e544ab803ee4e148744a8ed5a3055f03&location=${geo}`,method:"post"})
// 获取首页商店信息
export const reqGoods=(params)=>requests({url:'/api/goods',method:"post",data:params})
// 获取图片
export const reqImgs=(params)=>requests({url:'getImg',method:"post",data:params})
// 获取分类
export const reqType=(params)=>requests({url:'/api/category',method:"post",data:params})
