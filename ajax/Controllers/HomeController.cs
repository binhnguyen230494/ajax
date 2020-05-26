
using ajaxtable;
using ajaxtable.model;
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
        public JsonResult LoadData(string name, string status, int page,int pagesize = 2)
        {
            IQueryable<Binh> model = _context.Binhs;
            if (!string.IsNullOrEmpty(name))
                model = model.Where(x => x.Name.Contains(name));
            if (!string.IsNullOrEmpty(status))
            {
                var statusBool = bool.Parse(status);
                model = model.Where(x => x.Status == statusBool);
            }
            int totalRow = model.Count();
            model = model.OrderBy(x=>x.ID).Skip((page - 1 )* pagesize).Take(pagesize);
           
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
            Binh binh = bi.Deserialize<Binh>(model);
            var entity = _context.Binhs.Find(binh.ID);
            entity.Salary = binh.Salary;
            return Json(new
            {
                Status = true
            });
        }
        [HttpPost]
        public JsonResult Save(string strmodel)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            Binh employee = serializer.Deserialize<Binh>(strmodel);
            bool status = false;
            string message = string.Empty;
            //add new employee if id = 0
            if (employee.ID == 0)
            {
                employee.CreatedDate = DateTime.Now;
                _context.Binhs.Add(employee);
                try
                {
                    _context.SaveChanges();
                    status = true;
                }
                catch (Exception ex)
                {
                    status = false;
                    message = ex.Message;
                }
            }
            else
            {
                //update existing DB
                //save db
                var entity = _context.Binhs.Find(employee.ID);
                entity.Salary = employee.Salary;
                entity.Name = employee.Name;
                entity.Status = employee.Status;

                try
                {
                    _context.SaveChanges();
                    status = true;
                }
                catch (Exception ex)
                {
                    status = false;
                    message = ex.Message;
                }

            }

            return Json(new
            {
                status = status,
                message = message
            });
        }
        [HttpGet]
        public JsonResult GetDetail(int id)
        {
            var employee = _context.Binhs.Find(id);
            return Json(new
            {
                data = employee,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult Delete(int id)
        {
            var entity = _context.Binhs.Find(id);
            _context.Binhs.Remove(entity);
            try
            {
                _context.SaveChanges();
                return Json(new
                {
                    status = true
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    status = false,
                    message = ex.Message
                });
            }

        }


    }
}