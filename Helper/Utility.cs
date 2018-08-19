namespace LIEC_Website.Helper
{
    public static class Utility
    {
        #region Constants

        #endregion

        #region Static fields

        public static string[] _tags = new[]
           {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        public static string[] _sources = new[]
        {
            "Arrêt sur images", "RTL", "Le Figaro", "Libération", "Le Monde", "La Tribune", "Dauphiné Libéré", "Le Parisien"
        };

        //violet, blue, green, yellow, orange, red
        public static string[] _lightThemes = new[]
        {
             "#bf80cf", "#6faaed", "#8dd6b4", "#ffe347", "#fa9a46", "#f26257"
        };

        //violet, blue, green, yellow, orange, red
        public static string[] __normalThemes = new[]
        {
             "#9e6dab", "#5a8dcc", "#79c7a4", "#fad13e", "#ed8e3b", "#d9483b"
        };

        //violet, blue, green, yellow, orange, red
        public static string[] _darkThemes = new[]
        {
             "#865e91", "#4575b5", "#6bb592", "#edbd45", "#d9873f", "#cc4033"
        };

        #endregion

        #region Enums

        public enum Themes
        {
            red,
            blue,
            green,
            yellow,
            orange,
            violet
        }

        public enum Media
        {
            image,
            video,
        }

        public enum DateThreshold
        {
            week,
            month,
            tri,
            half,
            full,
        }

        #endregion
    }
}
