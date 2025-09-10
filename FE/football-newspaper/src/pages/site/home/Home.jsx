import { Link, NavLink } from "react-router-dom";
import Sidebar from "../../../components/site/appSidebar/Sidebar";
import styles from "./Home.module.scss";
import AppRank from "../../../components/site/appRank/AppRank";
import AppMatches from "../../../components/site/appMatches/AppMatches";

import { clubMenu } from "../../../data/MenuData";
import { Figure } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
const Home = () => {
  const articles = [
    {
      id: 1,
      title: "AFC đánh giá sức mạnh của U23 Việt Nam trước Yemen",
      summary:
        "Liên đoàn bóng đá châu Á (AFC) đã đưa ra nhận định về trận đấu giữa U23 Việt Nam và U23 Yemen tại vòng loại U23 châu Á 2026.",
      category: "U23 Châu Á",
      image:
        "https://cdn-img.thethao247.vn/storage/files/hungtm/2025/09/09/u23vn-68bfb20eadf7a.jpg",
      publishedAt: "2025-09-09T08:00:00",
      author: "Thể Thao 247",
    },
    {
      id: 2,
      title: "Argentina trao số 10 cho sao trẻ",
      summary:
        "Đội tuyển Argentina đã quyết định trao chiếc áo số 10 huyền thoại cho một tài năng trẻ trong trận giao hữu gần đây.",
      category: "World Cup 2026",
      image:
        "https://cdn-img.thethao247.vn/resize_778x468/storage/files/ngotuan2334/2025/09/09/messi-thiago-almada-argentina-68bfad0cd6d82.jpg",
      publishedAt: "2025-09-09T07:45:00",
      author: "Nguyễn Minh",
    },
    {
      id: 3,
      title: "U23 Việt Nam vs U23 Yemen: Hiên ngang đi tiếp",
      summary:
        "U23 Việt Nam thi đấu quả cảm và giành vé đi tiếp sau trận hòa đầy kịch tính trước U23 Yemen.",
      category: "Bóng đá Việt Nam",
      image:
        "https://cdn-img.thethao247.vn/resize_778x468/storage/files/huynguyen/2025/09/08/480691585_1856264348509765_7462440968525766404_n-1-68be5d52abb85.jpg",
      publishedAt: "2025-09-08T22:30:00",
      author: "Thể Thao 247",
    },
    {
      id: 4,
      title: "Xác nhận: HLV đầu tiên tại Ngoại hạng Anh bị sa thải",
      summary:
        "Chỉ sau vài vòng đấu, một HLV đã chính thức bị sa thải do chuỗi thành tích bết bát.",
      category: "Ngoại hạng Anh",
      image:
        "https://cdn-img.thethao247.vn/resize_778x468/storage/files/hungtm/2025/09/09/nha-68bf64b51df12.jpg",
      publishedAt: "2025-09-08T21:00:00",
      author: "Lê Văn",
    },
    {
      id: 5,
      title: "Trực tiếp U23 Singapore vs U23 Bangladesh",
      summary:
        "Trận đấu vòng loại U23 châu Á 2026 đang diễn ra căng thẳng giữa U23 Singapore và U23 Bangladesh.",
      category: "U23 Châu Á",
      image: "https://fakeimg.pl/600x400/?text=SGP+vs+BAN",
      publishedAt: "2025-09-09T16:30:00",
      author: "Live Team",
    },
    {
      id: 6,
      title: "Mbappé ủng hộ Zidane dẫn dắt đội bóng không ở châu Âu",
      summary:
        "Kylian Mbappé bất ngờ bày tỏ mong muốn thấy Zidane thử sức ở một CLB ngoài lục địa già.",
      category: "Bóng đá Quốc tế",
      image: "https://fakeimg.pl/600x400/?text=Mbappe+Zidane",
      publishedAt: "2025-09-09T14:00:00",
      author: "Trần Hùng",
    },
    {
      id: 7,
      title: "Siêu tiền đạo MU gây thất vọng ở vòng loại World Cup",
      summary:
        "Một ngôi sao tấn công của Manchester United thi đấu mờ nhạt, khiến tuyển quốc gia khó khăn trong hành trình vòng loại.",
      category: "World Cup 2026",
      image: "https://fakeimg.pl/600x400/?text=MU+Striker",
      publishedAt: "2025-09-09T12:30:00",
      author: "Nguyễn Hoàng",
    },
    {
      id: 8,
      title: "Trực tiếp U23 Myanmar vs U23 Afghanistan",
      summary:
        "Trận đấu vòng loại U23 châu Á 2026 giữa U23 Myanmar và U23 Afghanistan đang diễn ra.",
      category: "U23 Châu Á",
      image: "https://fakeimg.pl/600x400/?text=MYA+vs+AFG",
      publishedAt: "2025-09-09T16:30:00",
      author: "Live Team",
    },
    {
      id: 9,
      title: "Mourinho bất ngờ được 1 CLB tại Ngoại hạng Anh nhắm đến",
      summary:
        "Người đặc biệt có khả năng trở lại Premier League khi một CLB đang tìm kiếm HLV trưởng.",
      category: "Ngoại hạng Anh",
      image: "https://fakeimg.pl/600x400/?text=Mourinho",
      publishedAt: "2025-09-09T11:00:00",
      author: "Thể Thao 247",
    },
    {
      id: 10,
      title: "Djokovic rút lui khỏi Davis Cup",
      summary:
        "Novak Djokovic quyết định không tham dự Davis Cup 2025 để tập trung cho ATP Finals.",
      category: "Quần vợt",
      image: "https://fakeimg.pl/600x400/?text=Djokovic",
      publishedAt: "2025-09-09T10:00:00",
      author: "Lê Minh",
    },
    {
      id: 11,
      title: "Lịch thi đấu LCK 2025 LMHT mới nhất",
      summary:
        "Ban tổ chức giải Liên Minh Huyền Thoại LCK 2025 đã công bố lịch thi đấu chính thức.",
      category: "Esports",
      image: "https://fakeimg.pl/600x400/?text=LCK+2025",
      publishedAt: "2025-09-08T19:00:00",
      author: "Esports Team",
    },
    {
      id: 12,
      title:
        "Skoda Epiq - SUV điện ngang cỡ Toyota Raize, chạy tối đa 425 km/sạc",
      summary:
        "Mẫu SUV điện Skoda Epiq chính thức ra mắt với phạm vi di chuyển ấn tượng.",
      category: "Công nghệ - Xe",
      image: "https://fakeimg.pl/600x400/?text=Skoda+Epiq",
      publishedAt: "2025-09-08T15:00:00",
      author: "Auto News",
    },
  ];

  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.publishDate) - new Date(a.publishDate)
  );

  const mainNews = sortedArticles[0];
  const subNews = sortedArticles.slice(1, 4);
  const sideNews = sortedArticles.slice(4);

  return (
    <>
      <Helmet>
        hể thao 247 - MXH Thể thao, Bóng đá mới nhất cập nhật 24/7
      </Helmet>
      <div className={styles.container}>
        <div className={styles.list_item}>
          {clubMenu.map((club, index) => (
            <NavLink
              className={styles.item}
              to={`/club/${club.url}`}
              key={index}
            >
              <img src={club.logo} alt={club.name} className={styles.logo} />
              <span className={styles.name}>{club.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="row">
          <div className="col-lg-2 d-none d-lg-block p-0">
            <Sidebar />
          </div>
          <div className="col-lg-10 col-12 p-0">
            <div className="row">
              <div className="col-lg-9 col-12 p-0 ps-lg-2 pe-lg-3">
                <Figure className="p-0 m-0">
                  <Figure.Image
                    alt={mainNews.title}
                    src={mainNews.image}
                    className="w-100 m-0 p-0"
                    title={mainNews.title}
                  />
                  <Figure.Caption>
                    <div className={styles.mainNewsContent}>
                      <Link
                        to={``}
                        title={mainNews.category}
                        className={styles.category}
                      >
                        {mainNews.category}
                      </Link>
                      <h2 className="mt-3">
                        <Link
                          to={``}
                          title={mainNews.title}
                          className={styles.title}
                        >
                          {mainNews.title}
                        </Link>
                      </h2>
                      <p className={styles.summary}>{mainNews.summary}</p>
                    </div>
                  </Figure.Caption>
                </Figure>
              </div>
              <div className="col-lg-3 col-md-6 col-12 mt-3 mt-lg-0 ps-sm-4 p-lg-0">
                <h3 className="text-danger text-uppercase border-bottom fw-bold mb-3">
                  Tin hot
                </h3>
                <ul className={styles.sideNews}>
                  {sideNews.map((news, index) => (
                    <li key={index}>
                      <NavLink to={`/news/${news.id}`} title={news.title}>
                        {news.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="row mt-3">
              {subNews.map((news, index) => (
                <div className="col-12 col-sm-4" key={index}>
                  <Figure>
                    <Figure.Image
                      alt={news.title}
                      src={news.image}
                      title={news.title}
                      className={`${styles.subNewsImage} m-0`}
                    />
                    <Figure.Caption>
                      <div className={styles.subNewsContent}>
                        <Link
                          to={``}
                          title={news.category}
                          className={styles.category}
                        >
                          {news.category}
                        </Link>
                        <h2>
                          <Link
                            to={``}
                            title={news.title}
                            className={styles.title}
                          >
                            {news.title}
                          </Link>
                        </h2>
                      </div>
                    </Figure.Caption>
                  </Figure>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 col-12 mb-3 mb-lg-0 ps-0">
            <AppMatches />
          </div>
          <div className="col-lg-4 col-12 p-0">
            <AppRank />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
