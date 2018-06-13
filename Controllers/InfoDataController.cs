using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Globalization;
using System.Threading;

namespace LIEC_Website.Controllers
{
    [Route("api/[controller]")]
    public class InfoDataController : Controller
    {
        private static IHostingEnvironment _hostingEnvironment;

        private static IEnumerable<InfoLiecViewModel> _info;
        private static string[] _tags = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private static string[] _sources = new[]
        {
            "Arrêt sur images", "RTL", "Le Figaro", "Libération", "Le Monde", "La Tribune", "Dauphiné Libéré", "Le Parisien"
        };

        //violet, blue, green, yellow, orange, red
        private static string[] _lightThemes = new[]
        {
             "#bf80cf", "#6faaed", "#8dd6b4", "#ffe347", "#fa9a46", "#f26257"
        };

        //violet, blue, green, yellow, orange, red
        private static string[] __normalThemes = new[]
        {
             "#9e6dab", "#5a8dcc", "#79c7a4", "#fad13e", "#ed8e3b", "#d9483b"
        };

        //violet, blue, green, yellow, orange, red
        private static string[] _darkThemes = new[]
        {
             "#865e91", "#4575b5", "#6bb592", "#edbd45", "#d9873f", "#cc4033"
        };

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
                Theme = (Theme)random.Next(0,6)
            });
        }

        [HttpGet("[action]")]
        public IEnumerable<InfoLiecViewModel> InfoLiec()
        {
            return _info.OrderByDescending(x => x.CreationDate);
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
                List<Theme> themes = new List<Theme>();
                foreach (var theme in searchVm.Themes)
                {
                    themes.Add(Enum.Parse<Theme>(theme));
                }
                response = response.Where(x => themes.Contains(x.Theme));
            }

            if (!string.IsNullOrWhiteSpace(searchVm.FreeSearchText))
                response = response.Where(x => x.Context.Contains(searchVm.FreeSearchText) || x.Text.Contains(searchVm.FreeSearchText));

            return Json(response.OrderByDescending(x => x.CreationDate));
        }

        public class InfoLiecViewModel
        {
            public string Title { get; set; }
            public string Context { get; set; }
            public string Text { get; set; }
            public string Image { get; set; }
            public string[] Sources { get; set; }
            public string[] Tags { get; set; }
            public string LightTheme { get; set; }
            public string NormalTheme { get; set; }
            public string DarkTheme { get; set; }
            public DateTime CreationDate { get; set; }
            public Theme Theme { get; set; }
        }

        public class SearchViewModel
        {
            public string FreeSearchText { get; set; }
            public string[] Tags { get; set; }
            public string Date { get; set; }
            public string[] Themes { get; set; }
        }

        public enum Theme
        {
            red,
            blue,
            green,
            yellow,
            orange,
            violet
        }

        public enum DateThreshold
        {
            week,
            month,
            tri,
            half,
            full,
        }
    }
}
