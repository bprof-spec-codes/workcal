//using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
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
using workcal.Migrations;

namespace workcal.Data;


public class workcalDbContext : AbpDbContext<workcalDbContext>
{
    public workcalDbContext(DbContextOptions<workcalDbContext> options)
        : base(options)
    {
    }

    public DbSet<Event> Events { get; set; } 
    public DbSet<Entities.Label> Labels { get; set; }

    public DbSet<Picture> Pictures { get; set; }


    public DbSet<Entities.EventsUsers> EventUsers { get; set; }  


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






     /*   builder.Entity<Event>().HasMany(e=> e.Labels)
            .WithOne(o=>o.Event)
            .HasForeignKey(p => p.EventId)
            .OnDelete(DeleteBehavior.NoAction);
     */
        /* ObjectExtensionManager.Instance
              .AddOrUpdate<IdentityUser>(options => { options.AddOrUpdateProperty<ICollection<EventsUsers>>("Events"); });*/


        /* builder.Entity<EventsUsers>()
                     .HasOne(ur => ur.Event)
                     .WithMany(u => u.EventUsers)
                     .HasForeignKey(ur => ur.UserId)
                     .OnDelete(DeleteBehavior.NoAction);*/

        /* builder.Entity<Event>().HasMany(x => x.EventUsers)
            .WithOne(o=> o.Event)
            .HasForeignKey(p => p.EventId)
            .OnDelete(DeleteBehavior.NoAction);*/



        builder.Entity<Event>(b =>
        {
            b.ConfigureByConvention();

            b.HasMany(e => e.Labels).WithOne(o => o.Event).HasForeignKey(x => x.EventId).IsRequired().OnDelete(DeleteBehavior.Cascade); ;
            b.HasMany(x => x.EventUsers).WithOne().HasForeignKey(x => x.EventId).IsRequired().OnDelete(DeleteBehavior.Cascade); ;

        });



            builder.Entity<Entities.EventsUsers>(b => {
              b.ToTable("EventsUsers"); b.ConfigureByConvention();
             b.HasOne<Event>().WithMany(x => x.EventUsers).HasForeignKey("EventId").OnDelete(DeleteBehavior.Cascade);
           // b.HasOne<IdenityUsers>().WithMany().HasForeignKey("UserId").OnDelete(DeleteBehavior.NoAction);
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(x => x.UserId).IsRequired().OnDelete(DeleteBehavior.Cascade);

            b.HasKey(x => new { x.EventId, x.UserId });
              b.HasIndex(x => new { x.EventId, x.UserId });



        });

        builder.Entity<Picture>(b =>
        {
            b.ConfigureByConvention();
            b.HasOne(p => p.User)
                .WithMany() // If the IdentityUser entity doesn't have a navigation property for Pictures, leave this empty
                .HasForeignKey(p => p.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
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
