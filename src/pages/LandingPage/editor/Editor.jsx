import React from 'react';
import Header from './Header/Header';
import Content from './content/Content';
import Sider from './sider/Sider';
import {useEffect, useRef, useState} from 'react';
import {connect} from 'dva';
import './Editor.scss';
import { customize, api } from '../../../../helpers/auth';
import axios from 'axios';
import { message } from 'antd';
import { history, useIntl } from 'umi';

function Editor (props) {
    const { formatMessage } = useIntl();
    const [width, set_width] = useState(0);
    const [height, set_height] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
        if (localStorage.getItem('currentLandingPageData') && !props.page.length) {
            props.dispatch({
                type: 'landingPage/reloadStateInt',
                data: JSON.parse(localStorage.getItem('currentLandingPageData'))
            });
        }
        saveDraf();
        return function () {
            console.log('卸载清除——Editor——clearAll');
            props.dispatch({
                type: 'landingPage/clearAll',
            });
            // localStorage.removeItem('currentLandingPageData');
        };
    }, []);
    useEffect(() => {
        ResizeFn();
        window.addEventListener('resize', customize.debounce(ResizeFn, 300), false);
        return () => {
            window.removeEventListener('resize', ResizeFn, false);
        };
    }, [props.siderShow]);
    function saveApi (type, data) {
        return axios.post(`url`, data);
    }
    function purPage (page, activeData) {
        let copyPage = JSON.parse(JSON.stringify(page));
        return copyPage.map((item, index) => {
            let list = null;
            if (activeData.key) {
                list = activeData.key.split(',');
            }
            if (list && index === Number(list[0])) {
                if (!item[list[1]]) {
                    item.active = false;
                } else {
                    if (item[list[1]][list[2]]) {
                        if (item[list[1]][list[2]][list[3]]) {
                            if (item[list[1]][list[2]][list[3]][list[4]]) {
                                if (item[list[1]][list[2]][list[3]][list[4]][list[5]]) {
                                    if (item[list[1]][list[2]][list[3]][list[4]][list[5]][list[6]]) {
                                        item[list[1]][list[2]][list[3]][list[4]][list[5]][list[6]].active = false;
                                    } else {
                                        item[list[1]][list[2]][list[3]][list[4]][list[5]].active = false;
                                    }
                                } else {
                                    item[list[1]][list[2]][list[3]][list[4]].active = false;
                                }
                            } else {
                                item[list[1]][list[2]][list[3]].active = false;
                            }
                        } else {
                            item[list[1]][list[2]].active = false;
                        }
                    } else {
                        item[list[1]].active = false;
                    }
                }
            }
            return item;
        });
    }
    async function saveDraf (toast) {
        let {pageDetail} = props;
        if (!props.page.length) {
            return false;
        }
        props.dispatch({
            type: 'landingPage/changeDrafLoading',
            saveDrafLoading: true
        });
        let postData = {
            page_data: encodeURI(JSON.stringify(purPage(props.page, props.activeData))),
            ...pageDetail
        };
        let res = await saveApi('add_draft', postData);
        if (res.status_code === 200) {
            toast && message.success(toast);
            props.dispatch({
                type: 'landingPage/set_pageDetail',
                data: {
                    landing_draft_id: res.landing_draft_id
                }
            });
        }else{
            customize.errCodeMessage(res);
        }
        props.dispatch({
            type: 'landingPage/changeDrafLoading',
            saveDrafLoading: false
        });
    }
    async function save (data, cb, toast) {
        let {pageDetail} = props;
        if (!props.page.length) {
            return false;
        }
        let postData = {
            page_data: encodeURI(JSON.stringify(purPage(props.page, props.activeData))),
            ...pageDetail,
            ...data,
            link: `${api.landdingpublishHtml}/${data.link}.html`
        };
        let res = await saveApi('add', postData);
        if (res.status_code === 200) {
            toast && message.success(toast);
            props.dispatch({
                type: 'landingPage/clearAll'
            });
            history.push('/promotion/landingpage/list');
            localStorage.removeItem('currentLandingPageData');
        } else if (res.status_code === 23102) {
            message.error(formatMessage({id: 'landing_page_link_repeat'}));
            // 表单已经删除提示
        } else if (res.status_code === 23103) {
            message.error(formatMessage({id: 'landing_page_form_delete_aready'}));
        } else {
            message.error(res.message);
        }
        cb && cb();
    }
    useEffect(() => {
        if (!props.inputOnBlur && props.pagechange) {
            saveDraf();
        }
    }, [props.page, props.inputOnBlur, props.pagechange]);
    useEffect(() => {
        if (props.page.length) {
            localStorage.setItem('currentLandingPageData', JSON.stringify(props));
        }
    }, [props]);
    function ResizeFn () {
        if (ref && ref.current && props.siderShow) {
            set_width(ref.current.clientWidth - 300);
            set_height(window.innerHeight - 265);
        }
    }
    return <div ref={ref} className="editor_s_w">
        <Header saveDraf={saveDraf} save={save}/>
        {
            props.page && props.page.length ? <Content height={height} width={width} /> : null
        }
        <Sider />
    </div>;
}

export default connect(state => state.landingPage)(Editor);
