<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 *     title="Dauphineo API",
 *     version="1.0.0",
 *     description="API documentation"
 * ),
 * @OA\SecurityScheme(
 *   securityScheme="bearerAuth",
 *   type="http",
 *   scheme="bearer",
 *   bearerFormat="JWT"
 * ), 
 * @OA\SecurityRequirement(
 *   securityScheme="bearerAuth"
 * ),
 * @OA\Server(
 *   url="http://localhost:8000",
 * )
 */
abstract class Controller
{
    //
}
