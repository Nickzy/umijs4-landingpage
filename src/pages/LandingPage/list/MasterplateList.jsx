import React, {useEffect, useState, useRef} from 'react';
import './index.scss';
import {api} from '../../../../helpers/auth';
import axios from 'axios';
import {connect} from 'dva';
import PreviewPage from '../previewPage';
import { history, getLocale, useIntl } from 'umi';
import { Modal, Input, Button, message } from 'antd';
import Reservation from '../../../../components/Reservation/Reservation';
import { customize } from '../../../../helpers/auth';

function List (props) {
    const { formatMessage } = useIntl();

    const [list, set_list] = useState([]);
    const [previewShow, set_previewShow] = useState(false);
    const [customPage, setCustomPage] = useState(false);
    const [createModalShow, set_createModalShow] = useState(false);
    const [noAllowanceModalShow, set_noAllowanceModalShow] = useState(false);
    const [pageSource, set_pageSource] = useState({});
    const [name, set_name] = useState('');
    function getList () {
        axios.post(`url`, {limit: 20, offset: 0}).then(res => {
            if (res.status_code === 200) {
                set_list(res.result);
            } else {
                message.error(res.message);
            }
        }).catch(err => {
            message.error(err.message);
        });
    }

    function getAllowance () {
        return axios.get(`url`, { params: {permission_name: 'landing_page', lan: getLocale() === 'en-US' ? 'en' : 'zh'}});
    }

    function preview (page) {
        props.dispatch({
            type: 'landingPage/stateInt',
            page,
        });
        set_previewShow(true);
    }

    function previewClose () {
        set_previewShow(false);
    }

    async function create (page, model_id) {
        let result = await getAllowance();
        if (result.status_code === 200) {
            if (result.data.remain < 1) {
                set_noAllowanceModalShow(true);
            } else {
                set_pageSource({page, model_id});
                set_createModalShow(true);
            }
        }
    }

    function createOk () {
        let {page} = pageSource;
        let form_id = '';
        for (let value of page) {
            for (let source of value.source) {
                if (!source.layout) {
                    continue;
                } else {
                    if (source.layout.includes('formData')) {
                        form_id = source.formData.form_id;
                        break;
                    }
                }
            }
        }
        props.dispatch({
            type: 'landingPage/stateInt',
            page: pageSource.page,
            model_id: pageSource.model_id,
            form_id,
            name: name,
            page_status: 0
        });
        history.push('/promotion/landingpage/editor');
    }

    function customLandingPage(){
        setCustomPage(!customPage);
    }

    useEffect(() => {
        getList();
        props.dispatch({
            type: 'landingPage/clearAll',
        });
        localStorage.removeItem('currentLandingPageData');
    }, []);

    return <div className="MasterplateList_wrap">
        <header>
            <h2> <i onClick={() => {history.go(-1);}} className={'iconfont iconfont iconjiantou-left'}></i> {formatMessage({id:'Landing_page_Form_Create_Page'})}</h2>
        </header>
        <div className="content">
            <div className="top">
                <span>{formatMessage({id:'Landing_page_Form_Choose_template'})}</span>
                <span onClick={customLandingPage}>{formatMessage({id:'Landing_page_Form_Cannot_find'})}</span>
            </div>
            <div className="Masterplate">
                {
                    list.map(item => {
                        return <div className="Masterplate_item" key={item.model_id}>
                            <div className="content_box">
                                <img onError={(e)=>{e.target.src = '';}}src={item.model_html.src} alt="" onClick={() => {create(item.model_html.page, item.model_id);}}/>
                                <div className="preview" onClick={(e) => {preview(item.model_html.page);}}>{formatMessage({id:'Landing_page_Form_Preview'})}</div>
                            </div>
                            <div className="name">{item.model_html.name}</div>
                        </div>;
                    })
                }
                {
                    list.length % 2 ? <div className="Masterplate_item"> <div className="content_box"></div></div> : null
                }
            </div>
        </div>
        <PreviewPage show={previewShow} close={previewClose} />
        <Modal className="ant_modal_selfstyle" width={368} okButtonProps={{disabled: name ? false : true}} onOk={createOk} onCancel={() => {set_createModalShow(false);}} visible={createModalShow} okText={formatMessage({id:'Landing_page_Form_Create_Page'})} title={formatMessage({id:'Landing_page_Form_Create_Page'})}>
            <div className="create_landing_page">
                <div className="lable_s">{formatMessage({id:'Landing_page_Form_Page_Name'})}</div>
                <div className="input_s_w">
                    <Input value={name} onChange={e => { 
                        if (customize.strlen(e.target.value) > 50) {
                            return;
                        }
                        set_name(e.target.value);}}/>
                    <span className="notify">{formatMessage({id:'Landing_page_Form_page_no_name'})}</span>
                </div>
            </div>
        </Modal>
        <Modal className="ant_modal_selfstyle" onCancel={() => {set_noAllowanceModalShow(false);}} width={280} footer={<Button onClick={() => {history.push('/UpgradePackage/price');} } type="primary">{formatMessage({id:'UpgradePackage_Title'})}</Button>} visible={noAllowanceModalShow} title={formatMessage({id:'landing_page_Page_Creation_Failed'})}>
            <div>
                {formatMessage({id:'landing_page_creation_reached_package_limit'})}
                {formatMessage({id:'landing_page_click_btn_cteat'})}
            </div>
        </Modal>
        {
            customPage && <Reservation title={formatMessage({id:'landing_page_custom_page'})} reservationVersion={'landing_page'} closePopup={() => { setCustomPage(false); }} />
        }
    </div>;
}

export default connect(state => state.landingPage)(List);
