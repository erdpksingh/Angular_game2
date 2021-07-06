using Microsoft.VisualStudio.TestTools.UnitTesting;
using RA;

namespace ComboRacerAPITest
{
    [TestClass]
    public class HighscoreTest : TestBase
    {
        private string TESTUSER2 = CreateTestuser();
        private string TESTUSER3 = CreateTestuser();
        private string TESTUSER4 = CreateTestuser();
        private string TESTUSER5 = CreateTestuser();

        [TestMethod]
        public void TestPostNewScore()
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
                    .TestBody("Total Score", x => x.user_scores.total_score == 1337)
                    .TestBody("Best Score", x => x.user_scores.best_score == 1337)
                    .TestBody("Best combo", x => x.user_scores.best_combo == 42)
                    .AssertAll();
        }

        [TestMethod]
        public void TestHighscoreTotal()
        {
            PostScore(TESTUSER, 5000, 69);
            PostScore(TESTUSER2, 9001, 42);
            PostScore(TESTUSER, 5000, 69);

            new RestAssured()
                .Given()
                    .Name("Get highscore total")
                    .Header("Content-Type", "application/json")
                    .Header("Authorization", API_KEY)
                    .Query("group_id", GROUP_ID.ToString())
                    .Query("content_id", CONTENT_ID.ToString())
                    .Query("limit", "10")
                .When()
                    .Get(GetBaseUrl() + "/highscore/total")
                .Then()
                    .Debug()
                    .TestStatus("Test status", x => x == 200)
                    .TestBody("User 1", x => x[0].user_id == TESTUSER)
                    .TestBody("Score 1", x => x[0].score == 10000)
                    .TestBody("Rank 1", x => x[0].rank == 1)
                    .TestBody("User 2", x => x[1].user_id == TESTUSER2)
                    .TestBody("Score 2", x => x[1].score == 9001)
                    .TestBody("Rank 2", x => x[1].rank == 2)
                    .AssertAll();
        }

        [TestMethod]
        public void TestHighscoreTotalFailsWithoutContentId()
        {
            PostScore(TESTUSER, 5000, 69);
            PostScore(TESTUSER2, 9001, 42);
            PostScore(TESTUSER, 5000, 69);

            new RestAssured()
                .Given()
                    .Name("Get highscore total")
                    .Header("Content-Type", "application/json")
                    .Header("Authorization", API_KEY)
                    .Query("group_id", GROUP_ID.ToString())
                    .Query("limit", "10")
                .When()
                    .Get(GetBaseUrl() + "/highscore/total")
                .Then()
                    .Debug()
                    .TestStatus("Test status", x => x == 400)
                    .TestBody("Test error", x => x.error == "No content_id specified.")
                    .AssertAll();
        }

        [TestMethod]
        public void TestHighscoreBest()
        {
            PostScore(TESTUSER, 5000, 69);
            PostScore(TESTUSER2, 9001, 42);
            PostScore(TESTUSER, 5000, 69);

            new RestAssured()
                .Given()
                    .Name("Get highscore total")
                    .Header("Content-Type", "application/json")
                    .Header("Authorization", API_KEY)
                    .Query("group_id", GROUP_ID.ToString())
                    .Query("content_id", CONTENT_ID.ToString())
                    .Query("limit", "10")
                .When()
                    .Get(GetBaseUrl() + "/highscore/best")
                .Then()
                    .Debug()
                    .TestStatus("Test status", x => x == 200)
                    .TestBody("User 1", x => x[0].user_id == TESTUSER2)
                    .TestBody("Score 1", x => x[0].score == 9001)
                    .TestBody("Rank 1", x => x[0].rank == 1)
                    .TestBody("User 2", x => x[1].user_id == TESTUSER)
                    .TestBody("Score 2", x => x[1].score == 5000)
                    .TestBody("Rank 2", x => x[1].rank == 2)
                    .AssertAll();
        }

        [TestMethod]
        public void TestHighscoreTotalNearby()
        {
            PostScore(TESTUSER, 6, 1);
            PostScore(TESTUSER2, 5, 1);
            PostScore(TESTUSER3, 4, 1);
            PostScore(TESTUSER4, 2, 1);
            PostScore(TESTUSER5, 1, 1);
            PostScore(TESTUSER5, 1, 1);
            PostScore(TESTUSER5, 1, 1);

            new RestAssured()
                .Given()
                    .Name("Get highscore total nearby")
                    .Header("Content-Type", "application/json")
                    .Header("Authorization", API_KEY)
                    .Query("group_id", GROUP_ID.ToString())
                    .Query("content_id", CONTENT_ID.ToString())
                    .Query("user_id", TESTUSER5)
                    .Query("limit", "1")
                .When()
                    .Get(GetBaseUrl() + "/highscore/total/user")
                .Then()
                    .Debug()
                    .TestStatus("Test status", x => x == 200)
                    .TestBody("User 1", x => x[0].user_id == TESTUSER3)
                    .TestBody("Score 1", x => x[0].score == 4)
                    .TestBody("Rank 1", x => x[0].rank == 3)
                    .TestBody("User 2", x => x[1].user_id == TESTUSER5)
                    .TestBody("Score 2", x => x[1].score == 3)
                    .TestBody("Rank 2", x => x[1].rank == 4)
                    .TestBody("User 3", x => x[2].user_id == TESTUSER4)
                    .TestBody("Score 3", x => x[2].score == 2)
                    .TestBody("Rank 3", x => x[2].rank == 5)
                    .AssertAll();
        }

