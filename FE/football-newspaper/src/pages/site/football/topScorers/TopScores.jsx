import { useParams } from "react-router-dom";
import { leagueTranslations } from "../../../../data/VnTransLeague";
import { Helmet } from "react-helmet-async";
import LeagueTopScorers from "../../../../components/site/leagueTopScorers/LeagueTopScorers";

function TopScores() {
  const { leagueCode } = useParams();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Helmet>
        <title>
          {`Vua phá lưới ${
            leagueTranslations[leagueCode] || leagueCode
          } ${currentYear}/${currentYear + 1} | Thể Thao 247`}
        </title>
      </Helmet>
      <div className="mt-3">
        <span className="fs-4 me-2 fw-bold text-uppercase text-danger">
          {leagueTranslations[leagueCode] || leagueCode} - Vua phá lưới
        </span>
        <i className="bi bi-chevron-right fs-4 text-primary fw-bold"></i>
        <LeagueTopScorers leagueCode={leagueCode} />
      </div>
    </>
  );
}

export default TopScores;
