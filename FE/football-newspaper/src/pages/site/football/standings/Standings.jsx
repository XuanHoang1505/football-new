import { useParams } from "react-router-dom";

import { leagueTranslations } from "../../../../data/VnTransLeague";
import { Helmet } from "react-helmet-async";
import LeagueStandings from "../../../../components/site/leagueStandings/LeagueStandings";

function Standings() {
  const { leagueCode } = useParams();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Helmet>
        <title>
          {`Bảng xếp hạng ${
            leagueTranslations[leagueCode] || leagueCode
          } ${currentYear}/${currentYear + 1} | Thể Thao 247`}
        </title>
      </Helmet>
      <div className="mt-3">
        <span className="fs-4 me-2 fw-bold text-uppercase text-danger">
          Bảng xếp hạng {leagueTranslations[leagueCode] || leagueCode}
        </span>
        <i className="bi bi-chevron-right fs-4 text-primary fw-bold"></i>
        <LeagueStandings leagueCode={leagueCode} />
      </div>
    </>
  );
}

export default Standings;
