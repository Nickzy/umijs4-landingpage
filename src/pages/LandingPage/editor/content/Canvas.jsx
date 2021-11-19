import React from 'react';
import { Form, Button, Input, Select } from 'antd';
import './Canvas.scss';
import {connect} from 'dva';
import {useEffect} from 'react';
import { useState } from 'react';
const { Option } = Select;

function Canvas (props) {
    const [device, set_device] = useState(props.device);
    useEffect(() => {
        set_device(props.device);
    }, [props.device]);

    useEffect(() => {
        if (!props.isPreview && !props.activeData.key) {
            domClick({target: {}}, null, '0', true);
        }
    }, []);

    function getNewPage (sourceData, list, oldLlist) {
        let activeData = {};
        let page = sourceData.map((item, index) => {
            if (oldLlist && index === Number(oldLlist[0])) {
                if (!item[oldLlist[1]]) {
                    item.active = false;
                } else {
                    if (item[oldLlist[1]][oldLlist[2]]) {
                        if (item[oldLlist[1]][oldLlist[2]][oldLlist[3]]) {
                            if (item[oldLlist[1]][oldLlist[2]][oldLlist[3]][oldLlist[4]]) {
                                if (item[oldLlist[1]][oldLlist[2]][oldLlist[3]][oldLlist[4]][oldLlist[5]]) {
                                    if (item[oldLlist[1]][oldLlist[2]][oldLlist[3]][oldLlist[4]][oldLlist[5]][oldLlist[6]]) {
                                        item[oldLlist[1]][oldLlist[2]][oldLlist[3]][oldLlist[4]][oldLlist[5]][oldLlist[6]].active = false;
                                    } else {
                                        item[oldLlist[1]][oldLlist[2]][oldLlist[3]][oldLlist[4]][oldLlist[5]].active = false;
                                    }
                                    
                                } else {
                                    item[oldLlist[1]][oldLlist[2]][oldLlist[3]][oldLlist[4]].active = false;
                                }
                            } else {
                                item[oldLlist[1]][oldLlist[2]][oldLlist[3]].active = false;
                            }
                        } else {
                            item[oldLlist[1]][oldLlist[2]].active = false;
                        }
                    } else {
                        item[oldLlist[1]].active = false;
                    }
                }
            }
            if (index === Number(list[0])) {
                if (!item[list[1]]) {
                    activeData = item;
                    item.active = true;
                } else {
                    if (item[list[1]][list[2]]) {
                        if (item[list[1]][list[2]][list[3]]) {
                            if (item[list[1]][list[2]][list[3]][list[4]]) {
                                if (item[list[1]][list[2]][list[3]][list[4]][list[5]]) {
                                    if (item[list[1]][list[2]][list[3]][list[4]][list[5]][list[6]]) {
                                        activeData = item[list[1]][list[2]][list[3]][list[4]][list[5]][list[6]];
                                        item[list[1]][list[2]][list[3]][list[4]][list[5]][list[6]].active = true;
                                    } else {
                                        activeData = item[list[1]][list[2]][list[3]][list[4]][list[5]];
                                        item[list[1]][list[2]][list[3]][list[4]][list[5]].active = true;
                                    }
                                } else {
                                    activeData = item[list[1]][list[2]][list[3]][list[4]];
                                    item[list[1]][list[2]][list[3]][list[4]].active = true;
                                }
                            } else {
                                activeData = item[list[1]][list[2]][list[3]];
                                item[list[1]][list[2]][list[3]].active = true;
                            }
                        } else {
                            activeData = item[list[1]][list[2]];
                            item[list[1]][list[2]].active = true;
                        }
                    } else {
                        activeData = item[list[1]];
                        item[list[1]].active = true;
                    }
                }
            }
            return item;
        });
        return {
            result: page,
            active_data: activeData
        };
    }

    function linkClick (e, link) {
        // 只是展示状态
        if (props.isPreview && link) {
            e.preventDefault(); e.stopPropagation();
            window.open(link);
        }
    }

    function domClick (e, data, sourcefrom = null, isInt) {
        // e.preventDefault(); e.stopPropagation(); 
        // 只是展示状态
        if (props.forbiddenClick) {
            return false;
        }
        if (props.isPreview) {
            return false;
        }
        let {page, activeData,} = props;
        if (e.target) {
            sourcefrom = (e.target.getAttribute ? e.target.getAttribute('sourcefrom') : null) || sourcefrom;
            if (sourcefrom) {
                let strArr = sourcefrom.split(',');
                let oldStr = activeData.key ? activeData.key.split(',') : null;
                if (activeData.key === sourcefrom && !isInt) {
                    return false;
                }
                let {result, active_data} = getNewPage(page, strArr, oldStr);
                props.dispatch({
                    type: 'landingPage/activeData',
                    page: result,
                    activeData: {
                        type: '',
                        key: sourcefrom,
                        data: active_data,
                    }
                });
                if (!props.siderShow) {
                    props.dispatch({
                        type: 'landingPage/siderStatusChange',
                        siderShow: true
                    });
                }
            }
        }
    }
    // 获取class名字
    function getClassName (data) {
        if (!data) {
            return '';
        }
        let arr = [];
        for (let i in data) {
            if (data[i]) {
                arr.push(`${i}_${data[i]}`);
            }
        }
        return arr.join(' ');
    }

    function getTextElements (data, sourcefrom) {
        if (!data) {
            return null;
        }

        if (Array.isArray(data)) {
            return <div key={sourcefrom}>
                {
                    data.map((item, index) => {
                        let sourcefrom_ = `${sourcefrom},${index}`;
                        return <p onClick={(e) => {linkClick(e, item.link);}} className={`${!props.isPreview && item.active ? 'active' : ''} ${item.link ? 'link' : ''}`} key={sourcefrom_} sourcefrom={sourcefrom_} {...item.props}>{item.text}</p>;
                    })
                }
            </div>;
        }
        return <p onClick={(e) => {linkClick(e, data.link);}} className={`${!props.isPreview && data.active ? 'active' : ''}  ${data.link ? 'link' : ''}`} {...data.props} sourcefrom={sourcefrom}>{data.text}</p>;
    }
    function getFormElements (data, sourcefrom) {
        if (!data) {
            return null;
        }
        return <Form onClick={(e) => { e.preventDefault(); e.stopPropagation(); domClick(e, data, sourcefrom);}} className={`self_and_form ${!props.isPreview && data.active ? 'active' : ''}`} key={sourcefrom} sourcefrom={sourcefrom} {...data.props}>
            {
                data.content.map((item, index) => {
                    let label = item.label;
                    if (item.required) {
                        label = `${item.label} *`;
                    }
                    if (item.type === 'input') {
                        if (item.key === 'phone') {
                            return <Form.Item key={`Form_${index}`} {...item.wrapProps} label={<span className="lable_s_s"  {...item.props}>{label}</span>}>
                                <div className="phone_ts_form">
                                    <Input placeholder={item.placeholder} style={{width: '54px'}} defaultValue={'+86'}/>
                                    <Input placeholder={item.placeholder || item.label} />
                                </div>
                            </Form.Item>;
                        }
                        return <Form.Item key={`Form_${index}`} {...item.wrapProps} label={<span className="lable_s_s"  {...item.props}>{label}</span>}>
                            <Input placeholder={item.placeholder || item.label} />
                        </Form.Item>;
                    }
                    if (item.type === 'select') {
                        return <Form.Item key={`Form_${index}`} {...item.wrapProps} label={<span className="lable_s_s"  {...item.props}>{label}</span>}>
                            <Select placeholder={item.placeholder || 'Choose Gender'}>
                                <Option value="1">Male</Option>
                                <Option value="2">Female</Option>
                            </Select>
                        </Form.Item>;
                    }
                    if (item.type === 'button') {
                        return <Form.Item {...item.formItemProps} key={`Form_${index}`} label="">
                            <Button onClick={() => {}} {...item.props} type="primary">{item.content || item.button_text}</Button>
                        </Form.Item>;
                    }
                    return null;
                })
            }
        </Form>;
    }
    function getButtonElements (data, sourcefrom) {
        if (!data) {
            return null;
        }
        return <Button className={`${!props.isPreview && data.active ? 'active' : ''}`} key={sourcefrom} onClick={(e) => { e.preventDefault(); e.stopPropagation(); domClick(e, data, sourcefrom); linkClick(e, data.link);}} {...data.props}>{data.text}</Button>;
    }
    function getModuleElements (data, sourcefrom, wrapclassName = '') {
        if (!data) {
            return null;
        }
        function getBaseDom (baseData, baseData_sourcefrom) {
            let { layout = [] } = baseData;
            return layout.map(type => {
                if (!baseData[type]) {
                    return null;
                }
                if (type === 'imgData') {
                    let imgData = baseData[type];
                    let { classData = {} } = imgData;
                    return <img onError={(e)=>{e.target.src = '';}} onClick={e => {linkClick(e, imgData.link);}} className={`${!props.isPreview && imgData.active ? 'active' : ''} ${imgData.link ? 'link' : ''} ${classData[device]}`} key={`${baseData_sourcefrom},imgData`} sourcefrom={`${baseData_sourcefrom},imgData`} src={imgData.src} alt="" {...imgData.props}/>;
                }
                if (type === 'textData') {
                    return getTextElements(baseData[type], `${baseData_sourcefrom},textData`);
                }
                if (type === 'formData') {
                    return getFormElements(baseData[type], `${baseData_sourcefrom},formData`);
                }
                if (type === 'buttonData') {
                    return getButtonElements(baseData[type], `${baseData_sourcefrom},buttonData`);
                }
            });
        }
        if (data.source) {
            let {classData = {}} = data;
            return <div key={`${sourcefrom}_source`} className={`flex ${getClassName(classData[device])}`}>
                {getModuleElements(data.source, `${sourcefrom},source`, `flex ${getClassName(classData[device])}`)}
            </div>;
        }
        if (Array.isArray(data)) {
            return data.map((item, index) => {
                return <div key={`${sourcefrom}_${index}`} className={wrapclassName} style={{marginRight: device === 'pc' && index < data.length - 1 ? '10px' : 0}}>
                    {getModuleElements(item, `${sourcefrom},${index}`)}
                </div>;
            });
        } else {
            return getBaseDom(data, sourcefrom);
        }
        
    }
    function getDom (data, index) {
        let {source = [], layout, logo, wrapLayout = {}} = data;
        let fatherProps = data.props || [];
        return <div onClick={(e) => {domClick(e, data, `${index}`);}} className={`content_item ${!props.isPreview && data.active ? 'active' : ''}`} {...fatherProps} key={`content_item_${index}`}>
            {
                logo ? 
                    <div  className={`logo_wrap ${getClassName(logo.layout[device])}`}>
                        <div sourcefrom={`${index},logo`} className={`no_bg_logo ${!props.isPreview && logo.active ? 'active' : ''}`}>
                            {logo.src ? <img onError={(e)=>{e.target.src = '';}}sourcefrom={`${index},logo`} src={logo.src} alt=""/> : <div className="logo" sourcefrom={`${index},logo`}>Logo</div>}
                        </div>
                    </div>
                    :
                    null
            }
            <div className={`content ${getClassName(wrapLayout[device])}`}>
                {
                    source.map((sourceItem, sourceIndex) => {
                        return <div key={`${index},source,${sourceIndex}`} className={`gird first_gird ${getClassName(layout[sourceIndex][device])}`}>
                            {getModuleElements(sourceItem, `${index},source,${sourceIndex}`)}
                        </div>;
                    })
                }
            </div>
        </div>;
    }
    useEffect(() => {
    }, [props.page]);
    return <div className="landing_page_canvas_wrap" style={{...props.pageSytle}}>
        {
            props.page.map((item, index) => {
                return getDom(item, index);
            })
        }
    </div>;
}

export default connect(state => state.landingPage)(Canvas);
