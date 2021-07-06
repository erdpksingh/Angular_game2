using Microsoft.VisualStudio.TestTools.UnitTesting;
using RA;
using System;
using System.Diagnostics;
using System.Linq;

namespace ComboRacerAPITest
{
    public abstract class TestBase
    {
        private static Random random = new Random((int)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalSeconds);
        protected const string API_KEY = "c746510a3ca2d711cacccaedd5a2e209c101af8b";
        protected const int GROUP_ID = 1337;
        protected string TESTUSER;
        protected int CONTENT_ID = 0;

        public TestContext TestContext { get; set; }

        public TestBase()
        {
            TESTUSER = CreateTestuser();
        }

        protected static string CreateTestuser()
        {
            string username = "test." + RandomString(8) + "@zeppelinstudio.net";
            Debug.WriteLine("User " + username);
            return username;
        }

        protected static string RandomString(int length)
        {
            const string chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            return new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
        }

        [TestInitialize]
        public void Setup()
        {
            Cleanup();
        }

        [TestCleanup]
        public void TearDown()
        {
            Cleanup();
        }

        protected string GetBaseUrl()
        {
            return TestContext.Properties["BASE_URL"].ToString();
        }

        protected void Cleanup()
        {
            new RestAssured()
                .Given()
                    .Name("Cleanup User")
                    .Header("Content-Type", "application/json")
                    .Header("Authorization", API_KEY)
                    .Query("group_id", GROUP_ID.ToString())
                .When()
                    .Get(TestContext.Properties["BASE_URL"].ToString() + "/testutil/cleanup/group")
                .Then()
                    .Debug()
                    .TestStatus("Status", x => x == 200)
                    .AssertAll();
        }
    }
}
