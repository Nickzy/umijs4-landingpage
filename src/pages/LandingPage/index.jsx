import React from 'react';
import {useState, useEffect} from 'react';
import { withRouter, useIntl } from 'umi';
import Editor from './editor/Editor';
import LandingPageList from './list/LandingPageList';
import MasterplateList from './list/MasterplateList';
import FormCtrList from './list/FormCtrList';
import GaList from './list/GaList';
import { customize } from '../../../helpers/auth';
import noaccess from '@/assets/images/noPermission.png';
import TeamNoAccess from '../../../components/TeamNoAccess/TeamNoAccess';
import NoPermission from '../../../components/NoPermission/NoPermission';
import CreaetForm from './formModule/CreaetForm';
import FormList from './formModule/List';

import {Spin} from 'antd';
import {connect} from 'dva';

function Index (props) {
    const { formatMessage } = useIntl();
    let { child, detail } = props.match.params;
    function getDom (detail, sourceProps) {
        let source = null;
        let { query } = sourceProps.location;
        if (query && query.source) {
            source = JSON.parse(query.source);
        }
        switch (detail) {
            case 'editor': return <Editor/>;
            case 'list': return <LandingPageList/>;
            case 'create': return <MasterplateList/>;
            case 'form_ctr': return <FormCtrList/>;
            case 'ga': return <GaList/>;
            case 'create_form': return <CreaetForm title={formatMessage({id: 'landing_page_create_form'})}/>;
            case 'editor_form': return <CreaetForm source={source} title={formatMessage({id: 'landing_page_editor_form'})}/>;
            case 'form_list': return <FormList/>;
            default: return null;
        }
    }
    return customize.isFreeBase() ?
        <NoPermission img={noaccess} title={formatMessage({id:'landing_page_nopermission_title'})} content='' tips={[formatMessage({id:'landing_page_nopermission_tip1'}),formatMessage({id:'landing_page_nopermission_tip2'}),formatMessage({id:'landing_page_nopermission_tip3'})]} warning={formatMessage({id:'landing_page_nopermission_warning'})}/>
        :
        <div style={{padding: child === 'landingpage' && detail === 'editor' ? 0 : '0 12px 12px', width: '100%', display: 'block', height: '100%'}}>
            {
                getDom(detail, props)
            }

        </div>;
}

export default withRouter(connect(({rolePermission}) => ({rolePermission}))(Index));
