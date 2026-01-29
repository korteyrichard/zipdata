<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MoolreSmsService
{
    private $apiUrl = 'https://api.moolre.com/open/sms/send';
    private $apiKey;
    private $senderId;

    public function __construct()
    {
        $this->apiKey = config('services.moolre.api_key');
        $this->senderId = 'AFFICONET';
    }

    private function normalizePhoneNumber(string $phoneNumber): string
    {
        $phoneNumber = trim($phoneNumber);
        if (str_starts_with($phoneNumber, '+233')) {
            return '0' . substr($phoneNumber, 4);
        }
        if (str_starts_with($phoneNumber, '233')) {
            return '0' . substr($phoneNumber, 3);
        }
        return $phoneNumber;
    }

    public function sendSms(string $phoneNumber, string $message): bool
    {
        try {
            $response = Http::withHeaders([
                'X-API-VASKEY' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl, [
                'type' => 1,
                'senderid' => $this->senderId,
                'messages' => [
                    [
                        'recipient' => $this->normalizePhoneNumber($phoneNumber),
                        'message' => $message
                    ]
                ]
            ]);

            $responseData = $response->json();
            return $response->successful() && isset($responseData['status']) && $responseData['status'] === 1;
        } catch (\Exception $e) {
            Log::error('SMS sending failed: ' . $e->getMessage());
            return false;
        }
    }

    public function sendBulkSms(array $phoneNumbers, string $message): array
    {
        $messages = [];
        foreach ($phoneNumbers as $phoneNumber) {
            $messages[] = [
                'recipient' => $this->normalizePhoneNumber($phoneNumber),
                'message' => $message
            ];
        }

        try {
            $response = Http::withHeaders([
                'X-API-VASKEY' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl, [
                'type' => 1,
                'senderid' => $this->senderId,
                'messages' => $messages
            ]);

            $responseData = $response->json();
            return [
                'success' => $response->successful() && isset($responseData['status']) && $responseData['status'] === 1,
                'data' => $responseData
            ];
        } catch (\Exception $e) {
            Log::error('Bulk SMS sending failed: ' . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}