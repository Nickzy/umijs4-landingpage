import React from 'react';
import {useEffect} from 'react';
import {connect} from 'dva';
import './index.scss';
import Canvas from '../editor/content/Canvas';

function Preview (props) {
    // useEffect(() => {
    //     props.dispatch({
    //         type: ''
    //     })
    // }, [])
    function close () {
        props.close && props.close();
    }
    if (!props.show) {
        return null;
    }
    return <div className={'Preview_s_w'}>
        <header>
            <span onClick={close} className="close">
                <i className="iconfont iconjiantou-left"></i>
                <span>返回</span>
            </span>
            <i onClick={close} className="iconfont iconClosex"></i>
        </header>
        <div className="content">
            <div className="pc">
                <Canvas device="pc" isPreview={true}/>
            </div>
            <div className="mobile">
                <Canvas device="mobile"  isPreview={true}/>
            </div>
            
        </div>
    </div>;
}

export default connect(state => state.landingPage)(Preview);
