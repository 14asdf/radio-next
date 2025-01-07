import React, { useState, useEffect } from 'react';
import { Box, Text, HStack, Input, Button } from '@chakra-ui/react';
import { ref, push, onValue, get } from 'firebase/database';
import { db } from '@/firebase/config';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from './ui/avatar';

const Comments = ({ stationId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [usersData, setUsersData] = useState({});
  const { user } = useAuth();

  // Fetch users data
  useEffect(() => {
    const fetchUsersData = async () => {
      const usersRef = ref(db, 'users');
      const usersSnapshot = await get(usersRef);
      const usersData = usersSnapshot.val() || {};
      setUsersData(usersData);
    };

    fetchUsersData();
  }, []);

  useEffect(() => {
    if (!stationId) return;

    const commentsRef = ref(db, `comments/${stationId}`);
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      const commentsArray = data ? Object.values(data) : [];
      setComments(commentsArray);
    });

    return () => unsubscribe();
  }, [stationId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    const commentsRef = ref(db, `comments/${stationId}`);
    await push(commentsRef, {
      text: newComment,
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      timestamp: Date.now(),
    });

    setNewComment('');
  };

  return (
    <Box>
      {user && (
        <Box mt={6}>
          <form onSubmit={handleCommentSubmit}>
            <HStack>
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                bg="whiteAlpha.100"
                rounded="full"
              />
              <Button
                type="submit"
                isDisabled={!newComment.trim()}
                rounded="full"
              >
                Post
              </Button>
            </HStack>
          </form>
        </Box>
      )}

      <Box mt={4}>
        {comments.map((comment, index) => (
          <Box key={index} p={3} mb={2} bg="whiteAlpha.100" borderRadius="md">
            <HStack spacing={3} mb={2}>
              <Avatar
                size="sm"
                name={comment.userName}
                src={usersData[comment.userId]?.photoURL}
                bg="brand.500"
              />
              <Text fontWeight="bold">{comment.userName}</Text>
            </HStack>
            <Text>{comment.text}</Text>
            <Text fontSize="sm" color="gray.500">
              {(() => {
                const now = Date.now();
                const diff = now - comment.timestamp;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const days = Math.floor(hours / 24);

                if (hours < 24) {
                  return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
                }
                return `${days} ${days === 1 ? 'day' : 'days'} ago`;
              })()}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Comments;
