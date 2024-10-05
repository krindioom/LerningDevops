using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        [HttpGet("values")]
        public async Task<ActionResult> GetValuesAsync()
        {
            var values = new 
            { 
                Value1 = 2,
                Value2 = 3,
                Value3 = 4,
                Value4 = 5,
                Value5 = 6,
                Value6 = 7,
                Value7 = 8,
                Value8 = 9,
            };
            return Ok(values);
        }
    }
}
