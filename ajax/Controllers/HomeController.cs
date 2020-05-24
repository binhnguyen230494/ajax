using ajax.Models;
using ajaxtable;
using Microsoft.Ajax.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace ajax.Controllers
{
    public class HomeController : Controller
    {
        private BinhDbContext _context;
        public HomeController()
        {
            _context = new BinhDbContext();
        }

        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public JsonResult LoadData(int page,int pagesize = 2)
        {
            var model = _context.Binhs.OrderByDescending(x=>x.CreatedDate).Skip((page - 1 )* pagesize).Take(pagesize);
            int totalRow = _context.Binhs.Count();
            return Json(new
            {
                data = model,
                total= totalRow,
                Status = true
            },JsonRequestBehavior.AllowGet);

        }
        [HttpPost]
        public JsonResult Update(string model)
        {
            JavaScriptSerializer bi = new JavaScriptSerializer();
            Binh bin = bi.Deserialize<Binh>(model);
            var entity = _context.Binhs.Find(bin.ID);
            //entity.Salary = bin.Salary;
            return Json(new
            {
                Status = true
            });
        }
        
    }
}