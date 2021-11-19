import React, { useState, useEffect } from 'react';
import { useIntl } from 'umi';
import { Input, message } from 'antd';

function Link (props) {
    const { formatMessage } = useIntl();
    const [value, set_value] = useState('');
    useEffect(() => {
        if (props.value) {
            let inputValue = (!props.isNotLink ? props.value.link : props.value.text) || '';
            set_value(inputValue);
        }
    }, [props]);
    function setValue (e) {
        set_value(e.target.value);
    }
    function linkChange (e) {
        let value = e.target.value;
        if (!props.isNotLink && (props.required || value)) {
            let regHttp = /^http[s]{0,1}:\/\/([{\w.}?]+\/?)\S*/;
            if (!regHttp.test(value)) {
                return message.error(formatMessage({id:'Landing_page_Form_enter_complete_link'}));
            }
            props.change && props.change(value);
        }
        props.textBlur && props.textBlur();
    }
    return <div className="link_wrap">
        <span className="label_s" >{props.title || formatMessage({id:'Landing_page_Form_set_link'})}</span>
        <Input value={value} onBlur={linkChange} onChange={!props.isNotLink ? setValue : props.change}/>
    </div>;
}

export default Link;
