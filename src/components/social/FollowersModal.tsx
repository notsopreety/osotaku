import { useState } from 'react';
import { Loader2, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUserFollowers, useUserFollowing, useToggleFollow } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { UserListItem } from './UserListItem';

interface FollowersModalProps {
  userId: number;
  type: 'followers' | 'following';
  isOpen: boolean;
  onClose: () => void;
}

export function FollowersModal({ userId, type, isOpen, onClose }: FollowersModalProps) {
  const [page, setPage] = useState(1);
  const { user: currentUser, isAuthenticated } = useAuth();
  const toggleFollow = useToggleFollow();

  // Lazy loading - only fetch when modal is open
  const { data: followersData, isLoading: isLoadingFollowers } = useUserFollowers(
    userId, 
    page,
    isOpen && type === 'followers'
  );
  
  const { data: followingData, isLoading: isLoadingFollowing } = useUserFollowing(
    userId, 
    page,
    isOpen && type === 'following'
  );

  const data = type === 'followers' ? followersData : followingData;
  const isLoading = type === 'followers' ? isLoadingFollowers : isLoadingFollowing;
  const users = data?.users || [];
  const pageInfo = data?.pageInfo;

  const handleFollow = async (targetUserId: number) => {
    if (!isAuthenticated) {
      toast.error('Login Required', {
        description: 'Please log in to follow users',
      });
      return;
    }

    try {
      await toggleFollow.mutateAsync(targetUserId);
      toast.success('Success', {
        description: 'Follow status updated',
      });
    } catch {
      toast.error('Error', {
        description: 'Failed to update follow status',
      });
    }
  };

  const handleLoadMore = () => {
    if (pageInfo?.hasNextPage) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {type === 'followers' ? 'Followers' : 'Following'}
            {pageInfo?.total !== undefined && (
              <span className="text-muted-foreground font-normal">
                ({pageInfo.total})
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          {isLoading && users.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {type === 'followers' 
                ? 'No followers yet' 
                : 'Not following anyone yet'}
            </p>
          ) : (
            <div className="space-y-1">
              {users.map((user) => (
                <UserListItem
                  key={user.id}
                  user={user}
                  onFollow={handleFollow}
                  isFollowLoading={toggleFollow.isPending}
                  showFollowButton={isAuthenticated}
                  currentUserId={currentUser?.id}
                  onClose={onClose}
                />
              ))}
              
              {pageInfo?.hasNextPage && (
                <div className="pt-4 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
