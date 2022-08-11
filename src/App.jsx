import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Aside from './components/Aside';
import Bread from './components/Bread';

const App = () => (
  <Layout id='app'>
    <Header />
    <div className='container'>
      <Aside />
      <div className='container_box'>
        <Bread />
        <div className="container_content">
          <Outlet />
        </div>
      </div>
    </div>
    <footer>Respect | Copyright &copy; 2022 author WWJ</footer>
  </Layout>
);

export default App;