import React, { useState, useEffect } from 'react';
function useData (props) {
    const [data, set_data] = useState(props.data);
    function styleChange (color, type) {
        let style = {};
        if (data.props && data.props.style) {
            style = {
                ...data.props.style,
                color
            };
            if (type) {
                style = {
                    ...data.props.style,
                    [type]: color
                };
            }
        } else {
            style = {
                [type]: color
            };
        }
        let new_data = Object.assign(data, {props: { ...data.props, style }});
        set_data(new_data);
        props.change && props.change(new_data);
    }
    function formSyleChange (color, type, styleName) {
        let list = data.content || [];
        list = list.map(item => {
            if (item.type === type) {
                let style_ = {
                    color
                };
                if (styleName) {
                    style_ = {
                        [styleName]: color
                    };
                }
                item.props.style = {
                    ...item.props.style,
                    ...style_
                };
            }
            return item;
        });

        let newData = Object.assign(data, {content: list});
        set_data(newData);
        props.change && props.change(newData);
    }
    function formSelectChange (selectData, form_id) {
        if (!selectData) {
            return false;
        }
        let result = selectData.form_content.map(item => {
            if (item.type === 'input' || item.type === 'select') {
                return {
                    ...item,
                    props: data.content[0].props
                };
            }
            if (item.type === 'button') {
                return {
                    ...item,
                    formItemProps: data.content[data.content.length - 1].formItemProps,
                    props: data.content[data.content.length - 1].props
                };
            }
        });
        let copydata = Object.assign({}, selectData);
        delete copydata.form_content;
        let newData = Object.assign(data, copydata, {content: result, form_id, });
        set_data(newData);
        props.change && props.change(newData);
    }
    function textChange (e) {
        let text = e.target ? e.target.value : '';
        let newData = Object.assign(data, {text});
        set_data(newData);
        props.change && props.change(newData, true);
    }
    function setLink (link) {
        let newData = Object.assign(data, {link});
        set_data(newData);
        props.change && props.change(newData);
    }
    function uploadChange (url) {
        let new_data = Object.assign(data, {src: url});
        set_data(new_data);
        props.change && props.change(new_data);
    }
    function textBlur () {
        props.change && props.textBlur();
    }
    useEffect(() => {
        if (props.data) {
            set_data(props.data);
        }
    }, [props.data]);
    return {
        data,
        styleChange,
        textChange,
        formSyleChange,
        uploadChange,
        formSelectChange,
        textBlur,
        setLink
    };
}

export default useData;
