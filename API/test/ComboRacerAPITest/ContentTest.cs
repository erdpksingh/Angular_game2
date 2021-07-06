using Microsoft.VisualStudio.TestTools.UnitTesting;
using RA;

namespace ComboRacerAPITest
{
    [TestClass]
    public class ContentTest : TestBase
    {
        [TestMethod]
        public void TestContent0Token()
        {
            TestToken(0, "6vjAensx5DRr15JHzGzL8j8wJMhuTD60");
        }

        [TestMethod]
        public void TestContent1Token()
        {
            TestToken(1, "fl0JYXdICUTZOibkfwc7VP6mHU7kLMHp");
        }

        private void TestToken(int id, string token)
        {
            new RestAssured()
               .Given()
                   .Name("Get content ")
                   .Header("Content-Type", "application/json")
                   .Header("Authorization", API_KEY)
               .When()
                   .Get(GetBaseUrl() + "/content/" + id)
                   .Debug()
               .Then()
                   .Debug()
                   .TestStatus("Test status", x => x == 200)
                   .TestBody("Token", x => x.app_token == token)
                   .TestBody("Content ID", x => x.content_id == id)
                   .AssertAll();
        }
    }
}
