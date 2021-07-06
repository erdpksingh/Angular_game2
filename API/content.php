<?php

include_once("db_connect.php");

function get_content($id)
{
    require_field($id, "No id specified.");

    $stmt = prepare_query("SELECT * FROM content WHERE content_id = :id");

    if ($stmt->execute(["id" => $id])) {
        if ($row = $stmt->fetch()) {
            $content = array(
                "content_id" => $id,
                "app_token" => $row["app_token"]);
            return_json($content);
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
            if (preg_match("/^\/content\/(.*)\/?$/", $query, $matches)) {
                get_content($matches[1]);
            }
            break;
    }
}
