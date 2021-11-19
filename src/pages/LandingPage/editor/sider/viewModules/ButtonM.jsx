import React from 'react';
import { useIntl } from 'umi';
import Link from '../components/link/Link';
import SelectColor from '../components/selectColor/SelectColor';
import useData from '../stateSider/state';

// 按钮样式组件
function ButtonM (props) {
    const { formatMessage } = useIntl();
    const {data, styleChange, textChange, setLink, textBlur} = useData(props);
    return <div className="button_wrap">
        <Link  isNotLink={true} title={formatMessage({id:'Landing_page_Form_Button_Text'})}  textBlur={textBlur} value={data} change={textChange}/>
        <Link title={formatMessage({id:'Landing_page_Form_set_link_option'})} required={true} value={data} change={setLink}/>
        <div className="button_style_s">
            <span className="title">{formatMessage({id: 'landing_page_Button_Style'})}</span>
            <SelectColor color={data.props.style.color} change={styleChange} title={formatMessage({id: 'landing_page_Text'})}/>
            <SelectColor color={data.props.style.background} change={(color) => { styleChange(color, 'background'); }} title={formatMessage({id: 'landing_page_Button'})}/>
        </div>
    </div>;
}

export default ButtonM;
