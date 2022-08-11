import React, { useEffect, useState } from 'react'
import { Button, PageHeader, Modal, Form, Input, message } from 'antd';
import moment from 'moment';
import E from 'wangeditor'
import { ArticleAddApi, ArticleDetailApi, ArticleUpdateApi } from '../request/api'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import MyInput from '../components/MyInput';

let editor = null;
export default function Edit() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState('')
  const [isShowModal, setIsShowModal] = useState(false)
  const [data, setData] = useState({})
  const params = useParams();

  useEffect(() => {
    editor = new E('#div1');
    editor.config.onchange = (newHtml) => {
      setContent(newHtml)
    }
    editor.create();
    if (params.id) {
      getArticleDetail()
    }
    return () => { //销毁编辑器
      editor.destroy();
    }
  }, [location.pathname])

  const getArticleDetail = () => {
    ArticleDetailApi({ id: params.id }).then(res => {
      if (res.errCode === 0) {
        const { content, title, subTitle } = res.data
        editor.txt.html(content);
        setData({
          ...data,
          title: res.data.title,
          subTitle: res.data.subTitle
        })
      }
    })
  }
  const callback = (res) => {
    setIsShowModal(false)
    if (res.errCode === 0) {
      message.success(res.message)
      setTimeout(() => {
        navigate('/listTable')
      }, 1500);
    }else{
      message.warn(res.message)
    }
  }
  const handleOk = () => {
    //方法一：自己收集form表单数据
    if (!data.title)
      return message.warn({
        content: '请输入标题',
        // duration: 10000,
        // style: { zIndex: 99999, color:'pink'}
      })
    if (params.id) { //修改
      ArticleUpdateApi({
        id: params.id,
        title: data.title,
        subTitle: data.subTitle,
        content
      }).then(res => {
        callback(res)
      })
    } else//新增
      ArticleAddApi({
        title: data.title,
        subTitle: data.subTitle,
        content
      }).then(res => {
        callback(res)
      })

    // 方法二，通过form表单收集
    // form
    //   .validateFields()
    //   .then((values) => {
    //     form.resetFields();
    //     ArticleAddApi({
    //       title: values.title,
    //       subTitle: values.subTitle,
    //       content
    //     }).then(res => {
    //       if (res.errCode === 0) {
    //         console.log(res)
    //         message.success(res.message)
    //       } else {
    //         message.error(res.message)
    //       }
    //     })
    //   }).catch(() => false);
  }
  const onInputChange = (name, value) => {
    console.log(name, value)
    setData({
      ...data,
      [name]: value
    })
  }
  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={params.id ? () => window.history.back() : null}
        title="文章编辑"
        subTitle={`当前日期：${moment(new Date()).format('YYYY-MM-DD')}`}
        extra={<Button key="1" type="primary" onClick={() => setIsShowModal(true)}>提交文章</Button>}
      >
      </PageHeader>
      <div id='div1'>

      </div>
      <Modal
        maskClosable={false}
        zIndex={99999}
        title="请输入文章标题"
        visible={isShowModal}
        onOk={handleOk}
        onCancel={() => setIsShowModal(false)}
        okText='提交'
        cancelText='取消'>
        <Form
          // form={form}
          labelCol={{
            span: 3,
          }}
          wrapperCol={{
            span: 21,
          }}
          autoComplete="off"
          // initialValues={{}}
        >
          <Form.Item
            label="标题"
            rules={[
              {
                required: true,
                message: '请输入标题',
              },
            ]}
          >
            <MyInput name='title' value={data.title} onBlur={onInputChange} />
          </Form.Item>
          <Form.Item
            label="副标题"
            rules={[
              {
                message: '请输入副标题',
              },
            ]}
          >
            {/** 用antd的Input 需要提供value 和 onChange 属性*/}
            {/* <Input value={data.subTitle} onChange={(e) => onInputChange('subTitle', e.target.value)} /> */}
            <MyInput name='subTitle' value={data.subTitle} onBlur={onInputChange} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
