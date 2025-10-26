import { Link } from 'react-router-dom';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const getNotificationIcon = (type) => {
    const icons = {
      like: '❤️',
      comment: '💬',
      follow: '👤',
      share: '🔄',
      mention: '📍',
      message: '💌',
      post: '📝',
      story: '📱',
      friend_request: '🤝',
      event: '📅'
    };
    return icons[type] || '🔔';
  };

  const getNotificationMessage = (notification) => {
    const { type, fromUser, post, story } = notification;
    const userName = fromUser?.name || 'Someone';

    const messages = {
      like: `${userName} liked your post`,
      comment: `${userName} commented on your post`,
      follow: `${userName} started following you`,
      share: `${userName} shared your post`,
      mention: `${userName} mentioned you in a post`,
      message: `${userName} sent you a message`,
      post: `${userName} created a new post`,
      story: `${userName} posted a story`,
      friend_request: `${userName} sent you a friend request`,
      event: `${userName} invited you to an event`
    };

    return messages[type] || 'New notification';
  };

  const getNotificationLink = (notification) => {
    const { type, post, story, fromUser } = notification;

    if (post) return `/post/${post._id}`;
    if (story) return `/stories`;
    if (fromUser) return `/profile/${fromUser._id}`;
    
    return '/notifications';
  };

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification._id);
    }
  };

  return (
    <Link
      to={getNotificationLink(notification)}
      onClick={handleClick}
      className={`block bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow ${
        !notification.isRead ? 'border-l-4 border-blue-500' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-900">
                {getNotificationMessage(notification)}
              </p>
              
              {/* Preview content */}
              {notification.post?.caption && (
                <p className="text-gray-600 text-sm mt-1 truncate">
                  {notification.post.caption}
                </p>
              )}
              
              <p className="text-gray-500 text-xs mt-1">
                {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                {new Date(notification.createdAt).toLocaleTimeString()}
              </p>
            </div>

            {/* Preview Image */}
            {(notification.post?.media?.[0] || notification.fromUser?.profilePicture) && (
              <div className="flex-shrink-0 ml-3">
                <img
                  src={
                    notification.post?.media?.[0]?.url ||
                    notification.fromUser?.profilePicture ||
                    '/default-avatar.png'
                  }
                  alt="Preview"
                  className="w-12 h-12 rounded-lg object-cover"
                />
              </div>
            )}
          </div>

          {/* Action Buttons for specific types */}
          {notification.type === 'friend_request' && (
            <div className="flex space-x-2 mt-3">
              <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
                Accept
              </button>
              <button className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 transition-colors">
                Decline
              </button>
            </div>
          )}
        </div>

        {/* Unread indicator */}
        {!notification.isRead && (
          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
        )}
      </div>
    </Link>
  );
};

export default NotificationItem;
