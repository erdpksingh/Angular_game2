<?php

include_once("db_connect.php");

function cleanup_user()
{
    global $group_id;
    $user_id = $_REQUEST["user_id"];
    require_field($user_id, "No user_id specified.");

    $sql = "DELETE FROM highscores WHERE user_id = :user_id";
    $stmt = prepare_query($sql);
    if (!$stmt->execute(["user_id" => $user_id])) {
        http_response_code(400);
    }

    $sql = "DELETE FROM achievements WHERE user_id = :user_id";
    $stmt = prepare_query($sql);
    if (!$stmt->execute(["user_id" => $user_id])) {
        http_response_code(400);
    }

    http_response_code(200);
}

function cleanup_group()
{
    global $group_id;

    $sql = "DELETE FROM highscores WHERE group_id = :group_id";
    $stmt = prepare_query($sql);
    if (!$stmt->execute(["group_id" => $group_id])) {
        http_response_code(400);
    }

    $sql = "DELETE FROM achievements WHERE group_id = :group_id";
    $stmt = prepare_query($sql);
    if (!$stmt->execute(["group_id" => $group_id])) {
        http_response_code(400);
    }

    http_response_code(200);
}

{
    switch ($_SERVER["REQUEST_METHOD"]) {
        case "GET":
            if (preg_match("/^\/testutil\/cleanup\/user\/?$/", $query)) {
                cleanup_user();
            } elseif (preg_match("/^\/testutil\/cleanup\/group\/?$/", $query)) {
                cleanup_group();
            }
            break;
    }
}
