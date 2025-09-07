namespace footballnew.Services.Interfaces
{
    public interface IApiFootballService
    {
        Task<object> GetTransfersByTeamAsync(int teamId);
        Task<object> GetTransfersByPlayerAsync(int playerId);
    }
}
