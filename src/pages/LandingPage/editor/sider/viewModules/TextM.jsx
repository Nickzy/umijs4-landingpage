import React from 'react';
import { useIntl } from 'umi';
import Link from '../components/link/Link';
import SelectColor from '../components/selectColor/SelectColor';
import { Input } from 'antd';
import useData from '../stateSider/state';
const { TextArea } = Input;

// 文字样式组件
function Text (props) {
    const { formatMessage } = useIntl();
    const {data, styleChange, textChange, textBlur, setLink} = useData(props);
    // 阻止多行文本框换行
    function textareaKeydown () {
        let e = window.event || arguments[0];
        if (e.key === 'Enter' || e.code === 'Enter' || e.keyCode === 13) {
            e.returnValue = false;
            return false;
        }
    }
    return <div className="text_wrap">
        <div className="text_area_s">
            <span className="label_s">
                {formatMessage({id:'Landing_page_Form_Input_Text'})}
            </span>
            <TextArea onBlur={textBlur} onPressEnter={textareaKeydown} onChange={textChange} value={data.text} style={{height: '100px', resize: 'none'}}/>
        </div>
        <Link change={setLink}  value={data}/>
        <SelectColor change={styleChange} color={data.props.style.color}/>
    </div>;
}

export default Text;
