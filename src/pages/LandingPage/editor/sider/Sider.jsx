import React from 'react';
import { Drawer } from 'antd';
import './Sider.scss';
import {connect} from 'dva';
import Img from './viewModules/ImgM';
import FormSelf from './viewModules/FormSelf';
import Text from './viewModules/TextM';
import ButtonM from './viewModules/ButtonM';
import WrapM from './viewModules/WrapM';

function Sider (props) {
    function close () {
        props.dispatch({
            type: 'landingPage/siderStatusChange',
            siderShow: false
        });
    }
    function Mochange (data, textChange) {
        props.dispatch({
            type: 'landingPage/activeDataChange',
            data,
            pagechange: true,
            inputOnBlur: textChange,
            forbiddenClick: false
        });
    }
    function textBlurM () {
        props.dispatch({
            type: 'landingPage/textOnBlur',
            inputOnBlur: false
        });
    }
    function getDom () {
        let {activeData} = props;
        console.log('activeData', activeData);
        if (activeData.key) {
            if (activeData.key.includes('imgData') || activeData.key.includes('logo')) {
                return <Img onError={(e)=>{e.target.src = '';}}Dispatch={props.dispatch} change={Mochange} data={activeData.data}/>;
            }
            if (activeData.key.includes('textData')) {
                return <Text textBlur={textBlurM} change={Mochange} data={activeData.data}/>;
            }
            if (activeData.key.includes('formData')) {
                return <FormSelf Dispatch={props.dispatch} change={Mochange} data={activeData.data}/>;
            }
            if (activeData.key.includes('buttonData')) {
                return <ButtonM textBlur={textBlurM} change={Mochange} data={activeData.data}/>;
            }
            if (activeData.data) {
                return <WrapM Dispatch={props.dispatch} change={Mochange} data={activeData.data} />;
            }
        }
        return '暂无数据';
    }
    if (!props.siderShow) {
        return null;
    }
    return <div className="sider_wrap_s site-drawer-render-in-current-wrapper">
        <Drawer
            // title="Basic Drawer"
            placement="right"
            closable={false}
            onClose={close}
            visible={props.siderShow}
            mask={false}
            getContainer={false}
            style={{ position: 'absolute', width: '300px' }}
        >
            {getDom()}
        </Drawer>
    </div>;
}

export default connect(state => state.landingPage)(Sider);
