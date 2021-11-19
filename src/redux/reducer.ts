import {CHANGE_INPUT} from './actionType';
const defaultState = {
    type: CHANGE_INPUT,
    inputValue: "redux",
    list: []
}  //默认数据
// state: 指的是原始仓库里的状态。
// action: 指的是action新传递的状态。
export default (state = defaultState, action: any) => {  //就是一个方法函数

    if(state.type === action.type) {
        let newState = JSON.parse(JSON.stringify(state)) //深度拷贝state
        newState.inputValue = action.inputValue;
        newState.list = action.list;
        return newState;
    }
    
    return state
}