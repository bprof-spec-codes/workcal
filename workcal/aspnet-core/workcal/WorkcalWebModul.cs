using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Modularity;

namespace workcal
{
  
        [DependsOn(typeof(workcalModule))]
        public class WorkcalWebModul : AbpModule
        {
            public override void ConfigureServices(ServiceConfigurationContext context)
            {
                Configure<AbpAspNetCoreMvcOptions>(options => {
                    options.ConventionalControllers
                .Create(typeof(workcalModule).Assembly);
                });
            }
        }

}
