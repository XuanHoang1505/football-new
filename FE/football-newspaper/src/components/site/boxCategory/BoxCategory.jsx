import { Link } from "react-router-dom";
import styles from "./BoxCategory.module.scss";
function BoxCategory({ articles, name, path }) {
  const truncate = (text, max) =>
    text?.length > max ? text.slice(0, max) + "..." : text;

  return (
    <div>
      <div
        className="d-flex justify-content-between"
        style={{ borderBottom: "1px solid #000" }}
      >
        <div className={styles.caption}>
          <Link
            className="text-light text-uppercase ps-2"
            style={{ fontSize: "15px" }}
            to={path}
          >
            {name}
          </Link>
        </div>
        <Link to={path} className={styles.viewAll}>
          Xem tất cả &gt;
        </Link>
      </div>
      {articles.length === 0 ? (
        <p className="d-flex justify-content-center p-5">Không có bài báo nào</p>
      ) : (
        <>
          <div className="row mb-3 mt-3">
            <div className="col-6">
              <img
                src={articles[0]?.imageUrl}
                alt={articles[0]?.title}
                className="img-fluid w-100"
              />
            </div>
            <div className="col-6 d-flex flex-column justify-align-align-content-between">
              <h5 className="fw-bold">{truncate(articles[0]?.title, 80)}</h5>
              <p>{truncate(articles[0]?.summary, 40)}</p>
            </div>
          </div>

          <div className="row">
            {articles.slice(1, 3).map((article) => (
              <div className="col-6 mb-3" key={article.id}>
                <img
                  src={article?.imageUrl}
                  alt={article?.title}
                  className="img-fluid w-100 mb-2"
                />
                <h6 className="fw-bold">{truncate(article?.title, 60)}</h6>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default BoxCategory;
