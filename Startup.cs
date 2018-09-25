using LIEC_Website.Data;
using LIEC_Website.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LIEC_Website
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();

            // Add MongoDB authentification service
            services.AddIdentityWithMongoStores(Configuration.GetConnectionString("MongoDB") + "/users")
                .AddDefaultTokenProviders();

            // Add application services.
            services.AddTransient<IEmailSender, EmailSender>();

            // Add external authentification (google, facebook...)
            //services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            //    .AddCookie(o => o.LoginPath = new PathString("/login"))
            //    .AddFacebook(o =>
            //    {
            //        o.AppId = Configuration["facebook:appid"];
            //        o.AppSecret = Configuration["facebook:appsecret"];
            //    })
            //    .AddGoogle(o =>
            //    {
            //        o.ClientId = "YOUR_CLIENT_ID";
            //        o.ClientSecret = "YOUR_CLIENT_SECRET";
            //        //o.CallbackPath = new PathString("/signin-google");
            //        //o.SignInScheme = "ExternalCookie";
            //    })
            //    .AddTwitter(o =>
            //    {
            //        o.ConsumerKey = "YOUR_CLIENT_ID";
            //        o.ConsumerSecret = "YOUR_CLIENT_SECRET";
            //        //o.CallbackPath = new PathString("/signin-google");
            //        //o.SignInScheme = "ExternalCookie";
            //    });

            // Use OpenId to authenticate with Discord
            // https://kevinchalet.com/2016/07/13/creating-your-own-openid-connect-server-with-asos-introduction/
            // https://discordapp.com/developers/docs/topics/oauth2

            // Configure MongoDB
            MongoDbContext.Configure(Configuration.GetConnectionString("MongoDB"));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();
            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}
