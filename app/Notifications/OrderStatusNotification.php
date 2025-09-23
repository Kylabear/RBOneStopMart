<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Notification;

class OrderStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $order;
    protected $status;

    /**
     * Create a new notification instance.
     */
    public function __construct(Order $order, string $status)
    {
        $this->order = $order;
        $this->status = $status;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $statusMessages = [
            'confirmed' => 'Your order has been confirmed and is being prepared.',
            'preparing' => 'Your order is being prepared.',
            'ready' => 'Your order is ready for pickup/delivery.',
            'delivered' => 'Your order has been delivered.',
            'cancelled' => 'Your order has been cancelled.',
        ];

        $message = $statusMessages[$this->status] ?? 'Your order status has been updated.';

        return (new MailMessage)
                    ->subject('Order Status Update - ' . $this->order->order_number)
                    ->greeting('Hello ' . $notifiable->name . '!')
                    ->line($message)
                    ->line('Order Number: ' . $this->order->order_number)
                    ->line('Status: ' . ucfirst($this->status))
                    ->action('View Order', url('/orders/' . $this->order->id))
                    ->line('Thank you for choosing R&B One Stop Mart!');
    }

    /**
     * Get the database representation of the notification.
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'status' => $this->status,
            'message' => 'Your order status has been updated to ' . ucfirst($this->status),
        ];
    }

    /**
     * Get the broadcast representation of the notification.
     */
    public function toBroadcast(object $notifiable): array
    {
        return [
            'id' => $this->id,
            'type' => 'order_status_update',
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'status' => $this->status,
            'message' => 'Your order status has been updated to ' . ucfirst($this->status),
            'created_at' => now()->toISOString(),
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'status' => $this->status,
        ];
    }
}
