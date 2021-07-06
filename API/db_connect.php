<?php
{
    // DON'T ENABLE IN PRODUCTION
    /*ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);*/

    function require_field($field, $error_message)
    {
        if (!isset($field)) {
            return_error(400, $error_message);
        }
    }

    function prepare_query($query)
    {
        global $pdo;
        return $pdo->prepare($query);
    }

    function return_json($data)
    {
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode($data);
    }

    function return_error($status, $message)
    {
        header('Content-Type: application/json');
        http_response_code($status);
        echo json_encode(array(
            "error" => $message
        ));
        exit();
    }

    http_response_code(500);

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Credentials: *");
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        die();
    }


    if (array_key_exists("HTTP_AUTHORIZATION", $_SERVER)) {
        $appHash = $_SERVER["HTTP_AUTHORIZATION"];
    } else {
        $appHash = "";
    }
    
    if (array_key_exists("group_id", $_REQUEST)) {
        $group_id = $_REQUEST["group_id"];
    } else {
        $group_id = 0;
    }

    if (array_key_exists("content_id", $_REQUEST)) {
        $content_id = $_REQUEST["content_id"];
    }

    $query = $_REQUEST["query"];
    if (strpos($query, "/v1") === 0) {
        $query = substr($query, 3);
    }

    // Read config
    $ini_array = parse_ini_file("config.ini");

    //connect to database
    $db_connection = $ini_array["db_connection"];
    $db_user = $ini_array["db_user"];
    $db_password = $ini_array["db_password"];

    // read form data
    $phpHash = "c746510a3ca2d711cacccaedd5a2e209c101af8b";

    if ($appHash != $phpHash) {
        return_error(401, "API Key not valid '" . $appHash . "'");
    }

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ];
    try {
        $pdo = new PDO($db_connection, $db_user, $db_password, $options);
    } catch (Exception $e) {
        return_error(500, "Could not connect to database");
    }

    
    
}
