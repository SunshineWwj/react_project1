import React, { useEffect, useState } from 'react'
import { Button, Form, message, Modal, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import '../less/means.less'
import { UserDataGetApi, UserDataUpdateApi } from '../request/api'
import MyInput from '../components/MyInput'
import { connect } from 'react-redux'

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

  if (!isJpgOrPng) {
    message.error('只能上传JPG/PNG文件!');
  }

  const isLt200KB = file.size / 1024 < 200;

  if (!isLt200KB) {
    message.error('图片必须小于200KB!');
  }

  return isJpgOrPng && isLt200KB;
};
function Means(props) {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    UserDataGetApi().then(res => {
      if (res.errCode === 0) {
        message.success(res.message)
        setData({
          username: res.data.username,
          password: res.data.password
        })

      } else message.warn(res.message)
    })
  }, [])

  const onInputChange = (name, value) => {
    setData({
      ...data,
      [name]: value
    })
  }

  const onSubmit = () => {
    if (!data.username || !data.password) {
      return message.warn('请输入用户名或密码');
    }
    UserDataUpdateApi({
      username: data.username,
      password: data.password
    }).then(res => {
      if (res.errCode === 0) {
        localStorage.clear();
        message.success(res.message, '请重新登录');
      } else message.warn(res.message)
    })
  }

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
      const res = info.file.response
      if (res.errCode === 0) {
        message.success(res.message);
        localStorage.setItem('avatar', res.data.filePath)
        props.forceUpdate()
      } else message.error(res.message)
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}>图片上传</div>
    </div>
  );

  const handlePreview = (file) => {
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj);
    // }
    setPreviewVisible(true);
  };

  return (
    <div className='means'>
      <Form
        autoComplete="off"
        style={{ width: '400px' }}>

        <Form.Item label="修改用户名：">
          <MyInput placeholder='请输入新用户名' name="username" value={data.username}
            onBlur={onInputChange} />
        </Form.Item>

        <Form.Item label="修 改 密 码：">
          <MyInput placeholder='请输入新密码' name="password" value={data.password}
            onBlur={onInputChange} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" style={{ float: 'right' }} onClick={onSubmit}>提交</Button>
        </Form.Item>
      </Form>
      <p>点击修改头像</p>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
        action="/api/upload"
        beforeUpload={beforeUpload}
        onChange={handleChange}
        headers={{ 'cms-token': localStorage.getItem('cms-token') }}
        onPreview={handlePreview}>
        {!imageUrl && uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}>
        <img
          src={imageUrl}
          alt="avatar"
          style={{
            width: '100%',
          }}
        />
      </Modal>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    forceUpdate: () => {
      dispatch({ type: 'forceUpdate' })
    }
  }
}

export default connect(null, mapDispatchToProps)(Means)