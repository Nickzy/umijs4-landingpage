import React from 'react';
import { useIntl } from 'umi';
import Upload from '../components/upload/Upload';
import SelectColor from '../components/selectColor/SelectColor';
import { Radio } from 'antd';
import useData from '../stateSider/state';
import { useState, useEffect } from 'react';

// 最外层可修改样式组件
function WrapM (props) {
    const { formatMessage } = useIntl();

    const {data, styleChange} = useData(props);
    const [tabValue, set_tabValue] = useState('color');
    useEffect(() => {
        let value = 'color';
        if (data.props) {
            if (data.props.style && data.props.style.background) {
                if (data.props.style.background.includes('url')) {
                    value = 'img';
                }
            }
        }
        set_tabValue(value);
    }, [data]);

    return <div className="WrapM_wrap">
        <Radio.Group style={{width: '100%'}} value={tabValue} onChange={(e) => { set_tabValue(e.target.value);}} buttonStyle="solid">
            <Radio.Button value="color">{formatMessage({id:'Landing_page_Form_Use_Color'})}</Radio.Button>
            <Radio.Button value="img">{formatMessage({id:'Landing_page_Form_Use_Picture'})}</Radio.Button>
        </Radio.Group>
        {
            tabValue === 'color' ?
                <SelectColor title={formatMessage({id: 'Landing_page_Form_Module_Background'})} color={data.props ? (data.props.style && data.props.style.background.includes('url')) ? '#ffffff' : data.props.style.background : '#ffffff'} change={(color) => { styleChange(color, 'background'); }}/>
                :
                <div className="img_">
                    <Upload Dispatch={props.Dispatch} change={(url) => {styleChange(`url(${url}) 0% 0% / cover no-repeat`, 'background');}} data={data}/>
                    <span>{formatMessage({id:'Landing_page_Form_max_500k'})}</span>
                </div>
        }
    </div>;
}

export default WrapM;
