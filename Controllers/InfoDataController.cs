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
using MongoDB.Bson;
using System.Diagnostics;
using Microsoft.Extensions.Logging;

namespace LIEC_Website.Controllers
{
    [Route("api/[controller]")]
    public class InfoDataController : Controller
    {
        private static IHostingEnvironment _hostingEnvironment;

        private static IEnumerable<InfoLiecViewModel> _info;

        private static List<string> _imageSources = new List<string>();

        private static ILogger<InfoDataController> _logger;

        public InfoDataController(IHostingEnvironment hostingEnvironment, ILogger<InfoDataController> logger)
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("fr-FR");
            _hostingEnvironment = hostingEnvironment;
            _logger = logger;

            // Get all visual paths
            var rootpath = $"{hostingEnvironment.WebRootPath}/static/";
            DirectoryInfo d = new DirectoryInfo(rootpath);
            FileInfo[] Files = d.GetFiles("*.png");
            foreach (FileInfo file in Files)
            {
                _imageSources.Add($"static/{file.Name}");
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
                CreationDate = DateTime.Now.AddDays(-random.Next(0, 100)).ToShortDateString(),
                Theme = ((Themes)random.Next(0, 6)).ToString()
            });
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<InfoLiecViewModel>> InfoLiec()
        {
            Stopwatch stopwatch = Stopwatch.StartNew();

            var contents = await MongoDbContext.Content_GetAll();
            var infos = ContentModelEnumerableToInfoLiecViewmodelEnumerable(contents);

            stopwatch.Stop();
            Console.WriteLine(stopwatch.ElapsedMilliseconds);
            return infos;
        }

        [HttpPost("[action]")]
        public async Task<StatusCodeResult> GenerateInfoLiec()
        {
            await CreateRandomData();
            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<JsonResult> CreateContent([FromBody] InfoLiecViewModel vm)
        {
            var imagePath = Path.Combine(_hostingEnvironment.WebRootPath, "static/Images");
            var content = InfoLiecViewmodelToContentModel(vm);
            var dir = new DirectoryInfo(imagePath);

            // Tags and Sources to lower
            for (int i = 0; i < content.Tags.Length; i++)
            {
                content.Tags[i] = content.Tags[i].ToLower();
            }

            if (!dir.Exists)
            {
                dir.Create();
            }

            // Copy and delete temp image file
            var cleanPath = content.ImagePath.Remove(0,1);
            var tempFilePath = Path.Combine(_hostingEnvironment.WebRootPath, cleanPath);
            FileInfo imageFile = new FileInfo(tempFilePath);
            var newFilePath = Path.Combine(dir.FullName, imageFile.Name);
            imageFile.CopyTo(newFilePath);
            content.ImagePath = newFilePath.Remove(0, _hostingEnvironment.WebRootPath.Length);
            imageFile.Delete();

            try
            {
                await MongoDbContext.Content_Create(content);
            }
            catch (Exception e)
            {
                return Json(BadRequest(e));
            }
            return Json(Ok());
        }

        [HttpPost("[action]")]
        public async Task<JsonResult> UploadImage()
        {
            try
            {
                _logger.LogInformation($"InfoController > UploadImage : Start.");
                var uploadList = new List<ImageViewModel>();
                var uploadPath = Path.Combine(_hostingEnvironment.WebRootPath, "static/Upload");
                DirectoryInfo dir = new DirectoryInfo(uploadPath);

                if (!dir.Exists)
                {
                    dir.Create();
                    _logger.LogInformation($"InfoController > UploadImage : Does directory {dir.FullName} exists : {dir.Exists}.");
                }

                var files = Request.Form.Files;
                var filename = Guid.NewGuid().ToString();
                foreach (var file in files)
                {
                    _logger.LogInformation($"InfoController > UploadImage : File length {file.Length}.");
                    if (file.Length > 0)
                    {
                        var extension = Path.GetExtension(file.FileName);
                        var filePath = Path.Combine(uploadPath, $"{filename}{extension}");
                        _logger.LogInformation($"InfoController > UploadImage : File path {filePath}.");

                        uploadList.Add(new ImageViewModel
                        {
                            Name = filename,
                            Url = filePath.Remove(0, _hostingEnvironment.WebRootPath.Length)
                        });

                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(fileStream);
                            _logger.LogInformation($"InfoController > UploadImage : Create file to {filePath}.");
                        }
                    }
                }

                return Json(uploadList);
            }
            catch (Exception e)
            {
                _logger.LogError($"InfoController > An exception occured : {e}");
                HttpContext.Response.StatusCode = 400;
                return Json(e);
            }
        }

