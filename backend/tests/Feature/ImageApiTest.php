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

    $image = Images::factory()->create();


    $response = $this->get("/api/images/{$image->id}");

    $response->assertStatus(200)
             ->assertJson([
                 'data' => [
                    'id' => $image->id,
                     'image_url' => $image->image_url,
                     'id_spr' => $image->id_spr
                 ]
             ]);
}); 

/**
 * Tests for the Images API
 * @author nael
 * @category test n°3 - Delete an image
 */

 test('delete an image by ID' , function(){
    
    // Create and save the image in database
    $image = Images::factory()->create();

    $response = $this->delete("/api/images/{$image->id}");

    // Assert response status (204 for successful deletion)
    return $response->assertStatus(204);
 });


