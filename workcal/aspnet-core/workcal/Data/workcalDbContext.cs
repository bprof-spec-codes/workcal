//using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
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

    public DbSet<Event> Events { get; set; }  // DbSet for Event entity
    public DbSet<Entities.Label> Labels { get; set; }  // DbSet for Label entity

    public DbSet<EventsUsers> EventUsers { get; set; }  // DbSet for Label entity


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        /* Include modules to your migration db context */

        builder.ConfigurePermissionManagement();
        builder.ConfigureSettingManagement();
        builder.ConfigureAuditLogging();
        builder.ConfigureIdentity();


        //ObjectExtensionManager.Instance
        //    .MapEfCoreProperty<IdentityUser, string>(
        //    "SocialSecurityNumber", (
        //        entityBuilder, propertyBuilder
        //        ) => { propertyBuilder.HasMaxLength(32); }
        //        );
        builder.ConfigureOpenIddict();
        builder.ConfigureFeatureManagement();
        builder.ConfigureTenantManagement();

        /* Configure your own entities here */






        builder.Entity<Event>().HasMany(e=> e.Labels)
            .WithOne(o=>o.Event)
            .HasForeignKey(p => p.EventId)
            .OnDelete(DeleteBehavior.Cascade);

      /* ObjectExtensionManager.Instance
            .AddOrUpdate<IdentityUser>(options => { options.AddOrUpdateProperty<ICollection<EventsUsers>>("Events"); });*/


         /* builder.Entity<EventsUsers>()
                      .HasOne(ur => ur.Event)
                      .WithMany(u => u.EventUsers)
                      .HasForeignKey(ur => ur.UserId)
                      .OnDelete(DeleteBehavior.NoAction);*/

        builder.Entity<Event>().HasMany(x => x.EventUsers)
           .WithOne()
           .HasForeignKey(p => p.EventId)
           .OnDelete(DeleteBehavior.NoAction);




        builder.Entity<EventsUsers>(b => {
              b.ToTable("EventsUsers"); b.ConfigureByConvention();
            b.HasOne(x => x.Event).WithMany(x => x.EventUsers).HasForeignKey("EventId").OnDelete(DeleteBehavior.NoAction);
           // b.HasOne(x => x.User).WithMany().HasForeignKey("UserId").OnDelete(DeleteBehavior.NoAction); 
              b.HasKey(x => new { x.EventId, x.UserId });
              b.HasIndex(x => new { x.EventId, x.UserId });

            b.HasOne<IdentityUser>().WithMany().HasForeignKey(x => x.UserId).IsRequired();


        });

     /* builder.Entity<Event>(b => {
             b.ConfigureByConvention(); 
            ;//one-to-many relationship with Author table
           
            //many-to-many relationship with Category table => BookCategories
            b.HasMany(x=>x.EventUsers).WithOne().HasForeignKey(x=>x.EventId).IsRequired();
        
        });

        builder.Entity<EventsUsers>(b => {
            b.ToTable("EventsUsers"); b.ConfigureByConvention();
            //define composite key
            b.HasKey(x=>new{x.EventId,x.UserId});
            //many-to-many configuration
            b.HasOne<Event>().WithMany(x=>x.EventUsers).HasForeignKey(x=> x.EventId).IsRequired();
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(x=>x.UserId).IsRequired();
            b.HasIndex(x=>new{x.EventId,x.UserId });
        });
        */
        }






}
