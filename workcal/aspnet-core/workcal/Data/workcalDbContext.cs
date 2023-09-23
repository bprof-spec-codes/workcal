using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.OpenIddict.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.TenantManagement.EntityFrameworkCore;
using workcal.Entities;

namespace workcal.Data;

public class workcalDbContext : AbpDbContext<workcalDbContext>
{
    public workcalDbContext(DbContextOptions<workcalDbContext> options)
        : base(options)
    {
    }

    public DbSet<Entities.Event> Events { get; set; }  // DbSet for Event entity
    public DbSet<Entities.Label> Labels { get; set; }  // DbSet for Label entity


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        /* Include modules to your migration db context */

        builder.ConfigurePermissionManagement();
        builder.ConfigureSettingManagement();
        builder.ConfigureAuditLogging();
        builder.ConfigureIdentity();
        builder.ConfigureOpenIddict();
        builder.ConfigureFeatureManagement();
        builder.ConfigureTenantManagement();

        /* Configure your own entities here */

        builder.Entity<Event>()
              .HasOne(e => e.Label)
              .WithMany(l => l.Events)
              .HasForeignKey(e => e.LabelId);

    }

}
