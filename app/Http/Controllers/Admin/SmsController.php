<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\MoolreSmsService;
use Illuminate\Http\Request;

class SmsController extends Controller
{
    private $smsService;

    public function __construct(MoolreSmsService $smsService)
    {
        $this->smsService = $smsService;
    }

    public function index()
    {
        $totalUsers = User::whereNotNull('phone')->count();
        return inertia('Admin/Sms', ['totalUsers' => $totalUsers]);
    }

    public function send(Request $request)
    {
        $request->validate(['message' => 'required|string|max:500']);

        $phoneNumbers = User::whereNotNull('phone')->pluck('phone')->toArray();

        if (empty($phoneNumbers)) {
            return back()->with('error', 'No users with phone numbers found.');
        }

        $result = $this->smsService->sendBulkSms($phoneNumbers, $request->message);

        return back()->with(
            $result['success'] ? 'success' : 'error',
            $result['success'] 
                ? 'SMS sent successfully to ' . count($phoneNumbers) . ' users.' 
                : 'Failed to send SMS. Please try again.'
        );
    }
}
