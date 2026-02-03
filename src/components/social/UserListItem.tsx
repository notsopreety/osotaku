import { Link } from 'react-router-dom';
import { UserCheck, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UserListItemProps {
  user: {
    id: number;
    name: string;
    avatar?: {
      large?: string;
      medium?: string;
    };
    isFollowing?: boolean;
    isFollower?: boolean;
  };
  onFollow?: (userId: number) => void;
  isFollowLoading?: boolean;
  showFollowButton?: boolean;
  currentUserId?: number;
  onClose?: () => void;
}

export function UserListItem({ 
  user, 
  onFollow, 
  isFollowLoading = false,
  showFollowButton = true,
  currentUserId,
  onClose
}: UserListItemProps) {
  const isOwnProfile = currentUserId === user.id;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <Link 
        to={`/user/${user.id}`} 
        onClick={onClose}
        className="flex items-center gap-3 flex-1 min-w-0"
      >
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar?.large || user.avatar?.medium} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{user.name}</p>
          {user.isFollower && !isOwnProfile && (
            <Badge variant="outline" className="text-xs mt-1">
              Follows you
            </Badge>
          )}
        </div>
      </Link>
      
      {showFollowButton && !isOwnProfile && onFollow && (
        <Button
          size="sm"
          variant={user.isFollowing ? "secondary" : "default"}
          onClick={() => onFollow(user.id)}
          disabled={isFollowLoading}
          className="gap-1.5 shrink-0"
        >
          {user.isFollowing ? (
            <>
              <UserCheck className="w-3.5 h-3.5" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5" />
              Follow
            </>
          )}
        </Button>
      )}
    </div>
  );
}
