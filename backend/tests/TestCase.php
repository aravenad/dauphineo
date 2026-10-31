<?php

namespace Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    /** Chaque test part des données de démonstration (CSV de database/data). */
    protected bool $seed = true;

    protected function setUp(): void
    {
        parent::setUp();

        // Symfony simule un navigateur anglais (« en-us ») ; le site, lui, envoie toujours sa langue
        $this->withHeader('Accept-Language', 'fr');
    }
}
