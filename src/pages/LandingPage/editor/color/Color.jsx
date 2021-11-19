import React from 'react';
import { SketchPicker } from 'react-color';
import './Color.scss';
import {useState} from 'react';

function Color (props) {
    const [color, set_color] = useState(props.color || '#FFFFFF');
    function colorChange (colorData) {
        let {hex = ''} = colorData;
        let hexUpperCase = hex.toLocaleUpperCase();
        set_color(hexUpperCase);
        props.change && props.change(hexUpperCase);
    }
    return <div className="color_picker_wrap_s">
        <SketchPicker color={color} onChange={colorChange} /> 
    </div>;
}

export default Color;
