<?php

include_once("db_connect.php");
include_once("achievements.php");

function get_stats()
{
    global $group_id;
    global $content_id;
    $user_id = $_REQUEST["user_id"];
    require_field($user_id, "No user_id specified.");
    require_field($content_id, "No content_id specified.");

    $stmt = prepare_query("WITH base AS (
        SELECT 
            user_id, 
            group_id,
            total,
            score,
            best_combo,
            row_number() OVER (ORDER BY total DESC) rank_total,
            row_number() OVER (ORDER BY score DESC) rank_best
            FROM highscores
            WHERE group_id = :group_id
            AND content_id = :content_id)
        SELECT base.* FROM base
        WHERE user_id = :user_id");
    if ($stmt->execute(["user_id" => $user_id, "group_id" => $group_id, "content_id" => $content_id])) {
        if ($row = $stmt->fetch()) {
            $stats = array(
                "user_id" => $row["user_id"],
                "team_id" => 0,
                "group_id" => intval($row["group_id"]),
                "user_scores" => array(
                    "total_score" => intval($row["total"]),
                    "best_score" => intval($row["score"]),
                    "best_combo" => intval($row["best_combo"]),
                    "rank_total" => intval($row["rank_total"]),
                    "rank_best" => intval($row["rank_best"]),
                ),
                "achievements" => get_achievements_internal()
            );
            return_json($stats);
        } else {
            http_response_code(404);
        }
    } else {
        http_response_code(400);
    }
}

{
    switch ($_SERVER["REQUEST_METHOD"]) {
        case "GET":
            if (preg_match("/^\/stats\/?$/", $query)) {
                get_stats();
            }
            break;
    }
}
