import React from 'react';
import { Form, Input, Button, Select, } from 'antd';
import {useIntl} from 'umi';
const { Option } = Select;
function PreviewForm (props) {
    const { formatMessage } = useIntl();
    return <div>
        <Form size="small" colon={false} {...{labelCol: { span: 6 },wrapperCol: { span: 16 },}}>
            {
                props.formList ? props.formList.map((item, index) => {
                    let label = item.label;
                    if (item.required) {
                        label = `${item.label} *`;
                    }
                    if (item.type === 'input') {
                        return <Form.Item key={`Form_${index}`} label={<span className="lable_s_s">{label}</span>}>
                            <Input placeholder={item.placeholder || item.label} />
                        </Form.Item>;
                    }
                    if (item.type === 'select') {
                        return <Form.Item key={`Form_${index}`} label={<span  className="lable_s_s">{label}</span>}>
                            <Select placeholder={item.placeholder || 'Choose Gender'}>
                                <Option value="1">Male</Option>
                                <Option value="2">Female</Option>
                            </Select>
                        </Form.Item>;
                    }
                    if (item.type === 'button') {
                        return <Form.Item {...{wrapperCol: { offset: 6, span: 16 },}} key={`Form_${index}`} label="">
                            <Button style={{width: '100%'}} onClick={() => {}} disabled={true} type="primary">{item.button_text}</Button>
                        </Form.Item>;
                    }
                    return null;
                }) : null
            }
        </Form>
        <span className="notice_">{formatMessage({id: 'landing_page_create_form_preview_noclick'})}</span>
    </div>;
}

export default PreviewForm;
