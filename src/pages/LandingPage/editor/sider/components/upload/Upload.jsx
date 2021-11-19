import React from 'react';
import OSS from 'ali-oss';
import { useIntl } from 'umi';
import { customize } from '../../../../../../../helpers/auth';
import { message } from 'antd';

function Upload (props) {
    const { formatMessage } = useIntl();

    function click (e) {
        if (e.target && e.target.children && e.target.children[0] && e.target.children[0].focus) {
            e.target.children[0].focus();
        }
    }
    function getFile (e) {
        let file = e.target.files[0];
        if (!file) {
            return false;
        }
        if (file.size > 1024 * 500) {
            return message.error(formatMessage({id:'landing_page_Picture_must_be_within_500k'}));
        }
        props.Dispatch({
            type: 'landingPage/forbiddenCLICK',
            forbiddenClick: true
        });
        customize.getSTSToken(file.size).then(res => {
            let client = new OSS(customize.options);
            let url = customize.generateFileName({ type: file.type, size: file.size });
            client.put(url, file, {
            }).then(res => {
                if (res.res.status === 200) {
                    props.change && props.change(res.url);
                } else {
                    message.error(res.message);
                }
            });
        });
    }
    let src = '';
    if (props.data && props.data.src) {
        src = props.data.src;
    }
    if (props.data.props && props.data.props.style && props.data.props.style.background && props.data.props.style.background.includes('url')) {
        let str = props.data.props.style.background.match(/\((.+?)\)/g)[0];
        if (str) {
            src = str.replace(/[\(]|\)/g, '');
        }
    }
    return <div className="upload_s_w" onClick={click}>
        <input id="u_input" style={{display: 'none'}} onChange={getFile} type='file' accept='image/*' />
        <label className="label_s" htmlFor="u_input">
            {
                src ?
                    <div style={{width: '100%', height: '100%', position: 'relative'}}>
                        <img onError={(e)=>{e.target.src = '';}}src={src} alt=""/>
                        <div className="g_h" style={{position: 'absolute', bottom: 0}}>{formatMessage({id: 'Landing_page_img_change'})}</div>
                    </div>
                    : <i className="iconfont icontianjia"></i>
            }
        </label>
    </div>;
}

export default Upload;
