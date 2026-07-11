'use client';

import { get, onValue, push, ref, remove, set } from 'firebase/database';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { TbSend } from 'react-icons/tb';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/utils/firebase';

const Comments = ({ stationId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [usersData, setUsersData] = useState({});
  const { user } = useAuth();
  const t = useTranslations('time');
  const c = useTranslations('comments');

  useEffect(() => {
    const fetchUsersData = async () => {
      const usersRef = ref(db, 'users');
      const usersSnapshot = await get(usersRef);
      setUsersData(usersSnapshot.val() || {});
    };

    fetchUsersData();
  }, []);

  useEffect(() => {
    if (!stationId) return;

    const commentsRef = ref(db, `comments/${stationId}`);
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const { commentCount: _commentCount, ...commentsData } = data;
      const commentsArray = Object.entries(commentsData).map(([key, value]) => ({
        ...value,
        key,
      }));
      setComments(commentsArray);
    });

    return () => unsubscribe();
  }, [stationId]);

  const updateCommentCount = async (change) => {
    try {
      const countRef = ref(db, `comments/${stationId}/commentCount`);
      const snapshot = await get(countRef);
      const currentCount = snapshot.val() || 0;
      await set(countRef, Math.max(0, currentCount + change));
    } catch (error) {
      console.error('Error updating comment count:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      const commentsRef = ref(db, `comments/${stationId}`);
      await push(commentsRef, {
        text: newComment,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        timestamp: Date.now(),
      });

      await updateCommentCount(1);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleDeleteComment = async (commentKey) => {
    if (!user) return;
    try {
      const commentRef = ref(db, `comments/${stationId}/${commentKey}`);
      await remove(commentRef);
      await updateCommentCount(-1);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="mx-2 md:mx-8">
      {user && (
        <form onSubmit={handleCommentSubmit} className="w-full">
          <div className="flex w-full items-start gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={c('placeholder')}
              className="mr-3 min-h-[60px] max-h-[200px] resize-y rounded-lg bg-muted"
              maxLength={300}
            />
            <Button type="submit" disabled={!newComment.trim()} size="sm" className="rounded-full">
              <TbSend />
            </Button>
          </div>
        </form>
      )}

      <div className="mt-8">
        {comments.map((comment, index) => (
          <div key={comment.key} className="mb-4">
            <div className="flex items-start gap-3">
              <Link href={`/user/${comment.userId}`}>
                <Avatar className="size-8 cursor-pointer">
                  <AvatarImage src={usersData[comment.userId]?.photoURL} alt={comment.userName} />
                  <AvatarFallback>{comment.userName?.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1">
                <div className="inline-block max-w-full rounded-lg bg-muted p-3 dark:bg-white/10">
                  <p className="text-sm dark:text-neutral-300">{comment.text}</p>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {(() => {
                      const now = Date.now();
                      const diff = now - comment.timestamp;
                      const hours = Math.floor(diff / (1000 * 60 * 60));
                      const days = Math.floor(hours / 24);

                      if (hours < 1) return t('lessThanHour');
                      if (hours < 24) {
                        return hours === 1
                          ? t('hoursAgo', { hours })
                          : t('hoursAgoPlural', { hours });
                      }
                      return days === 1 ? t('daysAgo', { days }) : t('daysAgoPlural', { days });
                    })()}
                  </span>
                  {user && user.uid === comment.userId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 rounded-full"
                          aria-label="More options"
                        >
                          <BsThreeDotsVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-fit min-w-0 rounded-full">
                        <DropdownMenuItem
                          onClick={() => handleDeleteComment(comment.key)}
                          className="cursor-pointer rounded-full"
                        >
                          {c('delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </div>
            {index < comments.length - 1 && <Separator className="my-4 opacity-20" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
