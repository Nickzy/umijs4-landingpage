import React from 'react';
import {history, getLocale, useIntl} from 'umi';
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
import PermissionTooltip from '@/components/PermissionTooltip';

function List (props) {
    const {rolePermission} = props;
    const {landing_page} = rolePermission;
    const { formatMessage } = useIntl();
    const [list, set_list] = useState([]);
    const [columns, set_columns] = useState([
        {
            title: formatMessage({id:'Landing_page_title'}),
            dataIndex: 'page',
            width: 320,
            fixed: 'left',
            render: function (value, data) {
                return <div className="table_page_m_w">
                    <div className="content_s">
                        <span className="title">
                            {data.name}
                            {
                                !data.is_draft && data.page_status === 0 ? <Tooltip title={formatMessage({id:'Landing_page_Form_Copy_Link'})}><i onClick={() => {copyLink(data.link, formatMessage({id: 'Landing_page_copy_link'}));}} className="iconfont iconlianjie1"></i></Tooltip> : null
                            }
                        </span>
                        <span><span>ID： </span>{data.lp_id}</span>
                        {
                            data.is_draft ? <span>{formatMessage({id:'Landing_page_draft'})}</span> : null
                        }
                        {
                            !data.is_draft ?
                                <PermissionTooltip disabled={!landing_page}>
                                    <Switch disabled={!landing_page} style={{width: '32px'}} size="small" onChange={() => {switchChange(data);}} checked={!data.page_status ? true : false}/>
                                </PermissionTooltip>
                                : null
                        }

                    </div>

                </div>;
            }
        },
        {
            title: formatMessage({id:'common_operate'}),
            dataIndex: 'action',
            width: 140,
            fixed: 'left',
            render: function (value, data) {
                const menu = (
                    <Menu>
                        <Menu.Item>
                            <span onClick={() => {copyPage(data);}}>{formatMessage({id:'Landing_page_Form_Copy'})}</span>
                        </Menu.Item>
                        <Menu.Item>
                            <span onClick={() => {DownloadHtml(data);}}>{formatMessage({id:'Landing_page_Form_Download'})}</span>
                        </Menu.Item>
                    </Menu>
                );
                return <div className="table_action_m_w">
                    <div>
                        {
                            !data.is_draft ? <span className="look" onClick={() => {window.open(data.link);}}>{formatMessage({id:'Landing_page_Form_View'})}</span> : null
                        }
                        <PermissionTooltip disabled={!landing_page}>
                            <span className="editor" onClick={() => landing_page && editor(data)}>{formatMessage({id:'Landing_page_Form_Edit'})}</span>
                        </PermissionTooltip>
                    </div>
                    {
                        !data.is_draft ? <div className="pointer" onClick={() => {history.push('/promotion/landingpage/ga?lp_id=' + data.lp_id );}}>
                            {formatMessage({id:'Landing_page_Form_Traffic_Statistics'})}
                        </div>
                            : null
                    }
                    {
                        !data.is_draft ? <div className="pointer" onClick={() => {history.push('/promotion/landingpage/form_ctr?lp_id=' + data.lp_id);}}>
                            {formatMessage({id:'Landing_page_Form_Form_Conversion'})}
                        </div>
                            : null
                    }
                    {
                        !data.is_draft ?  <div className="pointer">
                            {
                                data.short_link ? <span onClick={() => {copyLink(data.short_link, formatMessage({id:'landing_page_Short_link_copied_successfully'}));}}>{formatMessage({id:'Landing_page_Form_copy_link'})}</span> : <span onClick={() => { createShortLink(data); }}>{formatMessage({id:'Landing_page_Form_Short_link'})}</span>
                            }
                        </div>
                            : null
                    }
                    {
                        !data.is_draft ? <div style={{position: 'relative'}}>
                            <Dropdown overlay={menu} trigger={['click']} getPopupContainer={triggerNode => triggerNode.parentElement} placement="topRight" >
                                <span className="pointer" onClick={e => e.preventDefault()}>{formatMessage({id:'Landing_page_Form_More'})} <i className='iconfont iconxia'></i> </span>
                            </Dropdown>
                        </div> : null
                    }
                </div>;
            }
        },
        {
            title: 'PV',
            dataIndex: 'PV',
            align: 'right',
            render: function (value) {
                return typeof value === 'number' ? value : '-';
            }
        },
        {
            title: 'UV',
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

    const [noAllowanceModalShow, set_noAllowanceModalShow] = useState(false);
    const [copyModalShow, set_copyModalShow] = useState(false);
    const [name, set_name] = useState('');
    const [Allowance, set_Allowance] = useState(0);
    const [sourceData, set_sourceData] = useState({});
    const [downloadShow, set_downloadShow] = useState(false);
    const [landing_search, set_searchValue] = useState('');
    function getAllowance () {
        return axios.get(`url`, { params: {permission_name: 'landing_page', lan: getLocale() === 'en-US' ? 'en' : 'zh'}});
    }
    function editor (data) {
        let link = '';
        if (data.link) {
            link = data.link.split('landing/')[1] || '';
            if (link) {
                link = link.replace(/.html.*/g, '');
            }
        }
        props.dispatch({
            type: 'landingPage/stateInt',
            page: data.draft_page_data ? JSON.parse(data.draft_page_data) : [],
            model_id: data.model_id || '',
            landing_draft_id: data.draft_id || '',
            landing_id: data.landing_id || '',
            name: data.name || '',
            title: data.title || '',
            form_id: data.form_id || '',
            page_status: typeof data.page_status === 'number' ? data.page_status : 0,
            link: link,
            utm_source: data.utm_source ||  '',
            utm_medium: data.utm_medium ||  '',
            utm_campaign: data.utm_campaign ||  '',
            utm_content: data.utm_content ||  '',
            utm_term: data.utm_term ||  '',
        });
        customize.OSreportFn('os-9-3-3');
        history.push('/promotion/landingpage/editor');
    }

    async function copyPage (data) {
        let result = await getAllowance();
        if (result.status_code === 200) {
            if (result.data.remain < 1) {
                set_noAllowanceModalShow(true);
            } else {
                set_sourceData(data);
                set_Allowance(result.data.remain);
                set_copyModalShow(true);
            }
        }
    }

    function copyDataOk () {
        let data =  {
            name: name,
            model_id: sourceData.model_id,
            form_id: sourceData.form_id,
            page_data: sourceData.page_data
        };
        axios.post(`url`, data).then(res => {
            if (res.status_code === 200) {
                getList({...pagination, current: 1});
            } else {
                message.error(res.message);
            }
            set_name('');
            set_copyModalShow(false);
        }).catch(err => {
            console.log('/landing/add_draft', err);
        });
    }

    function create () {
        customize.OSreportFn('os-9-3-2');
        history.push('/promotion/landingpage/create');
    }

    function copyLink(link, toastText) {
        const el = document.createElement('textarea');
        el.value = link;
        el.setAttribute('readonly', 'false');
        el.setAttribute('contenteditable', 'true');
        el.style.position = 'absolute';
        el.style.left = '-99999px';
        document.body.append(el);
        // 保存原有的选择区域
        const selected = document.getSelection().rangeCount > 0
            ? document.getSelection().getRangeAt(0)
            : false;

        el.select();
        el.setSelectionRange(0, el.textLength); // iOS 中使用 select() 函数无效
        let successful = document.execCommand('copy');
        document.body.removeChild(el);
        if (selected) {
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(selected);
        }
        if (successful === true) {
            message.success(toastText);
        } else {
            message.error('error');
        }
    }

    async function createShortLink (data) {
        // 生成短链接
        let short = await axios.post('url', {
            url: encodeURIComponent(data.link)
        });
        if (short.status_code === 200) {
            let saveShortApi = await axios.post(`url`, {
                landing_id: data.landing_id,
                short_link: short.result
            });
            if (saveShortApi.status_code === 200) {
                getList({...pagination, current: 1}, () => {
                    copyLink(short.result, formatMessage({id:'landing_page_copied_successfully'}));
                });
            } else {
                message.error(saveShortApi.message);
            }
        } else {
            message.error(short.message);
        }
    }

    function DownloadHtml (data) {
        set_sourceData(data);
        set_downloadShow(true);
    }

    function downloadOk () {
        let data = sourceData;
        let htmlstr = creteaHtml(data.page_data, data.title, 'DownloadHtml', data.draft_id, data.form_id);
        let downLink = document.createElement('a');
        downLink.download = 'landingpage.html';
        //字符内容转换为blod地址
        let blob = new Blob([htmlstr]);
        downLink.href = URL.createObjectURL(blob);
        // 链接插入到页面
        document.body.appendChild(downLink);
        downLink.click();
        // 移除下载链接
        document.body.removeChild(downLink);
        set_downloadShow(false);
    }

    function switchChange (data) {
        let postdata = {
            landing_id: data.landing_id,
            page_status: data.page_status ? 0 : 1
        };
        axios.post(`url`, postdata).then(res => {
            if (res.status_code === 200) {
                getList({...pagination, current: 1});
                let toast = !data.page_status ? formatMessage({id: 'Landing_page_Pending'}) : formatMessage({id: 'Landing_page_Published'});
                message.success(toast);
            }else{
                customize.errCodeMessage(res);
            }
        }).catch(err => {
            console.log('/landing/open_edit', err);
        });
    }

    function tablechange (pagination_arg) {
        getList({...pagination, ...pagination_arg});
    }

    function getList (pageData, callback) {
        let data = {
            landing_search: landing_search,
            limit: pageData.pageSize,
            offset: (pageData.current - 1) * pageData.pageSize
        };
        axios.post(`url`, data).then(res => {
            if (res.status_code === 200) {
                set_list(res.result);
                setpagination({...pageData, total: res && res.total_count || 0});
                callback && callback();
            }else{
                customize.errCodeMessage(res);
            }
        }).catch(err => {
            console.log('/landing/page/list', err);
        });
    }
    useEffect(() => {
        props.dispatch({
            type: 'landingPage/clearAll',
        });
        localStorage.removeItem('currentLandingPageData');
    }, []);
    useEffect(() => {
        getList({...pagination, current: 1});
    }, [landing_search]);
    return <div className="LandingPageList_wrap">
        <div className="header">
            <h2>{formatMessage({id:'Landing_page_title'})}</h2>
            <div>
                <SearchInput dataID="os-9-3-1" requestData={value => {set_searchValue(value);}} placeholder={formatMessage({id:'landing_page_Search_Landing_Page'})}/>
                <PermissionTooltip disabled={!landing_page}>
                    <Button disabled={!landing_page} onClick={create} size="small" type="primary">+ {formatMessage({id:'Landing_page_Form_Create_Page'})}</Button>
                </PermissionTooltip>
            </div>
        </div>
        <div className="table_w_s">
            <Table dataSource={list} className="landing_page_table" rowKey="lp_id" onChange={tablechange} pagination={pagination} columns={columns} scroll={{ x: 1440 }}/>
        </div>
        <Modal className="ant_modal_selfstyle" width={368} okButtonProps={{disabled: name ? false : true}} onOk={copyDataOk} onCancel={() => {set_copyModalShow(false);}} visible={copyModalShow}  title={formatMessage({id: 'Landing_Page_Clone'})}>
            <div className="" style={{marginBottom: '20px'}}>{formatMessage({id:'landing_page_landing_page_name'})}</div>
            <div className="create_landing_page" style={{paddingBottom: '40px'}}>
                <div className="lable_s">{formatMessage({id:'Landing_page_Form_Page_Name'})}</div>
                <div className="input_s_w">
                    <Input value={name} onChange={e => { set_name(e.target.value);}}/>
                    <span className="notify">
                        {formatMessage({id:'landing_page_cp_page_num'},{number:Allowance})}
                    </span>
                </div>
            </div>
        </Modal>
        <Modal className="ant_modal_selfstyle" width={280} onOk={downloadOk} onCancel={() => {set_downloadShow(false);}} visible={downloadShow}  title={formatMessage({id:'landing_page_download_page'})}>
            <div>{formatMessage({id:'landing_page_download_pack'})}</div>
        </Modal>
        <Modal className="ant_modal_selfstyle" onCancel={() => {set_noAllowanceModalShow(false);}} width={280} footer={<Button onClick={() => {history.push('/UpgradePackage/price');} } type="primary">{formatMessage({id:'UpgradePackage_Title'})}</Button>} visible={noAllowanceModalShow} title={formatMessage({id:'landing_page_Page_Creation_Failed'})}>
            <div>
                {formatMessage({id:'landing_page_creation_reached_package_limit'})}
                {formatMessage({id:'landing_page_click_btn_cteat'})}
            </div>
        </Modal>
    </div>;
}

export default connect(({rolePermission}) => ({rolePermission}))(List);
