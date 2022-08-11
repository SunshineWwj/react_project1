import React, { useEffect, useState } from 'react'
import { ReadOutlined, EditOutlined, DatabaseOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom'

const items = [
    getItem('查看文章列表List', 'list', <ReadOutlined />),
    getItem('查看文章列表Table', 'listTable', <ReadOutlined />),
    getItem('文章编辑', 'edit', <EditOutlined />),
    getItem('修改资料', 'means', <DatabaseOutlined />),
];
function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
export default function Aside() {
    const navigate = useNavigate();
    const location = useLocation();
    const [defaultKey, setDefaultKey] = useState('')

    useEffect(() => {
        const key = location.pathname.split('/')[1];
        setDefaultKey(key)
    }, [location.pathname])

    const onClick = (e) => {
        navigate(`/${e.key}`)
        setDefaultKey(e.key)
    }
    return (
        <Menu
            className='aside'
            onClick={onClick}
            style={{
                width: 256,
            }}
            selectedKeys={[defaultKey]}
            mode="inline"
            theme="dark"
            items={items}
        />
    )
}
