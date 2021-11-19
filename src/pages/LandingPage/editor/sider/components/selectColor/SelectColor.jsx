import React, { useState, useEffect, useRef } from 'react';
import Color from '../../../color/Color';
import { useIntl } from 'umi';

function SelectColor (props) {
    const { formatMessage } = useIntl();
    const [showColorPciker, set_showColorPciker] = useState(false);
    const colorref = useRef(null);
    function isChildOf(child, parent) {
        if (child && parent) {
            let parentNode = child.parentNode;
            while (parentNode) {
                if (parent === parentNode) {
                    return true;
                }
                parentNode = parentNode.parentNode;
            }
        }
        return false;
    }

    function showColorClick (e) {
        if (e.target && (e.target.className === 'color_select_s_w' || e.target.className === 'color_show')) {
            set_showColorPciker((b) => !b);
        }
    }

    function windowClick (e) {
        if (e.target && e.target !== colorref.current && !isChildOf(e.target, colorref.current)) {
            window.onclick = null;
            set_showColorPciker(false);
        }
    }
    useEffect(() => {
        return () => {
            window.onclick = null;
        };
    }, []);

    useEffect(() => {
        if (showColorPciker) {
            window.onclick = windowClick;
        }
        return () => {

        };
    }, [showColorPciker]);
    return <div className="SelectColor_wrap">
        <span className="label_s" >{props.title || formatMessage({id: 'Landing_page_Form_Text_Style'})}</span>
        <div className="color_select_s_w" ref={colorref} onClick={showColorClick}>
            <div className="color_show" style={{background: props.color || 'blue'}}></div>
            {
                showColorPciker ?
                    <Color change={props.change} color={props.color}/>
                    : null
            }
        </div>
    </div>;
}

export default SelectColor;
