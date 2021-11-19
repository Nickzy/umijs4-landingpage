
import React, { Component } from 'react';

import './index.scss'

const BasicLayout = (props: any) => {

    return (
        <div className="basic-layout">
            basic-layout
            {props.children}
        </div>
    )
}

export default BasicLayout