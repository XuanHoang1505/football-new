import logo from '../../../assets/site/images/logo_footer.png'
import styles from './AppFooter.module.scss';

const AppFooter = () => {
    return (
        <div className={styles.container}>
            <div className={styles.cl1}>
                <img src={logo}/>
            </div>
        </div>
    )
}

export default AppFooter;