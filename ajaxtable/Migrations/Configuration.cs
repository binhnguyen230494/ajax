namespace ajaxtable.Migrations
{
    using ajaxtable.model;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<ajaxtable.BinhDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(ajaxtable.BinhDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method
            //  to avoid creating duplicate seed data.
            context.Binhs.AddOrUpdate(
                new Binh { Name = "Phu", Salary = 30000, CreatedDate = DateTime.Now, Status = true },
                new Binh { Name = "Binh", Salary = 40000, CreatedDate = DateTime.Now, Status = true },
                new Binh { Name = "Thanh", Salary = 50000, CreatedDate = DateTime.Now, Status = true },
                new Binh { Name = "La", Salary = 60000, CreatedDate = DateTime.Now, Status = true },
                new Binh { Name = "Hanh", Salary = 70000, CreatedDate = DateTime.Now, Status = true },
                new Binh { Name = "Quyen", Salary = 80000, CreatedDate = DateTime.Now, Status = false },
                new Binh { Name = "Quy", Salary = 90000, CreatedDate = DateTime.Now, Status = true },
                new Binh { Name = "Diem", Salary = 20000, CreatedDate = DateTime.Now, Status = false },
                new Binh { Name = "Mao", Salary = 10000, CreatedDate = DateTime.Now, Status = true },
                new Binh { Name = "Nau", Salary = 550000, CreatedDate = DateTime.Now, Status = false }
                );
            context.SaveChanges();
        }
    }
}
