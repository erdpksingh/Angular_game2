<?php

include_once("db_connect.php");

function update_achievement()
{
    global $group_id;
    global $content_id;
    $user_id = $_REQUEST["user_id"];
    $data = json_decode(file_get_contents('php://input'), true);
    $achievement_id = $data["achievement_id"];
    $unlocked = $data["unlocked"] ? "true" : "false";
    $timestamp = $data["timestamp"];
    require_field($user_id, "No user_id specified.");
    require_field($achievement_id, "No achievement_id specified.");
    require_field($unlocked, "No unlocked specified.");
    require_field($timestamp, "No timestamp specified.");
    require_field($content_id, "No content_id specified.");

    $stmt = prepare_query("INSERT INTO achievements (user_id, group_id, content_id, achievement_id, unlocked, timestamp)
        VALUES(:user_id, :group_id, :content_id, :achievement_id, :unlocked, :timestamp)
        ON CONFLICT (user_id, group_id, content_id, achievement_id) 
        DO UPDATE SET unlocked = :unlocked, timestamp = :timestamp");
    if ($stmt->execute(["user_id" => $user_id, "group_id" => $group_id, "content_id" => $content_id, "achievement_id" => $achievement_id, "unlocked" => $unlocked, "timestamp" => $timestamp])) {
        return_json($data);
    } else {
        http_response_code(400);
    }
}

function get_achievements_internal()
{
    global $group_id;
    global $content_id;
    $user_id = $_REQUEST["user_id"];
    $stmt = prepare_query("SELECT * FROM achievements
        WHERE user_id = :user_id 
        AND group_id = :group_id
        AND content_id = :content_id
        ORDER BY achievement_id");
    if ($stmt->execute(["user_id" => $user_id, "group_id" => $group_id, "content_id" => $content_id])) {
        $achievements = array();
        while ($row = $stmt->fetch()) {
            $achievement = array(
                    "achievement_id" => intval($row["achievement_id"]),
                    "unlocked" => $row["unlocked"],
                    "timestamp" => date_format(date_create($row["timestamp"]), "Y-m-d\TH:i:s\Z")
                );
            array_push($achievements, $achievement);
        }
        
        return $achievements;
    } else {
        return array();
    }
}

{
    switch ($_SERVER["REQUEST_METHOD"]) {
        case "PUT":
            if (preg_match("/^\/achievements\/?$/", $query)) {
                update_achievement();
            }
            break;
        default:
            http_response_code(405);
    }
}
