<?php

include_once("db_connect.php");
include_once("stats.php");

function get_highscore($field)
{
    global $group_id;
    global $content_id;
    $limit = $_REQUEST["limit"];
    require_field($limit, "No limit specified.");
    require_field($content_id, "No content_id specified.");

    $sql = "SELECT *, row_number() OVER (ORDER BY {FIELD} DESC) rank FROM highscores
            WHERE highscores.group_id = :group_id
            AND highscores.content_id = :content_id
            ORDER BY {FIELD} DESC
            LIMIT :limit";
    $sql = str_replace("{FIELD}", $field, $sql);
    $stmt = prepare_query($sql);
    if ($stmt->execute(["limit" => $limit, "group_id" => $group_id, "content_id" => $content_id])) {
        $highscore = array();
        while ($row = $stmt->fetch()) {
            $score = array(
                    "user_id" => $row["user_id"],
                    "team_id" => 0,
                    "score" => intval($row[$field]),
                    "rank" => intval($row["rank"])
                );
            array_push($highscore, $score);
        }
        
        return_json($highscore);
    } else {
        http_response_code(400);
    }
}

function get_highscore_nearby($field)
{
    global $group_id;
    global $content_id;
    $limit = $_REQUEST["limit"];
    $user_id = $_REQUEST["user_id"];
    require_field($limit, "No limit specified.");
    require_field($user_id, "No user_id specified.");
    require_field($content_id, "No content_id specified.");

    $sql = "
      WITH RECURSIVE base AS (
        SELECT
          user_id,
          row_number() OVER (ORDER BY {FIELD} DESC) rn,
          row_number() OVER (ORDER BY {FIELD} DESC) - :limit  lag,
          {FIELD}
          FROM highscores
          WHERE group_id = :group_id
          AND content_id = :content_id
      ),
      middle AS (SELECT base.* FROM base WHERE user_id = :user_id),
      max AS (SELECT MAX(rn) max FROM base),
      bounds AS (SELECT user_id, {FIELD}, LEAST(GREATEST(lag, 1),(SELECT max - 2 * :limit FROM max)) lag FROM middle)
      SELECT base.* FROM base
      JOIN (SELECT lag FROM bounds) sub ON base.rn BETWEEN sub.lag AND sub.lag + 2 * :limit";
    $sql = str_replace("{FIELD}", $field, $sql);
    $stmt = prepare_query($sql);
    if ($stmt->execute(["limit" => $limit, "user_id" => $user_id, "group_id" => $group_id, "content_id" => $content_id])) {
        $highscore = array();
        while ($row = $stmt->fetch()) {
            $score = array(
                    "user_id" => $row["user_id"],
                    "team_id" => 0, // TODO: Add team logic
                    "score" => intval($row[$field]),
                    "rank" => intval($row["rn"])
                );
            array_push($highscore, $score);
        }
        
        return_json($highscore);
    } else {
        http_response_code(400);
    }
}

function get_highscore_best()
{
    get_highscore("score");
}

function get_highscore_best_nearby()
{
    get_highscore_nearby("score");
}

function get_highscore_total()
{
    get_highscore("total");
}

function get_highscore_total_nearby()
{
    get_highscore_nearby("total");
}

function update_highscore()
{
    global $group_id;
    global $content_id;
    $user_id = $_REQUEST["user_id"];
    $data = json_decode(file_get_contents('php://input'), true);
    $score = $data["score"];
    $best_combo = $data["best_combo"];
    require_field($user_id, "No user_id specified.");
    require_field($score, "No score specified.");
    require_field($best_combo, "No best_combo specified.");
    require_field($content_id, "No content_id specified.");

    $stmt = prepare_query("INSERT INTO highscores (user_id, group_id, content_id, score, total, best_combo)
        VALUES(:user_id, :group_id, :content_id, :score, :score, 0)
        ON CONFLICT (user_id, group_id, content_id) 
        DO UPDATE SET total = highscores.total + :score");
    if (!$stmt->execute(["user_id" => $user_id, "group_id" => $group_id, "score" => $score, "content_id" => $content_id])) {
        http_response_code(400);
        die();
    }

    $stmt = prepare_query("UPDATE highscores SET score = :score 
        WHERE user_id = :user_id 
        AND group_id = :group_id 
        AND content_id = :content_id 
        AND score < :score");
    if (!$stmt->execute(["user_id" => $user_id, "group_id" => $group_id, "content_id" => $content_id, "score" => $score])) {
        http_response_code(400);
        die();
    }

    $stmt = prepare_query("UPDATE highscores SET best_combo = :best_combo 
        WHERE user_id = :user_id 
        AND group_id = :group_id 
        AND content_id = :content_id
        AND best_combo < :best_combo");
    if ($stmt->execute(["user_id" => $user_id, "group_id" => $group_id, "content_id" => $content_id, "best_combo" => $best_combo])) {
        get_stats();
    } else {
        http_response_code(400);
    }
}

{
    switch ($_SERVER["REQUEST_METHOD"]) {
        case "GET":
            if (preg_match("/^\/highscore\/best\/?$/", $query)) {
                get_highscore_best();
            } elseif (preg_match("/^\/highscore\/best\/user\/?$/", $query)) {
                get_highscore_best_nearby();
            } elseif (preg_match("/^\/highscore\/total\/?$/", $query)) {
                get_highscore_total();
            } elseif (preg_match("/^\/highscore\/total\/user\/?$/", $query)) {
                get_highscore_total_nearby();
            }
            break;
        case "POST":
            if (preg_match("/^\/highscore\/?$/", $query)) {
                update_highscore();
            }
    }
}
