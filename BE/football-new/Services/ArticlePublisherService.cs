using footballnew.Enums;
using footballnew.Repositories.Interfaces;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace footballnew.Services
{
    public class ArticlePublisherService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;

        public ArticlePublisherService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _serviceProvider.CreateScope();
                var repo = scope.ServiceProvider.GetRequiredService<IArticleRepository>();

                var articlesToPublish = await repo.GetArticlesToPublishAsync();

                foreach (var article in articlesToPublish)
                {
                    article.Status = ArticleStatus.PUBLISHED;
                    article.DatePublished = DateTime.UtcNow;
                    await repo.UpdateAsync(article);
                }

                await Task.Delay(TimeSpan.FromMinutes(60), stoppingToken);
            }
        }
    }
}
