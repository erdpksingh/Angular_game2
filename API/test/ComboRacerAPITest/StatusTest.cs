using Microsoft.VisualStudio.TestTools.UnitTesting;
using RA;

namespace ComboRacerAPITest
{
    [TestClass]
    public class StatusTest : TestBase
    {
        [TestMethod]
        public void TestStatus()
        {
            new RestAssured()
                .Given()
                    .Name("Get Status")
                    .Header("Content-Type", "application/json")
                    .Header("Authorization", API_KEY)
                .When()
                    .Get(GetBaseUrl() + "/status")
                .Then()
                    .Debug()
                    .TestStatus("Test status", x => x == 200)
                    .AssertAll();
        }

        [TestMethod]
        public void TestMissingApiKeyReturnsUnauthorized()
        {
            new RestAssured()
                .Given()
                    .Name("Get Status")
                    .Header("Content-Type", "application/json")
                .When()
                    .Get(GetBaseUrl() + "/status")
                .Then()
                    .Debug()
                    .TestStatus("Test status", x => x == 401)
                    .AssertAll();
        }
    }
}
