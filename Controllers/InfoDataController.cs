using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Globalization;
using System.Threading;
using LIEC_Website.ViewModel;
using static LIEC_Website.Helper.Utility;
using LIEC_Website.Data;
using LIEC_Website.Model;

namespace LIEC_Website.Controllers
{
    [Route("api/[controller]")]
    public class InfoDataController : Controller
    {
        private static IHostingEnvironment _hostingEnvironment;

        private static IEnumerable<InfoLiecViewModel> _info;

        private static List<string> _imageSources = new List<string>();

        public InfoDataController(IHostingEnvironment hostingEnvironment)
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("fr-FR");
            _hostingEnvironment = hostingEnvironment;

            // Get all visual paths
            var rootpath = $"{hostingEnvironment.WebRootPath}/static/";
            DirectoryInfo d = new DirectoryInfo(rootpath);
            FileInfo[] Files = d.GetFiles("*.png");
            foreach (FileInfo file in Files)
            {
                _imageSources.Add($"static\\{file.Name}");
            }

            var random = new Random();
            _info = Enumerable.Range(1, 80).Select(index => new InfoLiecViewModel
            {
                Title = "Le Bonus Cultura, un modèle ?",
                Context = "Le pass culture, co-financé par les #GAFAM, est-il une bonne solution pour promouvoir la culture chez les jeunes ?",
                Image = _imageSources.OrderBy(x => Guid.NewGuid()).Take(1).ToList().First(),
                Sources = _sources.OrderBy(x => Guid.NewGuid()).Take(2).ToList().ToArray(),
                Tags = _tags.OrderBy(x => Guid.NewGuid()).Take(3).ToList().ToArray(),
                NormalTheme = __normalThemes.OrderBy(x => Guid.NewGuid()).Take(1).ToList().First(),
                DarkTheme = _darkThemes.OrderBy(x => Guid.NewGuid()).Take(1).ToList().First(),
                LightTheme = _lightThemes.OrderBy(x => Guid.NewGuid()).Take(1).ToList().First(),
                CreationDate = DateTime.Now.AddDays(-random.Next(0, 100)),
                Theme = (Themes)random.Next(0, 6)
            });
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<InfoLiecViewModel>> InfoLiec()
        {
            //await CreateRandomData();
            var contents = await MongoDbContext.Content_GetAll();
            return ContentModelToInfoLiecViewmodel(contents);
        }

        public IEnumerable<InfoLiecViewModel> ContentModelToInfoLiecViewmodel(IEnumerable<ContentModel> contentModels)
        {
            var vmList = new List<InfoLiecViewModel>();
            foreach(var c in contentModels)
            {
                var info = new InfoLiecViewModel
                {
                    Context = c.Context,
                    DarkTheme = c.GetTheme().DarkColorCode,
                    CreationDate = c.CreationDate,
                    LightTheme = c.GetTheme().LightColorCode,
                    NormalTheme = c.GetTheme().NormalColorCode,
                    Sources = c.Sources,
                    Tags = c.Tags,
                    Theme = c.Theme,
                    Title = c.Title,
                    Text = c.Text,
                    Image = "data:image/png;base64," + Convert.ToBase64String(c.ImageBytes)
                };

                vmList.Add(info);
            }
            return vmList;
        }

        public async Task CreateRandomData()
        {
            foreach (var info in _info)
            {
                System.IO.FileStream fS = new System.IO.FileStream(Path.Combine(_hostingEnvironment.WebRootPath, info.Image), System.IO.FileMode.Open, System.IO.FileAccess.Read);
                byte[] b = new byte[fS.Length];
                fS.Read(b, 0, (int)fS.Length);
                fS.Close();
                var content = new ContentModel()
                {
                    Title = info.Title,
                    Context = info.Context,
                    Sources = info.Sources,
                    CreationDate = info.CreationDate,
                    ModificationDate = info.CreationDate,
                    Creator = "Blust",
                    Media = Media.image,
                    Tags = info.Tags,
                    Theme = info.Theme,
                    ImageBytes = b,
                    Text = info.Text
                };

                await MongoDbContext.Content_Create(content);
            }
        }

        [HttpPost("[action]")]
        public JsonResult Search([FromBody] SearchViewModel searchVm)
        {
            if (searchVm?.Date == null && searchVm?.FreeSearchText == null && searchVm?.Tags == null && searchVm?.Themes == null)
            {
                return Json(_info.OrderByDescending(x => x.CreationDate));
            }
            var response = _info;
            DateThreshold parsedDate;
            if (Enum.TryParse(searchVm.Date, out parsedDate))
            {
                DateTime date = DateTime.Now;
                switch (parsedDate)
                {
                    case (DateThreshold.week):
                        date = DateTime.Now.Add(new TimeSpan(-7, 0, 0, 0));
                        break;
                    case (DateThreshold.month):
                        date = DateTime.Now.Add(new TimeSpan(-30, 0, 0, 0));
                        break;
                    case (DateThreshold.tri):
                        date = DateTime.Now.Add(new TimeSpan(-91, 0, 0, 0));
                        break;
                    case (DateThreshold.half):
                        date = DateTime.Now.Add(new TimeSpan(-182, 0, 0, 0));
                        break;
                    case (DateThreshold.full):
                        date = DateTime.Now.Add(new TimeSpan(-365, 0, 0, 0));
                        break;
                    default:
                        break;
                }
                response = response.Where(x => x.CreationDate > date);
            }

            if (searchVm.Tags.Where(x => !string.IsNullOrWhiteSpace(x)).Count() > 0)
            {
                List<string> tags = new List<string>();
                foreach (var tag in searchVm.Tags)
                {
                    var temp = tag.Replace(" ", "");
                    tags.Add(temp[0].ToString().ToUpper() + temp.Substring(1).ToLower());
                }
                response = response.Where(x => x.Tags.Intersect(tags).Count() > 0);
            }

            if (searchVm.Themes.Count() > 0)
            {
                List<Themes> themes = new List<Themes>();
                foreach (var theme in searchVm.Themes)
                {
                    themes.Add(Enum.Parse<Themes>(theme));
                }
                response = response.Where(x => themes.Contains(x.Theme));
            }

            if (!string.IsNullOrWhiteSpace(searchVm.FreeSearchText))
                response = response.Where(x => x.Context.Contains(searchVm.FreeSearchText) || x.Text.Contains(searchVm.FreeSearchText));

            return Json(response.OrderByDescending(x => x.CreationDate));
        }              
    }
}
