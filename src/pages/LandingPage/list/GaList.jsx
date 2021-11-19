import React from 'react';
import {history, getLocale, useIntl, withRouter} from 'umi';
import { Table, Button } from 'antd';
import SearchInput from '../../../../components/SearchInput/SearchInput';
import './index.scss';
import { api, customize } from '../../../../helpers/auth';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import { Tooltip, Switch, message, Dropdown, Menu, Modal, Input } from 'antd';
import { creteaHtml } from '../editor/Header/util';
import DateRangePickerWrap from '../../../../components/DateRangePickerWrap/DateRangePickerWrap';

function List (props) {
    const { formatMessage } = useIntl();

    const [list, set_list] = useState([]);
    const [columns, set_columns] = useState([
        {
            title: formatMessage({id: 'Landing_page_date'}),
            dataIndex: 'created_at',
            width: 130,
            render: function (value, data) {
                return value ? moment(value).format('ll') : '';
            }
        },
        {
            title: formatMessage({id:'Landing_page_Form_Page_Name'}),
            dataIndex: 'page',
            width: 270,
            render: function (value, data) {
                return <div className="table_page_m_w">
                    <span>{data.name}</span>
                    <span>ID: {data.lp_id}</span>
                </div>;
            }
        },
        {
            title: formatMessage({id: 'landing_page_Source'}),
            dataIndex: 'utm_source',
            width: 90,
            render: function (value) {
                return  value || '-';
            }
        },
        {
            title: formatMessage({id: 'landing_page_Medium'}),
            width: 90,
            dataIndex: 'utm_medium',
            render: function (value) {
                return  value || '-';
            }
        },
        {
            title: formatMessage({id: 'landing_page_Campaign'}),
            width: 90,
            dataIndex: 'utm_campaign',
            render: function (value) {
                return  value || '-';
            }
        },
        {
            title: formatMessage({id: 'landing_page_Content'}),
            width: 90,
            dataIndex: 'utm_content',
            render: function (value) {
                return  value || '-';
            }
        },
        {
            title: formatMessage({id: 'landing_page_Keyword'}),
            width: 110,
            dataIndex: 'utm_term',
            render: function (value) {
                return  value || '-';
            }
        },
        {
            title: 'PV',
            width: 60,
            dataIndex: 'PV',
            align: 'right',
            render: function (value) {
                return typeof value === 'number' ? value : '-';
            }
        },
        {
            title: 'UV',
            width: 60,
            dataIndex: 'UV',
            align: 'right',
            render: function (value) {
                return typeof value === 'number' ? value : '-';
            }
        },
        {
            title: formatMessage({id:'Landing_page_Form_Submission'}),
            dataIndex: 'form_count',
            align: 'right',
            render: function (value) {
                return typeof value === 'number' ? value : '-';
            }
        },
        {
            title: formatMessage({id:'Landing_page_Form_Rate'}),
            width: 110,
            dataIndex: 'form_rate',
            align: 'right',
            render: function (value) {
                return typeof value === 'number' ? (value ? `${customize.changeDataTypeEn(value * 100, 2)}%` : value) : '-';
            }
        },
        {
            title: formatMessage({id:'Landing_page_Form_Bounce_Rate'}),
            dataIndex: 'Bounce_Rate',
            align: 'right',
            render: function (value) {
                return typeof value === 'number' ? (value ? `${value}%` : value) : '-';
            }
        },
        {
            title: formatMessage({id:'Landing_page_Conversion_time'}),
            width: 110,
            dataIndex: 'Session_Duration',
            align: 'right',
            render: function (value) {
                let m = 0;
                let s = 0;
                let h = 0;
                if (value) {
                    h = Math.floor(value / 3600);
                    m = Math.floor(value / 60);
                    s = value - (m * 60);
                    if (h < 10) {
                        h = `0${h}`;
                    }
                    if (m < 10) {
                        m = `0${m}`;
                    }
                    if (s < 10) {
                        s = `0${s}`;
                    }
                }
                return value ? `${h}: ${m}: ${s}` : '-';
            }
        },
        {
            title: formatMessage({id:'Landing_page_Form_CreateTime'}),
            dataIndex: 'created_at',
            width: 140,
            render: function (value, data) {
                return value ? moment(value).format('lll') : '-';
            }
        },
        {
            title: formatMessage({id:'Landing_page_Form_Publish_Time'}),
            dataIndex: 'start_time',
            width: 140,
            render: function (value, data) {
                return value ? moment(value).format('lll') : '-';
            }
        },
        {
            title: formatMessage({id:'Landing_page_Form_Latest_Edit'}),
            dataIndex: 'updated_at',
            width: 140,
            render: function (value, data) {
                return value ? moment(value).format('lll') : '-';
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
        date_end: moment().subtract(1, 'days').format('YYYY-MM-DD')
    });
    const [searchObj, set_searchObj] = useState({
        utm_source: '',
        utm_medium: '',
        utm_campaign: '',
        utm_content: '',
        utm_term: '',
        landing_search: props.location.query.lp_id
    });
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

    function search () {
        getList({...pagination, current: 1});
    }
    function clear () {
        set_searchObj({
            utm_source: '',
            utm_medium: '',
            utm_campaign: '',
            utm_content: '',
            utm_term: '',
            landing_search: ''
        });
    }
    useEffect(() => {
        getList(pagination);
    }, []);
    return <div className="ga_List_wrap">
        <div className="header">
            <h2><i onClick={() => {history.go(-1);}} className={'iconfont iconfont iconjiantou-left'}></i> {formatMessage({id:'Landing_page_Form_Traffic_Statistics'})}</h2>
            <div className="right">
                <div className="ga_List_header_date">
                    <DateRangePickerWrap startDate={dateObj.date_start} endDate={dateObj.date_end} onDateRangeChanged={onDateRangeChanged} />
                </div>
            </div>
        </div>
        <div className="search_m_s">
            <div className="search_group_s">
                <div>
                    <div className="lable">{formatMessage({id:'Landing_page_title'})}：</div>
                    <Input placeholder={formatMessage({id:'landing_page_Enter_form_ID_name'})} value={searchObj.landing_search} onChange={(e) => {searchChange(e.target.value, 'landing_search');}}/>
                </div>
                <div>
                    <div className="lable">{formatMessage({id:'landing_page_Source'})}：</div>
                    <Input placeholder={formatMessage({id:'landing_page_Search_Source'})} value={searchObj.utm_source} onChange={(e) => {searchChange(e.target.value, 'utm_source');}} />
                </div>
                <div>
                    <div className="lable">{formatMessage({id:'landing_page_Medium'})}：</div>
                    <Input placeholder={formatMessage({id:'landing_page_Search_Medium'})} value={searchObj.utm_medium} onChange={(e) => {searchChange(e.target.value, 'utm_medium');}} />
                </div>
                <div>
                    <div className="lable">{formatMessage({id:'landing_page_Campaign'})}：</div>
                    <Input placeholder={formatMessage({id:'landing_page_Search_Campaign'})} value={searchObj.utm_campaign} onChange={(e) => {searchChange(e.target.value, 'utm_campaign');}} />
                </div>
                <div>
                    <div className="lable">{formatMessage({id:'landing_page_Content'})}：</div>
                    <Input placeholder={formatMessage({id:'landing_page_Search_Content'})} value={searchObj.utm_content} onChange={(e) => {searchChange(e.target.value, 'utm_content');}} />
                </div>
                <div>
                    <div className="lable">{formatMessage({id:'landing_page_Keyword'})}：</div>
                    <Input placeholder={formatMessage({id:'landing_page_Search_Keyword'})} value={searchObj.utm_term} onChange={(e) => {searchChange(e.target.value, 'utm_term');}} />
                </div>
            </div>
            <div>
                <Button type="primary" onClick={search}>{formatMessage({id:'landing_page_Search'})}</Button>
                <Button type="text" onClick={clear} className="clear_s">{formatMessage({id:'landing_page_Clear_filters'})}</Button>
            </div>
        </div>
        <div className="table_w_s">
            <Table dataSource={list} scroll={{x: 1800}} className="landing_page_table" rowKey="lp_id" onChange={tablechange} pagination={pagination} columns={columns}/>
        </div>
    </div>;
}

export default withRouter(List);
