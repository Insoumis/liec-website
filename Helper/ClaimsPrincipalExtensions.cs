namespace System.Security.Claims
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetUserId(this ClaimsPrincipal user)
        {
            Claim claim = user.FindFirst(ClaimTypes.NameIdentifier);
            string userId = claim?.Value;
            return userId;
        }
    }
}
