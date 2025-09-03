import { Helmet } from "react-helmet-async";

import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
function WatchHistory() {
  const readingHistory = [
    {
      id: 1,
      title: "Đội trưởng U23 Việt Nam chấn thương, phải rời sân để cấp cứu",
      description:
        "HLV Kim Sang Sik cho biết sẽ cảm thấy lo lắng khi Khuất Văn Khang gặp chấn thương trong chiến thắng của Thể Công Viettel trước Công an TP.HCM.",
      image:
        "https://cdn-img.thethao247.vn/resize_784x500/storage/files/tranvutung/2025/08/23/23h30-29-68a9063729597.jpg",
      link: "/news/u23-vn-chan-thuong",
      time: "2025-08-23 07:20",
    },
    {
      id: 2,
      title: "Việt kiều Ba Lan lập tức ghi điểm với HLV Kim Sang Sik",
      description:
        "Tiền vệ Việt kiều Damian Vũ Thành An ghi bàn cho Viettel đúng ngày HLV Kim Sang Sik dự khán.",
      image:
        "https://cdn-img.thethao247.vn/resize_784x500/storage/files/huynguyen/2025/08/23/ipiccy_image-67-68a8cdd9e3a6e.jpg",
      link: "/news/viet-kieu-ghi-diem",
      time: "2025-08-23 07:30",
    },
    {
      id: 3,
      title:
        "Giá vàng hôm nay sáng 23/8: Tăng mạnh nhờ kỳ vọng FED giảm lãi suất",
      description:
        "Giá vàng hôm nay sáng 23/8/2025 tính đến 7h35: Giá vàng thế giới tăng mạnh nhờ kỳ vọng FED giảm lãi suất.",
      image:
        "https://cdn-img.thethao247.vn/resize_784x500/storage/files/haibui/2025/08/23/z6656421796553_2b8a229e28abdd1083b71d47e2fe3711-68862a271df85-6896fdd2509eb-68a90dcaa0350.jpg",
      link: "/news/gia-vang-hom-nay",
      time: "2025-08-23 07:35",
    },
    {
      id: 4,
      title: "Lịch thi đấu LCK 2025 LMHT mới nhất",
      description:
        "Cập nhật lịch thi đấu LCK 2025 mới nhất: Rounds 3-5 chính thức khởi tranh từ ngày 23/7.",
      image:
        "https://cdn-img.thethao247.vn/resize_784x500/storage/files/haibui/2025/07/15/chrome_z1utwzkml0-6875bb33d0cad.png",
      link: "/news/lich-thi-dau-lck-2025",
      time: "2025-08-23 07:40",
    },
  ];
  return (
    <>
      <Helmet>
        <title>Tin đã xem</title>
      </Helmet>
      <Container fluid className="p-0 mt-1">
        <div
          style={{
            color: "#244892",
            fontSize: "20px",
            borderBottom: "1px solid #ccc",
          }}
        >
          <h3 className="fw-bold mb-3">Tin đã xem</h3>
        </div>

        <div className="d-flex flex-column mt-3">
          {readingHistory.map((item) => (
            <div
              className="d-flex mb-3 pb-3 border-bottom"
              key={item.id}
              style={{ gap: "15px" }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="d-none d-lg-block"
                style={{ width: "196px", height: "125px", objectFit: "cover" }}
              />

              <img
                src={item.image}
                alt={item.title}
                className="d-block d-lg-none"
                style={{ width: "125px", height: "80px", objectFit: "cover" }}
              />
              <div>
                <Link
                  to={item.link}
                  className="fw-bold text-dark h5 d-block mb-1"
                >
                  {item.title}
                </Link>
                <p
                  className="mb-1 text-muted d-none d-md-block"
                  style={{ fontSize: "14px" }}
                >
                  {item.description.length > 120
                    ? item.description.slice(0, 120) + "..."
                    : item.description}
                </p>
                <small className="text-secondary d-none d-md-block">
                  {item.time}
                </small>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}

export default WatchHistory;
