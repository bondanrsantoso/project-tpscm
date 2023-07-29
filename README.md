# Project Setup

## Prerequisite

1. PHP 8.1+ and a compatible database (MySQL, PostgreSQL, etc.), consult [deployment documentation](https://laravel.com/docs/10.x/deployment) for the specifics
2. Have [composer](https://getcomposer.org/download/) to manage Laravel and PHP dependencies
3. Have NPM installed to manage JavaScript dependencies

## Setting up the Project

### Setting up the Laravel Environment

1. To setup a pre-existing laravel project, make sure `composer` is installed by running this command in your terminal:
    ```sh
    $ composer --version
    ```
2. Install PHP dependencies using `composer` by running:
    ```sh
    $ composer install
    ```
3. Copy `.env.example` to `.env`
    ```sh
    $ cp .env.example .env
    ```
4. Generate a new Laravel Key
    ```sh
    $ php artisan key:generate
    ```
5. In `.env` set the database environment variable accordingly
    ```sh
    # set these variables according to your setup
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=project_tpscm # make sure you already created the Database/Schema
    DB_USERNAME=root
    DB_PASSWORD=admin
    ```
6. Run migration to setup the database structure
    ```sh
    $ php artisan migrate
    ```
7. Run the admin database seeder to populate the database with an admin account so you can log in to your app
    ```sh
    $ php artisan db:seed AdminSeeder
    ```
8. Run the remaining database seeder located in `database/seeders` directory accordingly (e.g. `ItemSeeder`) to populate your database with mock data
    ```sh
    # the format is php artisan db:seed [seeder file name] such as:
    $ php artisan db:seed ItemSeeder
    ```

### Setting up the ReactJS Frontend environment

1. Install all NPM dependencies, in this example we will use `npm`
    ```sh
    $ npm install
    ```
2. That's it.

### Serving the app via HTTP

To run the app so that it can be opened in the browser you will need 2 terminal instances, 1 to run `vite` development server so the frontend can perform hot reload whenever there's change in the JS/JSX files, and another terminal to start the Laravel development server.

1. Run `vite` development server, keep it running in the background

    ```sh
    # keep this running in the background
    $ npm run dev
    ```

2. Run Laravel's `artisan` server to make the app accessible to the browser. In this example we will tell the `artisan` server to serve at port `4500`
    ```sh
    # also keep this one running
    $ php artisan serve --port=4500
    ```
3. You now can head to [http://localhost:4500/](http://localhost:4500/) to view the web app

<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

-   [Simple, fast routing engine](https://laravel.com/docs/routing).
-   [Powerful dependency injection container](https://laravel.com/docs/container).
-   Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
-   Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
-   Database agnostic [schema migrations](https://laravel.com/docs/migrations).
-   [Robust background job processing](https://laravel.com/docs/queues).
-   [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains over 2000 video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the Laravel [Patreon page](https://patreon.com/taylorotwell).

### Premium Partners

-   **[Vehikl](https://vehikl.com/)**
-   **[Tighten Co.](https://tighten.co)**
-   **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
-   **[64 Robots](https://64robots.com)**
-   **[Cubet Techno Labs](https://cubettech.com)**
-   **[Cyber-Duck](https://cyber-duck.co.uk)**
-   **[Many](https://www.many.co.uk)**
-   **[Webdock, Fast VPS Hosting](https://www.webdock.io/en)**
-   **[DevSquad](https://devsquad.com)**
-   **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
-   **[OP.GG](https://op.gg)**
-   **[WebReinvent](https://webreinvent.com/?utm_source=laravel&utm_medium=github&utm_campaign=patreon-sponsors)**
-   **[Lendio](https://lendio.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
