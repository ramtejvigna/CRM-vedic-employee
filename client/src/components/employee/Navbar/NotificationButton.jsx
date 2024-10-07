import React, { useState, useEffect } from 'react';
import {
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  Badge,
} from "@material-tailwind/react";
import { FaBell } from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment';
import Cookies from 'js-cookie';

const NotificationButton = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const token = Cookies.get('token');

  useEffect(() => {
    fetchNotifications();
    // Set up polling to fetch notifications every 30 seconds
    const intervalId = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/notifications/get`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data)
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <Menu>
      <MenuHandler>
        <Button variant="text" className="relative p-2">
          <Badge
            content={unreadCount}
            visible={unreadCount > 0}
            className="h-4 w-4 text-xs flex items-center justify-center"
          >
            <FaBell size={20} />
          </Badge>
        </Button>
      </MenuHandler>
      <MenuList className="max-h-[300px] overflow-y-auto">
        {notifications?.length > 0 ? (
          notifications?.map((notification) => (
            <MenuItem
              key={notification._id}
              onClick={() => markAsRead(notification._id)}
              className="flex items-center p-2 hover:bg-gray-100"
            >
              <div className="flex-grow">
                <Typography variant="small" color="blue-gray" className="font-semibold border border-gray-50">
                  {notification.message}
                </Typography>
                <Typography variant="small" color="gray" className="text-xs">
                  {moment(notification.createdAt).fromNow()}
                </Typography>
              </div>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
              )}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Typography variant="small" className="text-center">
              No notifications
            </Typography>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

export default NotificationButton;
