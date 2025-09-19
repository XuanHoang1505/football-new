import {
  BsLightningFill,
  BsCameraVideo,
  BsCalendarEvent,
  BsTrophy,
  BsTable,
  BsBroadcast,
} from "react-icons/bs";
import { FaFutbol } from "react-icons/fa";

export const mainMenu = [
  { label: "Latest", path: "/latest", icon: <BsLightningFill /> },
  { label: "Video", path: "/video", icon: <BsCameraVideo /> },
  { label: "Livescore", path: "/livescore", icon: <FaFutbol /> },
  { label: "Lịch thi đấu", path: "/football/PL/", icon: <BsCalendarEvent /> },
  { label: "Kết quả", path: "/football/PL/results", icon: <BsTrophy /> },
  { label: "BXH", path: "/football/PL/standings", icon: <BsTable /> },
  { label: "Trực tiếp", path: "/truc-tiep", icon: <BsBroadcast /> },
];

export const leagueMenu = [
  {
    label: "V.League 1",
    path: "vleague/",
    slug: "vleague",
    icon: "https://mediares.thethao247.vn/res/image/data/xpaWkCiU-2iUIBqTc.png",
  },
  {
    label: "Cúp C1",
    path: "CL/",
    slug: "cup-c1",
    icon: "https://mediares.thethao247.vn/res/image/data/YaCIsrjD-ragmsdpt.png",
  },
  {
    label: "Ngoại hạng Anh",
    path: "PL/",
    slug: "ngoai-hang-anh",
    icon: "https://cdn-img.thethao247.vn/storage/files/hoan106/2023/10/11/prlogo2-1696993839.jpeg",
  },
  {
    label: "La Liga",
    path: "PD/",
    slug: "la-liga",
    icon: "https://mediares.thethao247.vn/res/image/data/8tslw3T1-baecXIX8.png",
  },
  {
    label: "Ligue 1",
    path: "FL1/",
    slug: "fl1",
    icon: "https://mediares.thethao247.vn/res/image/data/EeVwWyWI-Qih5KUIb.png",
  },
  {
    label: "Bundesliga",
    path: "BL1/",
    slug: "bundesliga",
    icon: "https://mediares.thethao247.vn/res/image/data/ddvweuSp-tG6tnjVM.png",
  },
  {
    label: "Serie A",
    path: "SA/",
    slug: "serie-a",
    icon: "https://mediares.thethao247.vn/res/image/data/pv8pwbmd-ULj8sFKt.png",
  },
  {
    label: "World Cup 2026",
    path: "WC/",
    slug: "wc",
    icon: "https://cdn-img.thethao247.vn/storage/files/SyNguyen/2024/03/21/65fc179521964.jpg",
  },
  {
    label: "C1 Châu Á",
    path: "afc-cl/",
    slug: "afc-cl",
    icon: "https://cdn-img.thethao247.vn/storage/files/SyNguyen/2024/03/21/65fc179521964.jpg",
  },
  {
    label: "Saudi Pro",
    path: "saudi-pro/",
    slug: "saudi-pro",
    icon: "https://mediares.thethao247.vn/res/image/data/ziaSnuU1-O2zulDZO.png",
  },
  {
    label: "Asian Cup",
    path: "asian-cup/",
    slug: "asian-cup",
    icon: "https://mediares.thethao247.vn/res/image/data/pEhdGO9j-fJY7yogh.png",
  },
  {
    label: "U23 Châu Á",
    path: "u23-chau-a/",
    slug: "u23-chau-a",
    icon: "https://mediares.thethao247.vn/res/image/data/GhHXu597-nDJ4YAff.png",
  },
  {
    label: "MLS",
    path: "MLS/",
    slug: "mls",
    icon: "https://mediares.thethao247.vn/res/image/data/UcfmORjD-SnDeBFHH.png",
  },
  {
    label: "Vô địch quốc gia nữ",
    path: "nu/",
    slug: "nu",
    icon: "https://mediares.thethao247.vn/res/image/data/Uywp4FjD-v9B9vL2k.png",
  },
];

