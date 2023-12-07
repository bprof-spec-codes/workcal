
    using Autofac.Core;
    using Microsoft.AspNetCore.Identity;
    using Volo.Abp.AutoMapper;
    using Volo.Abp.Modularity;

    namespace workcal
    {
        // ABP Module Configuration
        [DependsOn(typeof(AbpAutoMapperModule))]
        public class PictureModul : AbpModule
        {
            public override void ConfigureServices(ServiceConfigurationContext context)
            {
                Configure<AbpAutoMapperOptions>(options =>
                {
                    options.AddMaps<PictureModul>();
                });


            }
        }
    }


