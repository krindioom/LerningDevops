using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        [HttpGet("get-values")]
        public async Task<ActionResult> GetValuesAsync()
        {
            string[] values = { 
                "a1",
                "a2",
                "a3"
            };
            
            return Ok(values);
        }
    }
}
