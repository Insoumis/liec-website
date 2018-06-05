using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace LIEC_Website.Controllers
{
    [Route("api/[controller]")]
    public class InfoDataController : Controller
    {        
        private static IHostingEnvironment _hostingEnvironment;
        private static string[] _tags = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private static string[] _sources = new[]
        {
            "Arrêt sur images", "RTL", "Le Figaro", "Libération", "Le Monde", "La Tribune", "Dauphiné Libéré", "Le Parisien"
        };

        private static string[] _themes = new[]
        {
             "#6bb592", "#fa9a46", "#6faaed", "#ffe347", "#f26257", "#bf80cf"
        };

        private static List<string> _imageSources = new List<string>();

        public InfoDataController(IHostingEnvironment hostingEnvironment){
            _hostingEnvironment = hostingEnvironment;

            // Get all visual paths
            var rootpath = $"{hostingEnvironment.WebRootPath}\\static\\";
            DirectoryInfo d = new DirectoryInfo(rootpath);
            FileInfo[] Files = d.GetFiles("*.png"); 
            foreach (FileInfo file in Files)
            {
                _imageSources.Add($"static\\{file.Name}");
            }
        }

        [HttpGet("[action]")]
        public IEnumerable<InfoLiecData> InfoLiec()
        {
            var info  =  Enumerable.Range(1, 80).Select(index => new InfoLiecData
            { 
                Title = "Le Bonus Cultura, un modèle ?",
                Context = "Le pass culture, co-financé par les #GAFAM, est-il une bonne solution pour promouvoir la culture chez les jeunes ?",
                Image = _imageSources.OrderBy(x => Guid.NewGuid()).Take(1).ToList().First(),
                Sources  = _sources.OrderBy(x => Guid.NewGuid()).Take(2).ToList().ToArray(),
                Tags = _tags.OrderBy(x => Guid.NewGuid()).Take(3).ToList().ToArray(),
                Theme = _themes.OrderBy(x => Guid.NewGuid()).Take(1).ToList().First(),
            });
            return info;
        }

        public class InfoLiecData
        {
            public string Title { get; set; }
            public string Context { get; set; }
            public string Image { get; set; }
            public string[] Sources { get; set; }
            public string[] Tags { get; set; }
            public string Theme { get; set; }
        }
    }
}