        [HttpPost("[action]")]
        public async Task<JsonResult> Search([FromBody] SearchViewModel searchVm)
        {
            Stopwatch stopwatch = Stopwatch.StartNew();

            var contents = await MongoDbContext.Content_GetAll();
            var infos = ContentModelEnumerableToInfoLiecViewmodelEnumerable(contents);
            var response = infos;

            if (searchVm?.Date == null && searchVm?.FreeSearchText == null && searchVm?.Tags == null && searchVm?.Themes == null)
            {
                return Json(response.OrderByDescending(x => x.CreationDate));
            }
            DateThreshold parsedDateThreshold;
            if (Enum.TryParse(searchVm.Date, out parsedDateThreshold))
            {
                DateTime date = DateTime.Now;
                switch (parsedDateThreshold)
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
                response = response.Where(x => DateTime.Parse(x.CreationDate) > date);
            }

            if (searchVm.Tags.Where(x => !string.IsNullOrWhiteSpace(x)).Count() > 0)
            {
                List<string> tags = new List<string>();
                foreach (var tag in searchVm.Tags)
                {
                    var temp = tag.Replace(" ", "");
                    tags.Add(temp.ToLower());
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
                response = response.Where(x => themes.Contains(Enum.Parse<Themes>(x.Theme)));
            }

            if (!string.IsNullOrWhiteSpace(searchVm.FreeSearchText))
                response = response.Where(x => x.Context.Contains(searchVm.FreeSearchText) || x.Text.Contains(searchVm.FreeSearchText));

            stopwatch.Stop();
            Console.WriteLine(stopwatch.ElapsedMilliseconds);
            return Json(response.OrderByDescending(x => x.CreationDate));
        }

        public InfoLiecViewModel ContentModelToInfoLiecViewmodel(ContentModel c)
        {
            var info = new InfoLiecViewModel
            {
                Context = c.Context,
                DarkTheme = c.GetTheme().DarkColorCode,
                CreationDate = c.CreationDate.ToShortDateString(),
                LightTheme = c.GetTheme().LightColorCode,
                NormalTheme = c.GetTheme().NormalColorCode,
                Sources = c.Sources,
                Tags = c.Tags,
                Theme = c.Theme.ToString(),
                Title = c.Title,
                Text = c.Text,
                Image = c.ImagePath,
                Creator = c.Creator
            };
            return info;
        }

        public ContentModel InfoLiecViewmodelToContentModel(InfoLiecViewModel c)
        {
            var content = new ContentModel
            {
                Context = c.Context,
                CreationDate = DateTime.Parse(c.CreationDate),
                Sources = c.Sources,
                Tags = c.Tags,
                Theme = Enum.Parse<Themes>(c.Theme),
                Title = c.Title,
                Text = c.Text,
                ImagePath = c.Image,
                Creator = c.Creator
            };
            return content;
        }

        public IEnumerable<InfoLiecViewModel> ContentModelEnumerableToInfoLiecViewmodelEnumerable(IEnumerable<ContentModel> contentModels)
        {
            var vmList = new List<InfoLiecViewModel>();
            foreach (var c in contentModels)
            {
                var info = ContentModelToInfoLiecViewmodel(c);
                vmList.Add(info);
            }
            return vmList;
        }

        public async Task CreateRandomData()
        {
            foreach (var info in _info)
            {
                // System.IO.FileStream fS = new System.IO.FileStream(Path.Combine(_hostingEnvironment.WebRootPath, info.Image), System.IO.FileMode.Open, System.IO.FileAccess.Read);
                // byte[] b = new byte[fS.Length];
                // fS.Read(b, 0, (int)fS.Length);
                // fS.Close();
                var content = new ContentModel()
                {
                    Title = info.Title,
                    Context = info.Context,
                    Sources = info.Sources,
                    CreationDate = DateTime.Parse(info.CreationDate),
                    ModificationDate = DateTime.Parse(info.CreationDate),
                    Creator = "Blust",
                    Media = Media.image,
                    Tags = info.Tags,
                    Theme = Enum.Parse<Themes>(info.Theme),
                    ImagePath = info.Image,
                    Text = info.Text
                };

                await MongoDbContext.Content_Create(content);
            }
        }
    }
}
