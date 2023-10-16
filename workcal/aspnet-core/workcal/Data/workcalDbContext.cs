using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.ObjectExtending;
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

    public DbSet<Entities.EventsUsers> EventUsers { get; set; }  // DbSet for Label entity


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

        builder.Entity<Event>().HasMany(e=> e.Labels)
            .WithOne(o=>o.Event)
            .HasForeignKey(p => p.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        ObjectExtensionManager.Instance
            .AddOrUpdate<IdentityUser>(options => { options.AddOrUpdateProperty<ICollection<EventsUsers>>("Events"); });


        builder.Entity<EventsUsers>()
                    .HasOne(ur => ur.Event)
                    .WithMany(u => u.EventUsers)
                    .HasForeignKey(ur => ur.UserId);
        

        builder.Entity<EventsUsers>(b => {
            b.ToTable("EventsUsers"); b.ConfigureByConvention();
            b.HasOne(x => x.User).WithMany().HasForeignKey("Id"); b.HasOne(x => x.Event).WithMany(x => x.EventUsers).HasForeignKey("Id");
        });
    }

}
