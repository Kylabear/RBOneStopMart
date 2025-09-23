<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Get user's notifications
     */
    public function index(Request $request)
    {
        $notifications = Auth::user()->notifications()
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($notifications);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Request $request, $id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json([
            'message' => 'Notification marked as read'
        ]);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request)
    {
        Auth::user()->unreadNotifications->markAsRead();

        return response()->json([
            'message' => 'All notifications marked as read'
        ]);
    }

    /**
     * Get unread notifications count
     */
    public function unreadCount()
    {
        $count = Auth::user()->unreadNotifications->count();

        return response()->json([
            'count' => $count
        ]);
    }

    /**
     * Delete notification
     */
    public function destroy($id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted'
        ]);
    }
}
