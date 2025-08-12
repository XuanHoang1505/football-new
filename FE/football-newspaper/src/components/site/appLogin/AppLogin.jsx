import { useState } from 'react';
import styles from './AppLogin.module.scss';

const AppLogin = () => {
  const [activeTab, setActiveTab] = useState('login'); 

  return (
    <div className={styles.container}>

    {/* theme */}s
      <div className={styles.theme}>
        <div onClick={() => setActiveTab('login')}>
          <h4
            style={{
              borderBottom: activeTab === 'login' ? '1px solid #254892' : '1px solid transparent'
            }}
          >
            Đăng nhập
          </h4>
        </div>

        <div onClick={() => setActiveTab('register')}>
          <h4
            style={{
              borderBottom: activeTab === 'register' ? '1px solid #254892' : '1px solid transparent'
            }}
          >
            Đăng ký
          </h4>
        </div>
      </div>

      {/* thân */}
      <div>

      </div>

    </div>
  );
};

export default AppLogin;
