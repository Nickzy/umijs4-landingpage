import React from 'react';
import {history, getLocale, useIntl, withRouter} from 'umi';
import { Table, message, Input, Button, Divider, Modal } from 'antd';
import './index.scss';
import { api } from '../../../../helpers/auth';
import axios from 'axios';
import {useEffect, useState} from 'react';
import moment from 'moment';
import DateRangePickerWrap from '../../../../components/DateRangePickerWrap/DateRangePickerWrap';
import PreviewForm from './PreviewForm';

const { Search } = Input;
const not_editors = [1,2,3,4,5,6];
function List (props) {
    const { formatMessage } = useIntl();
    const [list, set_list] = useState([]);
    const [previewShow, set_previewShow] = useState(false);
    const [previewData, set_previewData] = useState(null);
    const [copyShow, set_copyShow] = useState(false);
    const [copyData, set_copyData] = useState(null);
    const [deleteShow, set_deleteShow] = useState(false);
    const [columns, set_columns] = useState([
        {
            title: formatMessage({id: 'landing_page_Form_ID'}),
            dataIndex: 'bd_id',
            width: 220,
        },
        {
            title: formatMessage({id: 'landing_page_form_name'}),
            dataIndex: 'form_name',
            render: function (value, data) {
                return  <span>
                    <span>{value}</span>
                    {
                        !not_editors.includes(data.form_id) ? <span className="pointer blue" onClick={() => {editor(data);}} style={{marginLeft: '20px'}}>{formatMessage({id: 'Landing_page_Form_Edit'})}</span> : null
                    }
                </span>;
            }
        },
        {
            title: formatMessage({id: 'Landing_page_Form_CreateTime'}),
            width: 150,
            dataIndex: 'created_at',
            render: function (value) {
                return value ? moment(value).format('YYYY-MM-DD HH:MM') : '-';
            }
        },
        {
            title: formatMessage({id: 'Landing_page_Form_Submission'}),
            width: 110,
            dataIndex: 'form_count',
            render: function (value) {
                return  value || '-';
            }
        },
        {
            title: formatMessage({id: 'landing_page_formlist_action'}),
            dataIndex: 'action',
            width: 200,
            render: function (value, data) {
                return <span>
                    <span className="pointer blue" onClick={() => {perview(data);}}>{formatMessage({id: 'Landing_page_Form_Preview'})}<Divider type="vertical" /></span>
                    <span className="pointer blue" onClick={() => {history.push('/promotion/landingpage/form_ctr?form_search=' + data.bd_id);}}>{formatMessage({id: 'landing_page_form_Data'})}{!not_editors.includes(data.form_id) ? <Divider type="vertical" /> : null}</span>
                    {
                        !not_editors.includes(data.form_id) ? <span className="pointer blue" onClick={() => {copy(data);}}>{formatMessage({id: 'landing_page_form_clone'})}<Divider type="vertical" /></span> : null
                    }
                    {
                        !not_editors.includes(data.form_id) ? <span className="pointer" onClick={() => { deleteItem(data); }}>{formatMessage({id: 'landing_page_form_Delete'})}</span> : null
                    }
                </span>;
            }
        }
    ]);
    const [pagination, setpagination]  = useState({
        total: 0,
        pageSizeOptions: [10, 20, 30, 40],
        pageSize: 20,
        current: 1,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: total =>  formatMessage({id: 'AccountAds_gonglengthtiao'},{length: total})
    });
    const [dateObj, set_dateObj] = useState({
        date_start: moment().subtract(28, 'days').format('YYYY-MM-DD'),
        date_end: moment().subtract(0, 'days').format('YYYY-MM-DD')
    });
    function tablechange (pagination_arg) {
        getList({...pagination, ...pagination_arg});
    }
    function onDateRangeChanged (date_start, date_end) {
        set_dateObj({
            date_start,
            date_end
        });
    }
    function getList (pageData) {
        let postData = {
            // ...dateObj,
            limit: pageData.pageSize,
            offset: (pageData.current - 1) * pageData.pageSize
        };
        axios.post(`url`, postData).then(res => {
            if (res.status_code === 200) {
                set_list(res.data);
                setpagination({...pageData, total: res && res.total_count || 0});
            } else {
                message.error(res.message);
            }
        }).catch(err => {
            message.error(err.message);
        });
    }
    function perview (item) {
        set_previewShow(true);
        set_previewData(item.form_content);
    }
    function editor (item) {
        history.push(`/promotion/landingpage/editor_form?source=${encodeURIComponent(JSON.stringify(item))}`);
    }
    function copy (item) {
        set_copyShow(true);
        let {form_content, button_text, success_text} = item;
        let r_data = {
            form_content,
            form_id: '',
            form_name: '',
            button_text,
            success_text,
        };
        set_copyData(r_data);
    }
    function copySure () {
        axios.post(`url`, copyData).then(res => {
            if (res.status_code === 200) {
                getList({...pagination, current: 1});
            } else {
                message.error(res.message);
            }
            set_copyShow(false);
        }).catch(err => {
            set_copyShow(false);
            message.error(err.message);
        });
    }
    function deleteItem (item) {
        let r_data = {
            form_id: item.form_id
        };
        set_copyData(r_data);
        set_deleteShow(true);
    }
    function deleteSure () {
        axios.post(`url`, copyData).then(res => {
            if (res.status_code === 200) {
                getList({...pagination, current: 1});
                
            } else {
                message.error(res.message);
            }
            set_deleteShow(false);
        }).catch(err => {
            set_deleteShow(false);
            message.error(err.message);
        });
    }
    useEffect(() => {
        getList({...pagination, current: 1});
    }, [dateObj]);
    return <div className="form_List_wrap">
        <div className="header">
            <h2><i onClick={() => {history.go(-1);}} className={'iconfont iconfont iconjiantou-left'}></i> {formatMessage({id: 'landing_page_formlist_manage'})}</h2>
            <div className="right">
                <div className="ga_List_header_date">
                    {/* <DateRangePickerWrap chooseToday={true} startDate={dateObj.date_start} endDate={dateObj.date_end} onDateRangeChanged={onDateRangeChanged} /> */}
                </div>
                <Button type="primary" onClick={() => {history.push('/promotion/landingpage/create_form');}} style={{marginLeft: '10px'}}>+ {formatMessage({id: 'landing_page_create_form'})}</Button>
            </div>
        </div>
        <div className="table_w_s">
            <Table dataSource={list} className="landing_page_table" rowKey="bd_id" onChange={tablechange} pagination={pagination} columns={columns}/>
        </div>
        <Modal destroyOnClose={true} className="ant_modal_selfstyle" width={368} onCancel={() => {set_previewShow(false);}} footer={null} visible={previewShow} title={formatMessage({id: 'landing_page_create_form_preview'})}>
            <PreviewForm formList={previewData} />
        </Modal>
        <Modal destroyOnClose={true} className="ant_modal_selfstyle" onOk={copySure} okButtonProps={{disabled: copyData && copyData.form_name ? false : true}} width={368} onCancel={() => {set_copyShow(false);}} visible={copyShow} title={formatMessage({id: 'landing_page_formlist_clone'})}>
            <span className="sml_title_s">{formatMessage({id: 'landing_page_formlist_enter_clone_name'})}</span>
            <div className="content_s">
                <span>{formatMessage({id: 'landing_page_form_name'})}</span>
                <Input value={copyData && copyData.form_name} onChange={(e) => {set_copyData({...copyData, form_name: e.target.value});}}/>
            </div>
        </Modal>
        <Modal destroyOnClose={true} className="ant_modal_selfstyle" onOk={deleteSure} width={280} onCancel={() => {set_deleteShow(false);}} visible={deleteShow} title={formatMessage({id: 'landing_page_form_delete_item'})}>
            <div>
                {formatMessage({id: 'landing_page_form_delete_note'})}
            </div>
        </Modal>
    </div>;
}

export default withRouter(List);
