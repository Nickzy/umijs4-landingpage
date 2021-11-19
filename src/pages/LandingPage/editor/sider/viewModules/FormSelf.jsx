import React from 'react';
import { useIntl, history } from 'umi';
import { Select, message, Button} from 'antd';
import { customize, api } from '../../../../../../helpers/auth';
import useData from '../stateSider/state';
import { useState, useEffect } from 'react';
import SelectColor from '../components/selectColor/SelectColor';
import axios from 'axios';
const { Option } = Select;
const form_nameData = {
    1: '表单1:',
    2: '表单2:',
    3: '表单3:',
    4: '表单4:',
    5: '表单5:',
    6: '表单6:'
};
const form_name_h = {
    1: '表单1: 姓名&手机',
    2: '表单2: 姓&名&手机',
    3: '表单3: 手机&邮箱',
    4: '表单4: 手机&国家',
    5: '表单5: 年龄&性别',
    6: '表单6: 邮箱&国家'
};
const formidlist = {
    1: 'BD_20210101180331-6232031',
    2: 'BD_20210102180332-6232032',
    3: 'BD_20210103180333-6232033',
    4: 'BD_20210104180334-6232034',
    5: 'BD_20210105180335-6232035',
    6: 'BD_20210106180336-6232036'
};

// 表单样式组件
function FormSelf (props) {
    const { formatMessage } = useIntl();
    const {data, formSyleChange, formSelectChange} = useData(props);
    const [selectList, set_selectList] = useState([]);
    const [havamore, set_havamore] = useState(false);
    const [apiLoading, set_apiLoading] = useState(false);
    const [pageListOption, set_pageListOption] = useState({
        limit: 10,
        offset: 0
    });
    const [total, set_total] = useState(0);
    let textColor = '#ffffff';
    let btnColor = '#ffffff';
    let btnBackg = '#ffffff';
    if (data && data.content) {
        data.content.forEach(item => {
            if (item.type === 'input') {
                textColor = item.props.style.color || '#ffffff';
            }
            if (item.type === 'button') {
                btnColor = item.props.style.color || '#ffffff';
                btnBackg = item.props.style.background || '#ffffff';
            }
        });
    }

    function moduleChange (value, optionData) {
        formSelectChange(selectList[optionData.key], `${optionData.value}`);
        props.Dispatch({
            type: 'landingPage/set_pageDetail',
            data: {
                form_id: optionData.value
            }
        });
    }

    function selectScroll (e) {
        if (havamore || apiLoading || selectList.length >= total + 6) {
            return true;
        }
        if (e.target) {
            let {scrollTop, scrollHeight, clientHeight} = e.target;
            if ((scrollHeight - clientHeight) - scrollTop < 5) {
                getList(pageListOption);
            }
        }
    }
    function getList (pageData) {
        set_apiLoading(true);
        let postData = {
            ...pageData
        };
        axios.post(`${api.apibeta}/landing/form_list`, postData).then(res => {
            if (res.status_code === 200) {
                let result = res.data;
                if (pageData.offset === 0) {
                    let ishave = res.data.find(item => Number(item.form_id) === Number(data.form_id));
                    if (!ishave) {
                        let new_form = {
                            ...data,
                            form_name: `${form_nameData[data.form_id] || ''}${data.form_name}`,
                            bd_id: formidlist[data.form_id] || data.bd_id,
                            form_content: data.content
                        };
                        result.unshift(new_form);
                    }
                }
                if (pageData.offset > 1) {
                    result = selectList.concat(result);
                }
                if (res.data.length < 10) {
                    set_havamore(true);
                }
                set_total(res.total_count);
                set_selectList(result);
            } else {
                message.error(res.message);
            }
            set_pageListOption({...pageData, offset: pageData.offset + 10});
            set_apiLoading(false);
        }).catch(err => {
            set_apiLoading(false);
            message.error(err.message);
        });
    }
    useEffect(() => {
        if (Number(data.form_id) < 7 || Number(data.formKey) < 7 ) {
            let form_id = data.form_id || data.formKey;
            let new_form = {
                ...data,
                form_name: `${form_name_h[form_id]}`,
                bd_id: formidlist[form_id] || data.bd_id,
                form_content: data.content
            };
            formSelectChange(new_form, form_id);
        }
        getList(pageListOption);
    }, []);
    return <div className="FormSelf_wrap">
        <div className="form_select_s">
            <h3>{formatMessage({id: 'landing_page_Select_Form'})}</h3>
            <Select onPopupScroll={selectScroll} size="small" onChange={moduleChange} value={Number(data.form_id || data.formKey) || null} style={{margin: '11px 0 7px'}}>
                {
                    selectList.map((item, index) => {
                        return <Option value={item.form_id} key={index}>{item.form_name}</Option>;
                    })
                }
            </Select>
            <span>{formatMessage({id: 'landing_page_Form_ID'})}：{data.bd_id}</span>
            <div className="form_btn_text_s">
                <Button onClick={() => {history.push('/promotion/landingpage/create_form');}} type="text">+ {formatMessage({id: 'landing_page_create_form'})}</Button>
                <Button onClick={() => {history.push('/promotion/landingpage/form_list');}} type="text">{formatMessage({id: 'landing_page_formlist_manage'})}</Button>
            </div>
        </div>
        <div className="button_style_s">
            <span className="title">{formatMessage({id: 'Landing_page_Form_Text_Style'})}</span>
            <SelectColor title={formatMessage({id: 'landing_page_Text'})} change={(color) => { formSyleChange(color, 'input'); }} color={textColor}/>
        </div>
        <div className="button_style_s">
            <span className="title">{formatMessage({id: 'landing_page_Button_Style'})}</span>
            <SelectColor title={formatMessage({id: 'landing_page_Text'})} change={(color) => { formSyleChange(color, 'button'); }} color={btnColor}/>
            <SelectColor title={formatMessage({id: 'landing_page_Button'})} color={btnBackg} change={(color) => { formSyleChange(color, 'button', 'background'); }}/>
        </div>
    </div>;
}

export default FormSelf;
