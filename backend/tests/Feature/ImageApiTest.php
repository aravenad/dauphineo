<?php

use \App\Models\Images;





/**
 * Tests for the Images API
 * @author nael
 * @category test n°1 - fetch all images
 */
test('fetch all images' , function(){
    
    $response = $this->get('/api/images');

    $response->assertStatus(200);
});

/**
 * Tests for the Images API
 * @author nael
 * @category test n°2 - fetch image by ID
 */

test('fetch one image by ID' , function(){

    $image = Images::factory()->make();


    $response = $this->get("/api/images/{$image->id}");

    $response->assertStatus(200)
             ->assertJson([
                 'data' => [
                     'id_spr' => $image->id_spr,
                     'image_url' => $image->image_url
                 ]
             ]);



});