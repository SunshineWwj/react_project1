/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import '../less/listTable.less'
import { Table, Button, Space, Popconfirm, message, Modal, Card, Divider } from 'antd';
import { useNavigate } from 'react-router-dom'
import { ArticleDelApi, ArticleDetailApi, ArticleListApi } from '../request/api'
import { nanoid } from 'nanoid'
import moment from 'moment';

export default function ListTable() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({
    num: 1,
    count: 10,
    showTotal: total => `共${total}条数据`,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 30, 40]
  })
  const [showModal, setShowModal] = useState(false)
  const [articleDetail, setArticleDetail] = useState({})

  useEffect(() => {
    getArticleList({ num: 1, count: 10 })
  }, [])

  const getArticleList = (pageOption) => {
    ArticleListApi(pageOption).then(res => {
      if (res.errCode === 0) {
        setData((res.data.arr || []).map(item => ({
          ...item,
          uid: nanoid()
        })))
        setPagination({
          ...pagination,
          current: res.data.num,
          pageSize: res.data.count,
          total: res.data.total
        })
      }
    })
  }

  const onTableChange = (pageOption) => {
    getArticleList({ num: pageOption.current, count: pageOption.pageSize })
  }
  const confirm = (id) => {
    ArticleDelApi({ id }).then(res => {
      if (res.errCode === 0) {
        message.success(res.message)
        getArticleList({ num: 1, count: pagination.count });//刷新页面
      } else {
        message.error(res.message)
      }
    })
  }
  const getArticleDetail = (id) => {
    ArticleDetailApi({ id }).then(res => {
      if (res.errCode === 0) {
        setArticleDetail(res.data)
      }
    })
  }
  const showArticleDetail = (id) => {
    setShowModal(true)
    getArticleDetail(id)
  }
  const columns = [
    {
      dataIndex: 'title',
      key: 'title',
      width: '60%',
      render: (text, record) => (
        <>
          <p className='table_title' onClick={() => showArticleDetail(record.id)}>{record.title}</p>
          <p style={{ color: '#999' }}>{record.subTitle}</p>
        </>
      ),
    },
    {
      dataIndex: 'date',
      key: 'date',
      render: text => moment(text).format('YYYY-MM-DD hh:mm:ss')
    },
    {
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <Space size={'middle'}>
          <Button type='primary' onClick={() => navigate(`/edit/${record.id}`)}>编辑</Button>
          <Popconfirm
            placement="topLeft"
            title="是否确认删除该文章"
            onConfirm={() => confirm(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button type='danger' >删除</Button>
          </Popconfirm>
        </Space>
      )
    },
  ]
  return (
    <div className='list_table'>
      <Table
        pagination={pagination}
        showHeader={false}
        columns={columns}
        dataSource={data}
        rowKey={'uid'}
        onChange={onTableChange}
      />
      <Modal
        footer={null}
        visible={showModal}
        width='60%'
        onCancel={() => setShowModal(false)}
      >
        <Card title={articleDetail.title}>
          <h3>{articleDetail.subTitle}</h3>
          <h5 dangerouslySetInnerHTML={{__html:articleDetail.content}} style={{color:'GrayText'}}></h5>
        </Card>
      </Modal>
    </div>
  )
}
