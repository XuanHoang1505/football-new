import { useState, useEffect } from 'react';
import styles from './AppLogin.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library, icon } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);
const AppLogin = ({ initialTab = 'login' ,handleClose }) => {

  const [activeTab, setActiveTab] = useState(initialTab);


  // Cập nhật khi prop thay đổi
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleClickLogin = () => {
    setActiveTab('login');
  };

  
  return (
    <div className={styles.container}>

      <div onClick={handleClose} className={styles.close} >
        <FontAwesomeIcon icon="xmark" />
      </div>
      
      {/* theme */}
      <div className={styles.theme}>
        <div 
          style={{width:'300px',textAlign:'center'}} 
          onClick={handleClickLogin}
        >
          <h4
            style={{
              borderBottom: activeTab === 'login' ? '1px solid #254892' : '1px solid transparent',
              color: activeTab === 'login' ? '#254892' : '#888888'
            }}
          >
            Đăng nhập
          </h4>
        </div>

        <div 
          style={{width:'300px',textAlign:'center'}} 
          onClick={() => setActiveTab('register')}
        >
          <h4
            style={{
              borderBottom: activeTab === 'register' ? '1px solid #254892' : '1px solid transparent',
              color: activeTab === 'register' ? '#254892' : '#888888' 
            }}
          >
            Đăng ký
          </h4>
        </div>
      </div>

      {/* thân */}
      {activeTab === 'login' && (
        <div className={styles.than}>
          <p>Email</p>
          <input placeholder='Email' type='email'/>
          <p>Mật khẩu</p>
          <input placeholder='Nhập mật khẩu' type='password'/>
          <a href='#'>Quên mật khẩu ?</a>
          <button className={styles.nut}>ĐĂNG NHẬP</button>
        </div>
      )}

      {activeTab === 'register' && (
        <div className={styles.than}>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <p>Email</p>
            <input placeholder='Email' type='email'/>
            <p>Họ và tên</p>
            <input placeholder='Nhập họ và tên' type='text'/>
            <p>Ngày sinh</p>
            <input type='date'/>
            <p>Điện thoại</p>
            <input placeholder='Điện thoại'/>
            <p>Mật khẩu</p>
            <input placeholder='Nhập mật khẩu' type='password'/>
            <p>Xác nhận mật khẩu</p>
            <input placeholder='Nhập lại mật khẩu' type='password'/>
          </div>
          <button className={styles.nut}>ĐĂNG KÝ TÀI KHOẢN</button>
        </div>
      )}
    </div>
  );
};

export default AppLogin;
