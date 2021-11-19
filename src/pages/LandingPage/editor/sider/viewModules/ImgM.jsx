import React from 'react';
import { useIntl } from 'umi';
import Upload from '../components/upload/Upload';
import Link from '../components/link/Link';
import useData from '../stateSider/state';

// 图片样式组件
function Img (props) {
    const { formatMessage } = useIntl();
    const {data, uploadChange, setLink} = useData(props);

    return <div className="Img_wrap">
        <div>
            <h3>{formatMessage({id:'Landing_page_Form_choose_Image'})}</h3>
            <Upload Dispatch={props.Dispatch} change={uploadChange} data={data}/>
            <span>{formatMessage({id:'Landing_page_Form_max_500k'})}</span>
        </div>
        <Link change={setLink}  value={data}/>
    </div>;
}

export default Img;
