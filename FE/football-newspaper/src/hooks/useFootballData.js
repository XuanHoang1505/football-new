import { useQuery } from "@tanstack/react-query";
import { FootballService } from "../services/site/FootballService";

export const useStandings = (leagueId, season) => {
  return useQuery({
    queryKey: ["standings", leagueId, season], // cache key
    queryFn: () => FootballService.getStandings(leagueId, season),
    enabled: !!leagueId, // chỉ chạy khi có leagueId
    staleTime: 1000 * 60 * 5, // cache 5 phút
  });
};

export const useMatches = (leagueId, season) => {
  return useQuery({
    queryKey: ["matches", leagueId, season],
    queryFn: () => FootballService.getMatches(leagueId, season),
    enabled: !!leagueId,
    staleTime: 1000 * 60 * 1, // cache 1 phút
  });
};

export const useTopScorers = (leagueId, season) =>
  useQuery({
    queryKey: ["topScorers", leagueId, season],
    queryFn: () => FootballService.getTopScorers(leagueId, season),
    enabled: !!leagueId && !!season, // chỉ chạy khi có đủ tham số
    staleTime: 1000 * 60 * 5,
  });
