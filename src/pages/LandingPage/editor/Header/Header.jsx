import React from 'react';
import { Button, Modal, Input, Radio, message } from 'antd';
import Color from '../color/Color';
import { useState, useRef } from 'react';
import './Header.scss';
import { useEffect } from 'react';
import {connect} from 'dva';
import PreviewPage from '../../previewPage';
import { history, useIntl } from 'umi';
import { creteaHtml } from './util';
import moment from 'moment';
import { customize } from '../../../../../helpers/auth';

function Header (props) {
    const { formatMessage } = useIntl();

    const [color, set_color] = useState('#FFFFFF');
    const [previewShow, set_previewShow] = useState(false);
    const [showColorPciker, set_showColorPciker] = useState(false);
    const [publishShow, set_publishShow] = useState(false);
    const [pushlishLoading, set_pushlishLoading] = useState(false);
    const [updatePublishShow, set_updatePublishShow] = useState(false);
    const [havaGj, set_havaGj] = useState(false);
    const [saveTime, set_saveTime] = useState(moment(new Date()).format('lll'));
    const [publishData, set_publishData] = useState({
        page_status: 1,
        title: '',
        link: '',
        utm_source: '',
        utm_medium: '',
        utm_campaign: '',
        utm_content: '',
        utm_term: '',
        name: ''
    });
    const colorref = useRef(null);
    function colorChange (color) {
        set_color(color);
        props.dispatch({
            type: 'landingPage/pageBgChange',
            pageSytle: {
                background: color
            }
        });
    }

    function isChildOf(child, parent) {
        if (child && parent) {
            let parentNode = child.parentNode;
            while (parentNode) {
                if (parent === parentNode) {
                    return true;
                }
                parentNode = parentNode.parentNode;
            }
        }
        return false;
    }

    function showColorClick (e) {
        if (e.target && (e.target.className === 'color_select_m' || e.target.className === 'color_show' || isChildOf(e.target, document.querySelector('.color_show')))) {
            set_showColorPciker((b) => !b);
        }
    }

    function windowClick (e) {
        if (e.target && e.target !== colorref.current && !isChildOf(e.target, colorref.current)) {
            window.onclick = null;
            set_showColorPciker(false);
        }
    }

    function preview () {
        set_previewShow(true);
    }

    function publishClick () {
        if (!props.pageDetail.landing_id) {
            set_publishShow(true);
        } else {
            set_updatePublishShow(true);
        }
        let newData = {};
        for (let key in publishData) {
            if (key) {
                newData[key] = props.pageDetail[key];
            }
        }
        set_publishData(newData);
    }
    function clearGj () {
        havaGj && set_publishData({
            ...publishData,
            utm_source: '',
            utm_medium: '',
            utm_campaign: '',
            utm_content: '',
            utm_term: '',
        });
    }

    function publishChange (value, type, len) {
        if (len && customize.strlen(value) > len) {
            return;
        }
        let data = Object.assign({}, publishData, {[type]: value});
        set_publishData(data);
    }

    function publish () {
        let page_html = encodeURI(creteaHtml(props.page, publishData.title, false, props.pageDetail.landing_draft_id, props.pageDetail.form_id));
        let data = {
            page_html,
            ...publishData,
        };
        let reg = /[\u4E00-\u9FA5]/g;
        if (reg.test(publishData.link)) {
            return message.error(formatMessage({id: 'landing_page_pushlink_test'}));
        }
        set_pushlishLoading(true);
        props.save && props.save(data, () => { 
            set_publishShow(false);
            set_updatePublishShow(false);
            set_pushlishLoading(false);
        }, props.pageDetail.landing_id ? formatMessage({id: 'Landing_page_update_Published_success'}) : formatMessage({id: 'Landing_page_Published_success'}));
    }
    useEffect(() => {
        return () => {
            window.onclick = null;
        };
    }, []);

    useEffect(() => {
        if (!props.saveDrafLoading) {
            set_saveTime(moment(new Date()).format('lll'));
        }
    }, [props.saveDrafLoading]);

    useEffect(() => {
        if (showColorPciker) {
            window.onclick = windowClick;
        }
        return () => {

        };
    }, [showColorPciker]);
    // props.save && props.save()
    function isDisabled () {
        let {name, title, link, utm_source} = publishData;
        if (name && title && link && (!havaGj || (havaGj && utm_source)) ) {
            return false;
        }
        return true;
    }

    return <div className="landing_page_header_wrap">
        <div>
            <i style={{cursor: 'pointer'}} onClick={() => {history.push('/promotion/landingpage/list');}} className={'iconfont iconfont iconjiantou-left'}></i>
        </div>
        <div className="right">
            {
                props.saveDrafLoading ? <span>{formatMessage({id: 'Landing_page_Form_Saved'})}</span> : <span className="time">{saveTime} {formatMessage({id:'Landing_page_Form_Saved'})}</span>
            }
            {/* <div className="color_select_m" ref={colorref} onClick={showColorClick}>
                <div className="color_show">
                    <i className="iconfont iconhuabi"></i>
                    背景颜色
                </div>
                {
                    showColorPciker ?
                        <Color color={color} change={colorChange}/>
                        : null
                }
            </div> */}
            <div className="preview" onClick={preview}>
                <i className="iconfont iconyanjing"></i>
                {formatMessage({id:'Landing_page_Form_Preview'})}
            </div>
            <Button className="save" onClick={() => {props.saveDraf && props.saveDraf(formatMessage({id: 'quick_ads_baocunchenggong'}));}} size="small">{formatMessage({id:'Landing_page_Form_save'})}</Button>
            <Button type="primary" onClick={publishClick} size="small">{props.pageDetail.landing_id ? formatMessage({id: 'Landing_page_Form_Update'}) : formatMessage({id:'Landing_page_Form_Publish'})}</Button>
        </div>
        {
            <PreviewPage show={previewShow} close={() => {set_previewShow(false);}} />
        }
        <Modal className="ant_modal_editor_headerselfstyle" okButtonProps={{disabled: isDisabled(), loading: pushlishLoading}} onOk={publish} onCancel={() => {set_publishShow(false);}} width={520} visible={publishShow} okText={formatMessage({id:'Landing_page_Form_Publish'})} title={formatMessage({id:'Landing_page_Form_Pusblish_Landing_Page'})}>
            <div className="form_w">
                <div>
                    <span className="lable_s">{formatMessage({id:'Landing_page_Form_Page_Name'})}*</span>
                    <div className="input_s_w">
                        <Input value={publishData.name} onChange={(e) => {publishChange(e.target.value, 'name', 50);}}/>
                    </div>
                </div>
                <div>
                    <span className="lable_s">{formatMessage({id:'Landing_page_Form_page_title'})}*</span>
                    <div className="input_s_w">
                        <Input value={publishData.title} onChange={(e) => {publishChange(e.target.value, 'title', 50);}}/>
                    </div>
                </div>
                <div>
                    <span style={{marginRight: '7px'}} className="lable_s"><span className="lable_s_con">{formatMessage({id:'Landing_page_Form_Page_Link'})}* </span></span>
                    <Input value={publishData.link} onChange={(e) => {publishChange(e.target.value ? e.target.value.trim() : e.target.value, 'link');}}/>
                </div>
                <div className="note">
                    <span className="lable_s"></span>
                    <div>
                        <span className="danger_notify">{formatMessage({id:'Landing_page_Form_link_no_edit'})}</span>
                        <span onClick={() => {clearGj() ;set_havaGj((bool) => !bool);}} className="blue">{formatMessage({id: havaGj ? 'Landing_page_Form_Cancel_settings' : 'Landing_page_Form_add_GA'})}</span>
                    </div>
                </div>
                {
                    havaGj ? <div className="gaoji_select">
                        <div>
                            <span className="lable_s"></span>
                            <div>
                                <span className="lable_s_l">{formatMessage({id:'landing_page_Source'})}(utm_source)*</span>
                                <Input value={publishData.utm_source} onChange={(e) => {publishChange(e.target.value, 'utm_source');}}/>
                            </div>
                        </div>
                        <div>
                            <span className="lable_s"></span>
                            <div>
                                <span className="lable_s_l">{formatMessage({id:'landing_page_Medium'})}(utm_medium)</span>
                                <Input value={publishData.utm_medium} onChange={(e) => {publishChange(e.target.value, 'utm_medium');}}/>
                            </div>
                        </div>
                        <div>
                            <span className="lable_s"></span>
                            <div>
                                <span className="lable_s_l">{formatMessage({id:'landing_page_Campaign'})}(utm_campaign）</span>
                                <Input value={publishData.utm_campaign} onChange={(e) => {publishChange(e.target.value, 'utm_campaign');}}/>
                            </div>
                        </div>
                        <div>
                            <span className="lable_s"></span>
                            <div>
                                <span className="lable_s_l">{formatMessage({id:'landing_page_Content'})}(utm_content)</span>
                                <Input value={publishData.utm_content} onChange={(e) => {publishChange(e.target.value, 'utm_content');}}/>
                            </div>
                        </div>
                        <div>
                            <span className="lable_s"></span>
                            <div>
                                <span className="lable_s_l">{formatMessage({id:'landing_page_Keyword'})}(utm_term)</span>
                                <Input value={publishData.utm_term} onChange={(e) => {publishChange(e.target.value, 'utm_term');}}/>
                            </div>
                        </div>
                    </div>  : null
                }
                <div>
                    <span className="lable_s">{formatMessage({id:'Landing_page_Form_Publish_Time'})}*</span>
                    <Radio.Group onChange={(e) => {publishChange(e.target.value, 'page_status');}} value={publishData.page_status}>
                        <Radio value={0}>{formatMessage({id:'Landing_page_Form_Publish_now'})}</Radio>
                        <Radio value={1}>{formatMessage({id:'Landing_page_Form_Schedule_for_later'})}</Radio>
                    </Radio.Group>
                </div>

            </div>
        </Modal>
        <Modal className="ant_modal_editor_headerselfstyle" okButtonProps={{disabled: publishData.name && publishData.title ? false : true,  loading: pushlishLoading}} onOk={publish} onCancel={() => {set_updatePublishShow(false);}} width={520} visible={updatePublishShow} okText={formatMessage({id: 'Landing_page_Form_Update'})} title={formatMessage({id: 'Landing_page_Form_Update_Landing_Page'})}>
            <div className="form_w">
                <div>
                    <span className="lable_s">{formatMessage({id:'Landing_page_Form_Page_Name'})}*</span>
                    <div className="input_s_w">
                        <Input value={publishData.name} onChange={(e) => {publishChange(e.target.value, 'name');}}/>
                    </div>
                </div>
                <div>
                    <span className="lable_s">{formatMessage({id:'Landing_page_Form_page_title'})}*</span>
                    <div className="input_s_w">
                        <Input value={publishData.title} onChange={(e) => {publishChange(e.target.value, 'title');}}/>
                    </div>
                </div>                
            </div>
        </Modal>
    </div>;
}

export default connect(state => state.landingPage)(Header);