export const clubMenu = [
  {
    id: 66,
    apiId: 33, // ID từ API-Football
    name: "Manchester United",
    logo: "https://mediares.thethao247.vn/res/image/data/nwSRlyWg-h2pPXz3k.png",
    url: "manchester-united/",
    code: "manchester-united",
  },
  {
    id: 64,
    apiId: 40,
    name: "Liverpool",
    logo: "https://mediares.thethao247.vn/res/image/data/Gr0cGteM-KCp4zq5F.png",
    url: "liverpool/",
    code: "liverpool",
  },
  {
    id: 57,
    apiId: 42,
    name: "Arsenal",
    logo: "https://mediares.thethao247.vn/res/image/data/pfchdCg5-vcNAdtF9.png",
    url: "arsenal/",
    code: "arsenal",
  },
  {
    id: 65,
    apiId: 50,
    name: "Manchester City",
    logo: "https://mediares.thethao247.vn/res/image/data/UXcqj7HG-lQuhqN8N.png",
    url: "manchester-city/",
    code: "manchester-city",
  },
  {
    id: 61,
    apiId: 49,
    name: "Chelsea",
    logo: "https://mediares.thethao247.vn/res/image/data/GMmvDEdM-IROrZEJb.png",
    url: "chelsea/",
    code: "chelsea",
  },
  {
    id: 81,
    apiId: 529,
    name: "Barcelona",
    logo: "https://mediares.thethao247.vn/res/image/data/8dhw5vxS-fcDVLdrL.png",
    url: "barcelona/",
    code: "barcelona",
  },
  {
    id: 86,
    apiId: 541,
    name: "Real Madrid",
    logo: "https://mediares.thethao247.vn/res/image/data/A7kHoxZA-fcDVLdrL.png",
    url: "real-madrid/",
    code: "real-madrid",
  },
];


export const leagueTabs = [
  { key: "fixtures", path: "", label: "LỊCH THI ĐẤU" },
  { key: "results", path: "results", label: "KẾT QUẢ" },
  { key: "standings", path: "standings", label: "BXH" },
  { key: "top-scorers", path: "top-scorers", label: "VUA PHÁ LƯỚI" },
  { key: "clubs", path: "clubs", label: "CLB" },
];

export const clubTabs = [
  { key: "summary", path: "", label: "TÓM TẮT" },
  { key: "fixtures", path: "fixtures", label: "LỊCH THI ĐẤU" },
  { key: "results", path: "results", label: "KẾT QUẢ" },
  { key: "transfers", path: "transfers", label: "CHUYỂN NHƯỢNG" },
  { key: "squad", path: "squad", label: "ĐỘI HÌNH" },
];
export const playerTabs = [
  { key: "recentMatches", path: "", label: "TRẬN GẦN ĐÂY" },
  { key: "career", path: "career", label: "SỰ NGHIỆP" },
  { key: "transfers", path: "transfers", label: "CHUYỂN NHƯỢNG" },
];

export const footerData = [
  {
    title: "Tiện ích bóng đá",
    links: [
      { name: "Lịch thi đấu bóng đá", url: "/football/PL/" },
      { name: "Kết quả bóng đá", url: "football/PL/results" },
      { name: "Nhận định bóng đá", url: "/" },
      { name: "Tỷ số bóng đá", url: "/" },
      { name: "Trực tiếp bóng đá", url: "/" },
      { name: "Chuyển nhượng bóng đá", url: "/category/chuyen-nhuong" },
      { name: "Video thể thao", url: "/" },
    ],
  },
  {
    title: "Giải đấu nổi bật",
    links: [
      { name: "Ngoại hạng Anh", url: "/football/PL/" },
      { name: "Cúp C1", url: "/football/CL" },
      { name: "La Liga", url: "/football/PD" },
      { name: "Serie A", url: "/football/SA" },
      { name: "Bundesliga", url: "/football/BL" },
      { name: "V League", url: "/" },
      { name: "World Cup", url: "/" },
      { name: "Euro", url: "/" },
      { name: "Asian Cup", url: "/" },
      { name: "Cúp C2", url: "/" },
      { name: "SEA Games", url: "/" },
      { name: "AFF Cup", url: "/" },
      { name: "Bóng đá Việt Nam", url: "/" },
    ],
  },
  {
    title: "Bảng xếp hạng bóng đá",
    links: [
      { name: "BXH Ngoại hạng Anh", url: "/" },
      { name: "BXH La Liga", url: "/" },
      { name: "BXH Ý", url: "/" },
      { name: "BXH Cúp C1", url: "/" },
      { name: "BXH Cúp C2", url: "/" },
      { name: "BXH Đức", url: "/" },
      { name: "BXH Pháp", url: "/" },
      { name: "BXH V League", url: "/" },
    ],
  },
  {
    title: "Kết quả bóng đá",
    links: [
      { name: "Kết quả Cúp C1", url: "/" },
      { name: "Kết quả Ngoại hạng Anh", url: "/" },
      { name: "Kết quả bóng đá Ý", url: "/" },
      { name: "Kết quả bóng đá Tây Ban Nha", url: "/" },
      { name: "Kết quả bóng đá Đức", url: "/" },
      { name: "Kết quả bóng đá Pháp", url: "/" },
      { name: "Kết quả Cúp C2", url: "/" },
    ],
    extra: {
      title: "Thể thao tổng hợp",
      links: [
        { name: "Bóng chuyền", url: "/" },
        { name: "Quần vợt", url: "/" },
        { name: "Esports", url: "/" },
        { name: "Xe cộ", url: "/" },
        { name: "Võ", url: "/" },
      ],
    },
  },
];
