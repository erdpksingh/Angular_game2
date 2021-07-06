using Microsoft.VisualStudio.TestTools.UnitTesting;
using RA;

namespace ComboRacerAPITest
{
    [TestClass]
    public class UserStatsTest : TestBase
    {
        [TestMethod]
        public void TestUserStats()
        {
            new RestAssured()
                .Given()
                    .Name("Post new score")
                    .Header("Content-Type", "application/json")
                    .Header("Authorization", API_KEY)
                    .Query("group_id", GROUP_ID.ToString())
                    .Query("content_id", CONTENT_ID.ToString())
                    .Query("user_id", TESTUSER)
                    .Body(new
                    {
                        score = 1337,
                        best_combo = 42
                    })
                .When()
                    .Post(GetBaseUrl() + "/highscore")
                .Then()
                    .Debug()
                    .TestStatus("Status", x => x == 200)
                    .AssertAll();

            new RestAssured()
                .Given()
                    .Name("Get user statistics")
                    .Header("Content-Type", "application/json")
                    .Header("Authorization", API_KEY)
                    .Query("group_id", GROUP_ID.ToString())
                    .Query("content_id", CONTENT_ID.ToString())
                    .Query("user_id", TESTUSER)
                .When()
                    .Get(GetBaseUrl() + "/stats")
                .Then()
                    .Debug()
                    .TestStatus("Test status", x => x == 200)
                    .TestBody("Total Score", x => x.user_scores.total_score == 1337)
                    .TestBody("Best Score", x => x.user_scores.best_score == 1337)
                    .TestBody("Best Combo", x => x.user_scores.best_combo == 42)
                    .AssertAll();
        }

        [TestMethod]
        public void TestUnknownUserThrowsError()
        {
            new RestAssured()
                .Given()
                    .Name("Get user statistics")
                    .Header("Content-Type", "application/json")
                    .Header("Authorization", API_KEY)
                    .Query("group_id", GROUP_ID.ToString())
                    .Query("content_id", CONTENT_ID.ToString())
                    .Query("user_id", TESTUSER)
                .When()
                    .Get(GetBaseUrl() + "/stats")
                .Then()
                    .Debug()
                    .TestStatus("Test status", x => x == 404)
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
                .When()
                    .Get(GetBaseUrl() + "/stats")
                .Then()
                    .Debug()
                    .TestStatus("Test status", x => x == 400)
                    .TestBody("Test error", x => x.error == "No user_id specified.")
                    .AssertAll();
        }

        [TestMethod]
        public void TestMissingContentIdThrowsError()
        {
            new RestAssured()
                .Given()
                    .Name("Get user statistics")
                    .Header("Content-Type", "application/json")
                    .Header("Authorization", API_KEY)
                    .Query("group_id", GROUP_ID.ToString())
                    .Query("user_id", TESTUSER)
                .When()
                    .Get(GetBaseUrl() + "/stats")
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
                    .Name("Get user statistics")
                    .Header("Content-Type", "application/json")
                    .Query("group_id", GROUP_ID.ToString())
                    .Query("content_id", CONTENT_ID.ToString())
                .When()
                    .Get(GetBaseUrl() + "/stats")
                .Then()
                    .Debug()
                    .TestStatus("Test status", x => x == 401)
                    .AssertAll();
        }

    }
}
