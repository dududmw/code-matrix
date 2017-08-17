/**
 * Created by yaoyi on 2017/8/17.
 */
import Promise from 'es6-promise';

function routeInList(route,list){
    for(let i=0;i<list.length;i++){
        let rule=list[i];
        if(typeof rule=='string'&&~route.indexOf(rule)){
            return true;
        }
        if(rule!=null&&typeof rule.test=='function'&&rule.test(route)){
            return true;
        }
    }
    return false;
}
function next(middlewares,now,resolve){
    this.__now=now;
    if(now>=middlewares.length){
        resolve(this);
        return;
    }

    let {whiteList,blackList}=this;
    Array.isArray(whiteList)||(whiteList=[]);
    Array.isArray(blackList)||(blackList=[]);
    let nowMiddleware=middlewares[now];
    const {route,cb}=nowMiddleware;
    let inWhiteList=routeInList(route,whiteList),
        inBlackList=routeInList(route,blackList);
    let nnext=next.bind(this,middlewares,now+1,resolve);
    if(!inBlackList&&inWhiteList){
        let r=cb.call(this,nnext);
        if(!(r instanceof Promise)&&this.__now==now){
            resolve(this);
            return;
        }
    }
    else{
        nnext();
    }

}
export default class Router{
    constructor(){
        this.middlewares=[];
    }
    use(route,cb){
        if(typeof route=='string'&&typeof cb=='function'){
            this.middlewares.push({route,cb});
        }
    }
    send(context){
        const {middlewares}=this;
        return new Promise((resolve,reject)=>{
            next.call(context,middlewares,0,resolve);
        });
    }
}