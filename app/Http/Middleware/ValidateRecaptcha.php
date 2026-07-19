<?php

namespace App\Http\Middleware;

use App\Rules\Recaptcha;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateRecaptcha
{
    protected array $loginRoutes = ['login', 'mahasiswa/login'];

    public function handle(Request $request, Closure $next): Response
    {
        if (
            $request->isMethod('POST')
            && config('services.recaptcha.enabled')
            && in_array($request->path(), $this->loginRoutes)
        ) {
            $validator = validator(
                $request->only('g-recaptcha-response'),
                ['g-recaptcha-response' => ['required', new Recaptcha]]
            );

            if ($validator->fails()) {
                return back()->withErrors($validator)->withInput();
            }
        }

        return $next($request);
    }
}
