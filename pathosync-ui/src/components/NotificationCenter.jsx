import React, { useState, useEffect } from 'react';
import { subscribeToNotifications } from '../services/notificationService';
import { useAuth } from '../hooks/useAuth';
import { Bell, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

export function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const subscription = subscribeToNotifications(user.id, (newNotification) => {
        setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
        toast.info(`New notification: ${newNotification.data.message}`);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div>
      <Button variant="ghost" onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white">{unreadCount}</Badge>
        )}
      </Button>

      {isOpen && (
        <div className="fixed top-16 right-4 w-80">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Notifications</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="text-muted-foreground">No new notifications</p>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-3 border rounded-lg ${
                        !notification.is_read ? 'bg-blue-50' : ''
                      }`}>
                      <p>{notification.data.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}