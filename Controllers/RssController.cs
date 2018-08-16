using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Globalization;
using System.Threading;
using System.ServiceModel.Syndication;
using System.Xml;

namespace LIEC_Website.Controllers
{
    [Route("api/[controller]")]
    public class RssController : Controller
    {
        private static IHostingEnvironment _hostingEnvironment;

        public RssController(IHostingEnvironment hostingEnvironment)
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("fr-FR");
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpGet("[action]")]
        public JsonResult Feed()
        {
            SyndicationFeed feed = new SyndicationFeed("L'instant en commun", "Ce feed RSS comporte les derniers instants en commun", new Uri("http://Feed/Alternate/Link"), "FeedID", DateTime.Now);
            // Add a custom attribute.
            XmlQualifiedName xqName = new XmlQualifiedName("CustomAttribute");
            feed.AttributeExtensions.Add(xqName, "Value");

            SyndicationPerson sp = new SyndicationPerson("nom@prenom.com", "Nom Prenom", "http://nom/prenom");
            feed.Authors.Add(sp);

            SyndicationCategory category = new SyndicationCategory("FeedCategory", "CategoryScheme", "CategoryLabel");
            feed.Categories.Add(category);

            feed.Contributors.Add(new SyndicationPerson("prenom@nom.com", "Prenom Nom", "http://prenom/nom"));
            feed.Copyright = new TextSyndicationContent("Copyright 2007");
            feed.Description = new TextSyndicationContent("This is a sample feed");

            // Add a custom element.
            XmlDocument doc = new XmlDocument();
            XmlElement feedElement = doc.CreateElement("CustomElement");
            feedElement.InnerText = "Some text";
            feed.ElementExtensions.Add(feedElement);

            feed.Generator = "Sample Code";
            feed.Id = "FeedID";
            feed.ImageUrl = new Uri("http://server/image.jpg");

            TextSyndicationContent textContent = new TextSyndicationContent("Some text content");
            SyndicationItem item = new SyndicationItem("Item Title", textContent, new Uri("http://server/items"), "ItemID", DateTime.Now);

            List<SyndicationItem> items = new List<SyndicationItem>();
            items.Add(item);
            feed.Items = items;

            feed.Language = "en-us";
            feed.LastUpdatedTime = DateTime.Now;

            SyndicationLink link = new SyndicationLink(new Uri("http://server/link"), "alternate", "Link Title", "text/html", 1000);
            feed.Links.Add(link);            

            using (var sw = new StringWriter())
            {
                using (var rssWriter = XmlWriter.Create(sw))
                {
                    //XmlWriter atomWriter = XmlWriter.Create("atom.xml");
                    //Atom10FeedFormatter atomFormatter = new Atom10FeedFormatter(feed);
                    //atomFormatter.WriteTo(atomWriter);
                    //atomWriter.Close();
                    
                    Rss20FeedFormatter rssFormatter = new Rss20FeedFormatter(feed);
                    rssFormatter.WriteTo(rssWriter);
                    rssWriter.Close();

                }
                return Json(sw.ToString());
            }
        }
    }
}
