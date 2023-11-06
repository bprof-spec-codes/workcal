using Volo.Abp.AutoMapper;
using Volo.Abp.Modularity;

namespace workcal
{
    // ABP Module Configuration
    [DependsOn(typeof(AbpAutoMapperModule))]
    public class LabelModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            Configure<AbpAutoMapperOptions>(options =>
            {
                options.AddMaps<LabelModule>();
            });
        }
    }
}
