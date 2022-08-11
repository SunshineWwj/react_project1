/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import logoImg from '../assets/logo.png'
import defaultAvatar from '../assets/defaultAvatar.jpg'
import { CaretDownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, message, Space } from 'antd';
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'


function Header(props) {
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState(defaultAvatar)
    const [username, setUsername] = useState('游客')

    useEffect(() => {
        const avatar1 = localStorage.getItem('avatar');
        const username1 = localStorage.getItem('username')
        if (avatar1) setAvatar('http://47.93.114.103:6688/' + avatar1)
        if (username1) setUsername(username1)
    }, [props.updateFlag])

    const logOut = () => {
        message.success('退出成功，即将返回登录页...')
        setTimeout(() => {
            navigate('/login')
        }, 1500);
        localStorage.clear();
    }
    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: '修改资料',
                },
                {
                    type: 'divider',
                },
                {
                    key: '2',
                    label: '退出登录',
                    onClick: logOut
                },
            ]}
        />
    );
    return (
        <header>
            <img src={logoImg} alt="" className="logo" />
            <div className="right">
                <Dropdown overlay={menu}>
                    <a className='ant-dropdown-link' onClick={(e) => e.preventDefault()}>
                        <Space>
                            <img src={avatar} alt="" className='avatar' />
                            <span>{username}</span>
                            <CaretDownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </div>
        </header>
    )
}

const mapStateToProps = (state) => {
    return {
        updateFlag: state.updateFlag
    }
}

export default connect(mapStateToProps)(Header)