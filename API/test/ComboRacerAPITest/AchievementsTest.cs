using Microsoft.VisualStudio.TestTools.UnitTesting;
using RA;

namespace ComboRacerAPITest
{
    [TestClass]
    public class AchievementsTest : TestBase
    {
        [TestMethod]
        public void TestPutAchievement()
        {
            new RestAssured()
                .Given()
                    .Name("Update Achievement")
                    .Header("Content-Type", "application/json")
                    .Header("Authorization", API_KEY)
                    .Query("group_id", GROUP_ID.ToString())
                    .Query("content_id", CONTENT_ID.ToString())
                    .Query("user_id", TESTUSER)
                    .Body(new
                    {
                        achievement_id = 1,
                        unlocked = true,
                        timestamp = "2019-05-08T10:28:30.102Z"
                    })
                .When()
                    .Put(GetBaseUrl() + "/achievements")
                .Then()
                    .Debug()
                    .TestStatus("test status", x => x == 200)
                    .TestBody("test response", x => x.achievement_id == 1)
                    .AssertAll();


        }

        [TestMethod]
        public void TestMissingUserIdThrowsError()
        {
            new RestAssured()
                .Given()
                    .Name("Get user statistics")
                    .Header("Content-Type", "application/json")
                    .Header("Authorization", API_KEY)
                    .Query("group_id", GROUP_ID.ToString())
                    .Query("content_id", CONTENT_ID.ToString())
                    .Body(new
                    {
                        achievement_id = 1,
                        unlocked = true,
                        timestamp = "2019-05-08T10:28:30.102Z"
                    })
                .When()
                    .Put(GetBaseUrl() + "/achievements")
                .Then()
                    .Debug()
                    .TestStatus("Test status", x => x == 400)
                    .TestBody("Test error", x => x.error == "No user_id specified.")
                    .AssertAll();
        }

        [TestMethod]
        public void TestMissingAchievementIdThrowsError()
        {
            new RestAssured()
                .Given()
                    .Name("Get user statistics")
                    .Header("Content-Type", "application/json")
                    .Header("Authorization", API_KEY)
                    .Query("group_id", GROUP_ID.ToString())
                    .Query("content_id", CONTENT_ID.ToString())
                    .Query("user_id", TESTUSER)
                    .Body(new
                    {
                        unlocked = true,
                        timestamp = "2019-05-08T10:28:30.102Z"
                    })
                .When()
                    .Put(GetBaseUrl() + "/achievements")
                .Then()
                    .Debug()
                    .TestStatus("Test status", x => x == 400)
                    .TestBody("Test error", x => x.error == "No achievement_id specified.")
                    .AssertAll();
        }

        [TestMethod]
        public void TestUserStatisticsFailWithoutContentId()
        {
            new RestAssured()
                .Given()
                    .Name("Get user statistics")
                    .Header("Content-Type", "application/json")
                    .Header("Authorization", API_KEY)
                    .Query("group_id", GROUP_ID.ToString())
                    .Query("user_id", TESTUSER)
                    .Body(new
                    {
                        achievement_id = 1,
                        unlocked = true,
                        timestamp = "2019-05-08T10:28:30.102Z"
                    })
                .When()
                    .Put(GetBaseUrl() + "/achievements")
                .Then()
                    .Debug()
                    .TestStatus("Test status", x => x == 400)
                    .TestBody("Test error", x => x.error == "No content_id specified.")
                    .AssertAll();
        }

        [TestMethod]
        public void TestMissingApiKeyReturnsUnauthorized()
        {
            new RestAssured()
                .Given()
                    .Name("Update Achievement")
                    .Header("Content-Type", "application/json")
                    .Query("group_id", GROUP_ID.ToString())
                    .Query("content_id", CONTENT_ID.ToString())
                    .Query("user_id", TESTUSER)
                    .Body(new
                    {
                        achievement_id = 1,
                        unlocked = true,
                        timestamp = "2019-05-08T10:28:30.102Z"
                    })
                .When()
                    .Put(GetBaseUrl() + "/achievements")
                .Then()
                    .Debug()
                    .TestStatus("Test status", x => x == 401)
                    .AssertAll();
        }
    }
}
