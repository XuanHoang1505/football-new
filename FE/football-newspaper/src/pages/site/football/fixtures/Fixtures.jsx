import { useParams } from "react-router-dom";

import { leagueTranslations } from "../../../../data/VnTransLeague";

import { Helmet } from "react-helmet-async";
import LeagueFixtures from "../../../../components/site/leagueFixtures/LeagueFixtures";

function Fixtures() {
  const currentYear = new Date().getFullYear();
  const { leagueCode } = useParams();

  return (
    <>
      <Helmet>
        <title>
          {`Lịch thi đấu ${
            leagueTranslations[leagueCode] || leagueCode
          } ${currentYear}/${currentYear + 1} | Thể Thao 247`}
        </title>
      </Helmet>

      <div className="mt-3">
        <span className="fs-4 me-2 fw-bold text-uppercase text-danger">
          Lịch thi đấu {leagueTranslations[leagueCode] || leagueCode} hôm nay
        </span>
        <i className="bi bi-chevron-right fs-4 text-primary fw-bold"></i>
        <LeagueFixtures leagueCode={leagueCode} />
      </div>
    </>
  );
}

export default Fixtures;
