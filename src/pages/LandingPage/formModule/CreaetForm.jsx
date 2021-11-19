import React,{useState} from 'react';
import { Form, Input, Button, Table, Select, Divider, Modal, message } from 'antd';
import './index.scss';
import { useEffect } from 'react';
import {api} from '../../../../helpers/auth';
import axios from 'axios';
import PreviewForm from './PreviewForm';
import { history, useIntl } from 'umi';

const { Option } = Select;
const typeData = {
    firstName: 'First Name',
    lastName: 'Last Name',
    name: 'Name',
    country: 'Country',
    city: 'City',
    age: 'Age',
    email: 'E-mail',
    sex: 'Gender',
    phone: 'Mobile'
};
function CreateForm (props) {
    const { formatMessage } = useIntl();
    const [form_name, set_form_name] = useState('');
    const [form_id, set_form_id] = useState('');
    const [previewShow, set_previewShow] = useState(false);
    const [previewData, set_previewData] = useState(null);
    const [selectTypeList, set_selectTypeList] = useState([
        {
            type: 'input',
            label: '',
            required: true,
            placeholder: '',
            labelSelf: '姓名',
            key: 'name',
        },
        {
            type: 'input',
            label: '',
            required: true,
            placeholder: '',
            labelSelf: '手机',
            key: 'phone',
        },
        {
            type: 'input',
            label: '',
            required: true,
            placeholder: '',
            labelSelf: '姓',
            key: 'firstName',
        },
        {
            type: 'input',
            label: '',
            required: true,
            placeholder: '',
            labelSelf: '名',
            key: 'lastName',
        },
        {
            type: 'input',
            label: '',
            required: true,
            placeholder: '',
            labelSelf: '国家',
            key: 'country',
        },
        {
            type: 'input',
            label: '',
            required: true,
            placeholder: '',
            labelSelf: '城市',
            key: 'city',
        },
        {
            type: 'input',
            label: '',
            required: true,
            placeholder: '',
            labelSelf: '年龄',
            key: 'age',
        },
        {
            type: 'input',
            label: '',
            placeholder: '',
            required: true,
            labelSelf: '邮箱',
            key: 'email',
        },
        {
            type: 'select',
            label: '',
            required: true,
            placeholder: '',
            labelSelf: '性别',
            key: 'sex',
        }
    ]);
    const [filterList, set_filterList] = useState([]);
    const [buttonData, set_buttonData] = useState({
        type: 'button',
        key: 'add',
        button_text: '',
        success_text: '',
    });
    const [list, set_list] = useState([
        {
            type: 'input',
            label: '',
            required: true,
            placeholder: '',
            labelSelf: '姓名',
            key: 'name',
        },
        {
            type: 'input',
            label: '',
            required: true,
            placeholder: '',
            labelSelf: '手机',
            key: 'phone',
        },
        {
            key: 'add', 
            type: 'button',
            button_text: '',
            success_text: '',
        }
    ]);
    const columnsInt = [
        {
            title: formatMessage({id: 'landing_page_formlist_Field_type'}),
            dataIndex: 'status',
            width: 120,
            render: function (value, data, index) {
                let len = list.length;
                let obj = {
                    children: <Select dropdownClassName="select_s_dropdown" className="select_s" getPopupContainer={triggerNode => triggerNode.parentElement} onChange={(value) => {typeChange(value, index);}} value={data.labelSelf} bordered={false} placeholder={formatMessage({id: 'landing_page_form_choose_field_type'})}>
                        {
                            filterList.map(item => {
                                return <Option key={item.key} value={item.key}>
                                    {item.labelSelf}
                                </Option>;
                            })
                        }
                    </Select>,
                    props: {
                        colSpan: 1,
                    },
                };
                if (index === len - 1) {
                    obj.children = <Button disabled={list.length > selectTypeList.length} onClick={add} type="text">{`+ ${formatMessage({id: 'landing_page_form_add_item'})}`}</Button>;
                    obj.props.colSpan = 5;
                }
                if (index !== len - 1 && (data.key && data.key.includes('add'))) {
                    obj.props.colSpan = 4;
                }
                return obj;
            }
        },
        {
            title: formatMessage({id: 'landing_page_formlist_Field_Name'}),
            dataIndex: 'name',
            render: function (value, data, index) {
                let len = list.length;
                if (index === len - 1 || (data.key && data.key.includes('add'))) {
                    return {
                        children: '',
                        props: {
                            colSpan: 0,
                        },
                    };
                }
                return <Input value={data.label} onChange={e => { tableInputChange(e.target.value, 'label', index); }} placeholder={formatMessage({id: 'landing_page_form_enter_field_name'})} bordered={false}/>;
            }
        },
        {
            title: formatMessage({id: 'landing_page_form_create_prompt_text'}),
            dataIndex: 'notify',
            render: function (value, data, index) {
                let len = list.length;
                if (index === len - 1 || (data.key && data.key.includes('add'))) {
                    return {
                        children: '',
                        props: {
                            colSpan: 0,
                        },
                    };
                }
                return <Input value={data.placeholder}  onChange={e => { tableInputChange(e.target.value, 'placeholder', index); }} placeholder={formatMessage({id: 'landing_page_form_Fill_placeholder'})} bordered={false} />;
            }
        },
        {
            title: formatMessage({id: 'landing_page_formlist_Required'}),
            dataIndex: 'isRequire',
            width: 140,
            render: function (value, data, index) {
                let len = list.length;
                if (index === len - 1 || (data.key && data.key.includes('add'))) {
                    return {
                        children: '',
                        props: {
                            colSpan: 0,
                        },
                    };
                }
                return <Select className="select_s" onChange={(value) => {requiredChange(value, index);}} getPopupContainer={triggerNode => triggerNode.parentElement} bordered={false} value={data.required || false}>
                    <Option value={true}>{formatMessage({id: 'landing_page_form_item_required'})}</Option>
                    <Option value={false}>{formatMessage({id: 'landing_page_form_item_not_required'})}</Option>
                </Select>;
            }
        },
        {
            title: formatMessage({id: 'landing_page_formlist_action'}),
            dataIndex: 'action',
            render: function (value, data, index) {
                let len = list.length;
                if (index === len - 1) {
                    return {
                        children: '',
                        props: {
                            colSpan: 0,
                        },
                    };
                }
                return <span>
                    {
                        index > 0 ? <span className="pointer blue" onClick={() => {move('top', index);}}>{formatMessage({id: 'landing_page_form_item_move_up'})}<Divider type="vertical" /></span> : null
                    }
                    {
                        index < len - 2 ? <span className="pointer blue" onClick={() => {move('bottom', index);}}>{formatMessage({id: 'landing_page_form_item_move_down'})}<Divider type="vertical" /></span> : null
                    }
                    <span  className="pointer" onClick={() => {deleteItem(index);}}>{formatMessage({id: 'landing_page_form_Delete'})}</span>
                </span>;
            }
        }
    ];
    const [columns, set_columns] = useState(columnsInt);
    
    useEffect(() => {
        set_columns(columnsInt);
    }, [list, filterList]);
    
    useEffect(() => {
        if (props.source) {
            let sourceList = props.source.form_content;
            get_intFilterList(sourceList);
            set_list(sourceList);
            set_form_id(props.source.form_id);
            set_form_name(props.source.form_name);
            set_buttonData(Object.assign(buttonData, {button_text: props.source.button_text, success_text: props.source.success_text}));
        } else {
            get_intFilterList();
        }
    }, []);
    function get_intFilterList (intList) {
        let includes = (intList || list).map(item => item.key);
        let filterList_s = selectTypeList.filter(item => !includes.includes(item.key));
        set_filterList(filterList_s);
    }
    function requiredChange (value, index) {
        list[index].required = value;
        set_list(Object.assign([], list));
    }
    function typeChange (value, index) {
        list[index] = selectTypeList.find(item => item.key === value);
        get_intFilterList(list);
        set_list(Object.assign([], list));
    }
    function tableInputChange (value, key, index) {
        list[index][key] = value;
        set_list(Object.assign([], list));
    }
    function buttonChange (value, type) {
        buttonData[type] = value;
        set_buttonData(Object.assign({}, buttonData));
    }
    function add () {
        let keyTime = new Date().getTime();
        list.splice(list.length - 1, 0, {key: `add_select_${keyTime}`});
        set_list(Object.assign([], list));
    }
    function move (type, sourceIndex) {
        let current = list[sourceIndex + 1];
        let moveData = list[sourceIndex];
        let result = list.map((item, index) => {
            if (type === 'top') {
                if (index === sourceIndex - 1) {
                    current = item;
                    return moveData;
                }
                if (index === sourceIndex) {
                    return current;
                }
            }
            if (type === 'bottom') {
                if (index === sourceIndex + 1) {
                    return moveData;
                }
                if (index === sourceIndex) {
                    return current;
                }
            }
            return item;
        });
        set_list(result);
    }
    function tableNoSelect () {
        return list.some(item => item.key && item.key.includes('add_select'));
    }
    function deleteItem (index) {
        if (list.length < 3) {
            return message.error(formatMessage({id: 'landing_page_form_keep_last_one'}));
        }
        list.splice(index, 1);
        get_intFilterList(list);
        set_list(Object.assign([], list));
    }
    function preview () {
        let list_copy = JSON.parse(JSON.stringify(list));
        let result = list_copy.map(item => {
            if (!item.label) {
                item.label = typeData[item.key];
            } 
            return item;
        });
        result[result.length - 1] = buttonData;
        set_previewData(result);
        set_previewShow(true);
    }
    function submit () {
        let list_copy = JSON.parse(JSON.stringify(list));
        let form_content = list_copy.map(item => {
            if (!item.label) {
                item.label = typeData[item.key];
            } 
            return item;
        });
        form_content[form_content.length - 1] = buttonData;
        let postData = {
            form_content,
            form_id: form_id,
            form_name: form_name,
            button_text: buttonData.button_text,
            success_text: buttonData.success_text
        };
        axios.post(`url`, postData).then(res => {
            if (res.status_code === 200) {
                history.go(-1);
            } else {
                message.error(res.message);
            }
        }).catch(err => {
            message.error(err.message);
        });
    }
    return <div className="create_form_w_s">
        <h3 className="page-title">{props.title}</h3>
        <div className="form_s_w">
            <Form colon={false}>
                <Form.Item required={true} label={formatMessage({id: 'landing_page_form_name'})}>
                    <Input value={form_name} onChange={e => {set_form_name(e.target.value);}}/>
                </Form.Item>
                <Form.Item required={true} label={formatMessage({id: 'landing_page_form_content'})}>
                    <Table bordered dataSource={list} rowKey="key" columns={columns} pagination={false}/>
                </Form.Item>
                <Form.Item required={true} label={formatMessage({id: 'landing_page_form_submitbtn_text'})}>
                    <Input maxLength={30} value={buttonData.button_text} onChange={(e) => {buttonChange(e.target.value, 'button_text');}}/>
                </Form.Item>
                <Form.Item required={true} label={formatMessage({id: 'landing_page_form_submit_success_text'})}>
                    <Input maxLength={30} value={buttonData.success_text}  onChange={(e) => {buttonChange(e.target.value, 'success_text');}}/>
                </Form.Item>
                <Form.Item label={<span></span>}>
                    <Button onClick={() => {history.go(-1);}} size="small" style={{marginRight: '20px'}}>{formatMessage({id: 'landing_page_form_cancel'})}</Button>
                    <Button disabled={tableNoSelect() || !buttonData.button_text || !buttonData.success_text || !form_name} onClick={preview} size="small" style={{marginRight: '20px'}} type="primary" >{formatMessage({id: 'Landing_page_Form_Preview'})}</Button>
                    <Button disabled={tableNoSelect() || !buttonData.button_text || !buttonData.success_text || !form_name} size="small" onClick={submit} type="primary">{formatMessage({id: 'Landing_page_Form_save'})}</Button>
                </Form.Item>
            </Form>
        </div>
        <Modal className="ant_modal_selfstyle" width={368} onCancel={() => {set_previewShow(false);}} footer={null} visible={previewShow} title={formatMessage({id: 'landing_page_create_form_preview'})}>
            <PreviewForm formList={previewData} />
        </Modal>
    </div>;
}

export default CreateForm;
