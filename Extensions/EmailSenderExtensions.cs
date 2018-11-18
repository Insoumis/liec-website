using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using LIEC_Website.Services;

namespace LIEC_Website.Services
{
    public static class EmailSenderExtensions
    {
        public static Task SendEmailConfirmationAsync(this IEmailSender emailSender, string email, string link)
        {
            return emailSender.SendEmailAsync(email, "Merci de confirmer ton email",
                $"Merci de t'�tre inscrit sur Les graines de l'info. Pour confirmer ton compte, cliques sur le lien suivant : <a href='{HtmlEncoder.Default.Encode(link)}'>activer son compte</a>");
        }
    }
}
