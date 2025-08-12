import logo from '../../../assets/site/images/logo.png'
import styles from './AppHeader.module.scss';
import iconQc from '../../../assets/site/images/icons/logo_qc.png'
import iconButChi from '../../../assets/site/images/icons/icon_but_chi.png'
import iconRegister from '../../../assets/site/images/icons/icon_Register.png'
import iconLogin from '../../../assets/site/images/icons/icon_login.png'

const AppHeader = () => {
  return (
    <div className={styles.container}>
        <img className={styles.logo} src={logo}/>
        <div className={styles.right}>
            <a href='#'>
              <div className={styles.item}>
                <img className={styles.iconQc} src={iconQc}/>
                Quảng cáo
              </div>
            </a>

            <a href='#'>
              <div className={styles.item}>
                <img className={styles.iconQc} src={iconButChi}/>
                Gửi bài
              </div>
            </a>

            <a href='#'>
              <div className={styles.item2}>
                <img className={styles.iconQc} src={iconRegister}/>
                Đăng ký
              </div>
            </a>

            <a href='#'>
              <div className={styles.item2}>
                <img className={styles.iconQc} src={iconLogin}/>
                Đăng nhập
              </div>
            </a>

        </div>
    </div>
  );
};

export default AppHeader;