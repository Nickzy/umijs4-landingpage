import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Canvas from './Canvas';
import './Content.scss';
import {Radio} from 'antd';
import {customize} from '../../../../../helpers/auth';
import {useIntl} from 'umi';

function Content (props) {
    const { formatMessage } = useIntl();
    const [contentprops, set_contentprops] = useState({});
    const [tabValue, set_tabValue] = useState('pc');
    useEffect(() => {
        set_contentprops({
            ...contentprops,
            style: {
                width: props.width ? `${props.width}px` : '100%'
            }
        });
    }, [props.width]);
    function deviceChange (e) {
        set_tabValue(e.target.value);
    }
    return <div className="content_wrap_land" {...contentprops}>
        <div className="tab_s">
            <Radio.Group style={{width: '100%'}} value={tabValue} onChange={deviceChange} buttonStyle="solid">
                <Radio.Button value="pc">
                    <i className="iconfont icondiannao1"></i>
                </Radio.Button>
                <Radio.Button value="mobile">
                    <i className="iconfont iconshouji3"></i>
                </Radio.Button>
            </Radio.Group>
        </div>
        <div className={`content_canvas_wrap ${tabValue === 'pc' ? '' : 'content_canvas_mobile'}`} style={{width: tabValue === 'pc' ? '80%' : '375px', height: props.height}}>
            <Canvas device={tabValue}/>
        </div>
        <div className="p_w">
            <span>
                {`${formatMessage({id: 'landing_page_screen_p'})}：${tabValue === 'pc' ? (props.width ? `${props.width < 1200 ? customize.changeDataTypeEn(props.width / 1200 * 100, 0) : 100}%` : '100%') : '100%'}`}
            </span>
        </div>
    </div>;
}

export default Content;
