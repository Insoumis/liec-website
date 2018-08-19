using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using static LIEC_Website.Helper.Utility;

namespace LIEC_Website.Model
{
    [BsonIgnoreExtraElements]
    public class ContentModel
    {
        [BsonId]
        public virtual ObjectId Id { get; set; }
        public string Title { get; set; }
        public Media Media { get; set; }
        public ObjectId ImageId { get; set; }
        [BsonIgnore]
        public Byte[] ImageBytes { get; set; }
        public ObjectId Video { get; set; }
        [BsonIgnore]
        public Byte[]VideoBytes { get; set; }
        public string Context { get; set; }
        public string Text { get; set; }
        public string[] Sources { get; set; }
        public string[] Tags { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModificationDate { get; set; }
        public string Creator { get; set; }
        public Themes Theme { get; set; }

        public Theme GetTheme()
        {
            Theme theme = null;
            switch (Theme)
            {
                case Themes.violet:
                    theme = new Theme
                    {
                        Name = "Paix & International",
                        ColorName = "violet",
                        LightColorCode = "#bf80cf",
                        NormalColorCode = "#9e6dab",
                        DarkColorCode = "#865e91"
                    };
                    break;
                case Themes.blue:
                    theme = new Theme
                    {
                        Name = "Union Européenne",
                        ColorName = "blue",
                        LightColorCode = "#6faaed",
                        NormalColorCode = "#5a8dcc",
                        DarkColorCode = "#4575b5"
                    };
                    break;
                case Themes.green:
                    theme = new Theme
                    {
                        Name = "Urgence Ecologique",
                        ColorName = "green",
                        LightColorCode = "#8dd6b4",
                        NormalColorCode = "#79c7a4",
                        DarkColorCode = "#6bb592"
                    };
                    break;
                case Themes.yellow:
                    theme = new Theme
                    {
                        Name = "Urgence Démocratique",
                        ColorName = "yellow",
                        LightColorCode = "#ffe347",
                        NormalColorCode = "#fad13e",
                        DarkColorCode = "#edbd45"
                    };
                    break;
                case Themes.orange:
                    theme = new Theme
                    {
                        Name = "Progrès Humain",
                        ColorName = "orange",
                        LightColorCode = "#fa9a46",
                        NormalColorCode = "#ed8e3b",
                        DarkColorCode = "#d9873f"
                    };
                    break;
                case Themes.red:
                    theme = new Theme
                    {
                        Name = "Urgence Sociale",
                        ColorName = "red",
                        LightColorCode = "#f26257",
                        NormalColorCode = "#d9483b",
                        DarkColorCode = "#cc4033"
                    };
                    break;
            }
            return theme;
        }
    }
}
