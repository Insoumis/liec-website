﻿using System;
using log4net;
using Microsoft.AspNetCore.Mvc;

namespace log4Net
{
    public static class Log4NetExtensions
    {
        public static void MySpecialError(this ILog log, ControllerContext c, string message, Exception exception)
        {
            string actionName = c.RouteData.Values["action"].ToString();
            string controllerName = c.RouteData.Values["controller"].ToString();

            log.Error("");
        }
    }
}