        [TestMethod]
        public void TestHighscoreBestNearby()
        {
            PostScore(TESTUSER, 5, 1);
            PostScore(TESTUSER2, 4, 1);
            PostScore(TESTUSER3, 3, 1);
            PostScore(TESTUSER4, 2, 1);
            PostScore(TESTUSER5, 1, 1);
            PostScore(TESTUSER5, 1, 1);
            PostScore(TESTUSER5, 1, 1);

            new RestAssured()
                .Given()
                    .Name("Get highscore total nearby")
                    .Header("Content-Type", "application/json")
                    .Header("Authorization", API_KEY)
                    .Query("group_id", GROUP_ID.ToString())
                    .Query("content_id", CONTENT_ID.ToString())
                    .Query("user_id", TESTUSER3)
                    .Query("limit", "1")
                .When()
                    .Get(GetBaseUrl() + "/highscore/best/user")
                .Then()
                    .Debug()
                    .TestStatus("Test status", x => x == 200)
                    .TestBody("User 1", x => x[0].user_id == TESTUSER2)
                    .TestBody("Score 1", x => x[0].score == 4)
                    .TestBody("Rank 1", x => x[0].rank == 2)
                    .TestBody("User 2", x => x[1].user_id == TESTUSER3)
                    .TestBody("Score 2", x => x[1].score == 3)
                    .TestBody("Rank 2", x => x[1].rank == 3)
                    .TestBody("User 3", x => x[2].user_id == TESTUSER4)
                    .TestBody("Score 3", x => x[2].score == 2)
                    .TestBody("Rank 3", x => x[2].rank == 4)
                    .AssertAll();
        }

        [TestMethod]
        public void TestHighscoreNearbyFailsWithoutUserId()
        {
            PostScore(TESTUSER, 5, 1);
            PostScore(TESTUSER2, 4, 1);
            PostScore(TESTUSER3, 3, 1);
            PostScore(TESTUSER4, 2, 1);
            PostScore(TESTUSER5, 1, 1);

            new RestAssured()
                .Given()
                    .Name("Get highscore total nearby")
                    .Header("Content-Type", "application/json")
                    .Header("Authorization", API_KEY)
                    .Query("group_id", GROUP_ID.ToString())
                    .Query("content_id", CONTENT_ID.ToString())
                    .Query("limit", "1")
                .When()
                    .Get(GetBaseUrl() + "/highscore/total/user")
                .Then()
                    .Debug()
                    .TestStatus("Test status", x => x == 400)
                    .TestBody("Test error", x => x.error == "No user_id specified.")
                    .AssertAll();
        }

        [TestMethod]
        public void TestHighscoreNearbyFailsWithoutLimit()
        {
            PostScore(TESTUSER, 5, 1);
            PostScore(TESTUSER2, 4, 1);
            PostScore(TESTUSER3, 3, 1);
            PostScore(TESTUSER4, 2, 1);
            PostScore(TESTUSER5, 1, 1);

            new RestAssured()
                .Given()
                    .Name("Get highscore total nearby")
                    .Header("Content-Type", "application/json")
                    .Header("Authorization", API_KEY)
                    .Query("group_id", GROUP_ID.ToString())
                    .Query("content_id", CONTENT_ID.ToString())
                    .Query("user_id", TESTUSER3)
                .When()
                    .Get(GetBaseUrl() + "/highscore/total/user")
                .Then()
                    .Debug()
                    .TestStatus("Test status", x => x == 400)
                    .TestBody("Test error", x => x.error == "No limit specified.")
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
                    .TestStatus("Test status", x => x == 401)
                    .AssertAll();
        }

        protected void PostScore(string user, int score, int bestCombo)
        {
            new RestAssured()
                .Given()
                    .Name("Post new score")
                    .Header("Content-Type", "application/json")
                    .Header("Authorization", API_KEY)
                    .Query("group_id", GROUP_ID.ToString())
                    .Query("content_id", CONTENT_ID.ToString())
                    .Query("user_id", user)
                    .Body(new
                    {
                        score = score,
                        best_combo = bestCombo
                    })
                .When()
                    .Post(GetBaseUrl() + "/highscore")
                .Then()
                    .Debug()
                    .TestStatus("Status", x => x == 200)
                    .AssertAll();
        }
    }
}
