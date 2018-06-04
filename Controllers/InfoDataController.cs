using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace LIEC_Website.Controllers
{
    [Route("api/[controller]")]
    public class InfoDataController : Controller
    {
        private static string[] _tags = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private static string[] _sources = new[]
        {
            "Arrêt sur images", "RTL", "Le Figaro", "Libération", "Le Monde", "La Tribune", "Dauphiné Libéré", "Le Parisien"
        };

        private static string[] _imageSources = new[]
        {
            "https://pbs.twimg.com/media/DdQaOTfWsAIv3yK.png"
        };

        [HttpGet("[action]")]
        public IEnumerable<InfoLiecData> InfoLiec()
        {
            var rng = new Random();
            var test  =  Enumerable.Range(1, 80).Select(index => new InfoLiecData
            { 
                Title = "Le Bonus Cultura, un modèle ?",
                Context = "Le pass culture, co-financé par les #GAFAM, est-il une bonne solution pour promouvoir la culture chez les jeunes ?",
                Image = _imageSources.First(),
                Sources  = _sources.OrderBy(x => x.IndexOf(x) % 2 == (int)(new Random(2).NextDouble()%2)).Take(2).ToList().ToArray(),
                Tags = _tags.OrderBy(x => x.IndexOf(x) % 2 == (int)(new Random(2).NextDouble()%2)).Take(3).ToList().ToArray(),
            });
            return test;
        }

        public class InfoLiecData
        {
            public string Title { get; set; }
            public string Context { get; set; }
            public string Image { get; set; }
            public string[] Sources { get; set; }
            public string[] Tags { get; set; }
        }
    }
}
