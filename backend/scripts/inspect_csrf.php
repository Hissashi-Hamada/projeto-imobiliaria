<?php
// Bootstraps Laravel and performs an internal request to /sanctum/csrf-cookie
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Bootstrap (loads env/config)
$kernel->bootstrap();

echo "--- APP ENV ---\n";
echo 'APP_URL=' . env('APP_URL') . "\n";
echo 'SESSION_DRIVER=' . env('SESSION_DRIVER') . "\n";
echo 'SESSION_DOMAIN=' . env('SESSION_DOMAIN') . "\n";
echo 'SESSION_SECURE_COOKIE=' . (env('SESSION_SECURE_COOKIE') ? 'true' : 'false') . "\n";
echo 'SANCTUM_STATEFUL_DOMAINS=' . env('SANCTUM_STATEFUL_DOMAINS') . "\n";

echo "\n--- SESSION CONFIG (config('session')) ---\n";
print_r(config('session'));

echo "\n--- MAKE INTERNAL REQUEST /sanctum/csrf-cookie ---\n";
use Illuminate\Http\Request;
$request = Request::create('/sanctum/csrf-cookie', 'GET');
$response = $kernel->handle($request);

// Print status and headers
echo 'Status: ' . $response->getStatusCode() . "\n";
echo "Headers:\n";
foreach ($response->headers->allPreserveCase() as $k => $vals) {
    foreach ($vals as $v) {
        echo "$k: $v\n";
    }
}

echo "\nCookies queued:\n";
foreach ($response->headers->getCookies() as $cookie) {
    echo $cookie->getName() . ' => ' . $cookie->getValue() . ' (domain=' . $cookie->getDomain() . ', path=' . $cookie->getPath() . ', secure=' . ($cookie->isSecure() ? '1' : '0') . ', httpOnly=' . ($cookie->isHttpOnly() ? '1' : '0') . ', sameSite=' . $cookie->getSameSite() . ")\n";
}

// Check session files
echo "\n--- SESSION FILES (storage/framework/sessions) ---\n";
$sessDir = __DIR__ . '/../storage/framework/sessions';
if (is_dir($sessDir)) {
    $files = array_slice(scandir($sessDir), 2);
    foreach ($files as $f) {
        echo $f . "\n";
    }
} else {
    echo "(no sessions dir)\n";
}

$kernel->terminate($request, $response);

echo "\n--- DONE ---\n";
