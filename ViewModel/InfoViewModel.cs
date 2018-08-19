﻿using System;
using static LIEC_Website.Helper.Utility;

namespace LIEC_Website.ViewModel
{
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
        public Themes Theme { get; set; }
    }
}
