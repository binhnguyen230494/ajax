using ajaxtable.model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ajaxtable
{
    public class BinhDbContext: DbContext
    {
        public BinhDbContext() : base("BinhConnectionString")
        {

        }
        public DbSet<Binh> Binhs { get; set; }
    }
}
