import React from 'react';
import {history, getLocale, formatMessage, withRouter} from 'umi';
import { Table, message, Input, Button } from 'antd';
import SearchInput from '../../../../components/SearchInput/SearchInput';
import './index.scss';
import { api } from '../../../../helpers/auth';
import axios from 'axios';
import {useEffect, useState} from 'react';
import moment from 'moment';
import DateRangePickerWrap from '../../../../components/DateRangePickerWrap/DateRangePickerWrap';
const { Search } = Input;

function List (props) {
    const [list, set_list] = useState([]);
    const [columns, set_columns] = useState([
        {
            title: formatMessage({id: 'landing_page_Submission_Time'}),
            dataIndex: 'created_at',
            width: 150,
            render: function (value, data) {
                return value ? moment(value).format('YYYY-MM-DD HH:MM') : '';
            }
        },
        {
            title: formatMessage({id: 'landing_page_Name'}),
            dataIndex: 'name',
            width: 90,
            render: function (value) {
                return  value || '-';
            }
        },
        {
            title: formatMessage({id: 'landing_page_Mobile'}),
            width: 130,
            dataIndex: 'phone'
        },
        {
            title: formatMessage({id: 'landing_page_Email'}),
            width: 150,
            dataIndex: 'email',
            render: function (value) {
                return  value || '-';
            }
        },
        {
            title: formatMessage({id: 'landing_page_Age'}),
            dataIndex: 'age',
            render: function (value) {
                return typeof value === 'number' ? value : '-';
            }
        },
        {
            title: formatMessage({id: 'landing_page_Gender'}),
            dataIndex: 'sex',
            render: function (value) {
                return  value || '-';
            }
        },
        {
            title: formatMessage({id: 'landing_page_Country'}),
            dataIndex: 'country',
            render: function (value) {
                return  value || '-';
            }
        },
        {
            title: formatMessage({id: 'landing_page_City'}),
            dataIndex: 'city',
            render: function (value) {
                return  value || '-';
            }
        },
        {
            title: formatMessage({id: 'landing_page_Form'}),
            width: 260,
            dataIndex: 'form_name',
            render: function (value, data) {
                if (!value) {
                    return '-';
                }
                return  <span><span>{value}</span> <div>ID：{data.bd_id}</div></span>;
            }
        },
        {
            title: formatMessage({id: 'landing_page_Landing_Page'}),
            width: 260,
            dataIndex: 'landing_name',
            render: function (value, data) {
                if (!value) {
                    return '-';
                }
                return  <span><span>{value}</span> <div>ID：{data.lp_id}</div></span>;
            }
        },
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
        date_start: moment().subtract(27, 'days').format('YYYY-MM-DD'),
        date_end: moment().subtract(0, 'days').format('YYYY-MM-DD')
    });
    const [searchObj, set_searchObj] = useState({
        form_search: props.location.query.form_search || '',
        landing_search: props.location.query.lp_id || ''
    });

    const [btnLoading, set_btnLoading] = useState(false);
    function tablechange (pagination_arg) {
        getList({...pagination, ...pagination_arg});
    }

    function searchChange (value, key) {
        set_searchObj({...searchObj, [key]: value || ''});
    }
    function onDateRangeChanged (date_start, date_end) {
        set_dateObj({
            date_start,
            date_end
        });
    }
    function exportExcel () {
        let postData = {
            ...dateObj,
            ...searchObj,
            report_type: 'landing_page'
        };
        set_btnLoading(true);
        axios.post('url', postData).then(res => {
            if (res.status_code === 200) {
                let downLink = document.createElement('a');
                //字符内容转换为blod地址
                downLink.href = res.link;
                // 链接插入到页面
                document.body.appendChild(downLink);
                downLink.click();
                // 移除下载链接
                document.body.removeChild(downLink);
            } else {
                message.error(res.message);
            }
            set_btnLoading(false);
        }).catch(err => {
            message.error(err.message);
            set_btnLoading(false);
        });
    }
    function getList (pageData) {
        let postData = {
            ...searchObj,
            ...dateObj,
            limit: pageData.pageSize,
            offset: (pageData.current - 1) * pageData.pageSize
        };
        axios.post(`url`, postData).then(res => {
            if (res.status_code === 200) {
                set_list(res.result);
                setpagination({...pageData, total: res && res.total_count || 0});
            } else {
                message.error(res.message);
            }
        }).catch(err => {
            message.error(err.message);
        });
    }
    useEffect(() => {
        getList({...pagination, current: 1});
    }, [searchObj, dateObj]);
    return <div className="form_List_wrap">
        <div className="header">
            <h2><i onClick={() => {history.go(-1);}} className={'iconfont iconfont iconjiantou-left'}></i> {formatMessage({id: 'Landing_page_Form_Form_Conversion'})}</h2>
            <div className="right">
                <div className="ga_List_header_date">
                    <DateRangePickerWrap chooseToday={true} startDate={dateObj.date_start} endDate={dateObj.date_end} onDateRangeChanged={onDateRangeChanged} />
                </div>
                <Button style={{marginLeft: '20px'}} loading={btnLoading} onClick={exportExcel} type="primary" style={{width: '100px'}}><i className="iconfont iconxiazai" style={{marginRight: '5px'}}></i> {formatMessage({id: 'pagedetail_DownloadPDF'})}</Button>
            </div>
        </div>
        <div className="search_m_s"> 
            <div>
                <Search allowClear style={{width: '223px', marginRight: '20px'}} defaultValue={searchObj.landing_search} onSearch={e => {searchChange(e, 'landing_search');}} placeholder={formatMessage({id: 'landing_page_input_Landing_Page_ID_name'})}/>
                <Search allowClear style={{width: '223px', marginRight: '20px'}} defaultValue={searchObj.form_search} onSearch={e => {searchChange(e, 'form_search');}} placeholder={formatMessage({id: 'landing_page_Enter_form_ID_name'})}/>
                {/* <SearchInput requestData={value => {searchChange(value, 'form_search');}} placeholder={formatMessage({id: 'landing_page_Enter_form_ID_name'})}/> */}
            </div>
        </div>
        <div className="table_w_s">
            <Table dataSource={list} scroll={{x: 1700}} className="landing_page_table" rowKey="id" onChange={tablechange} pagination={pagination} columns={columns}/>
        </div>
    </div>;
}

export default withRouter(List);
