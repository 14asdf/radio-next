import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  HStack,
  Input,
  Button,
  Separator,
  Textarea,
} from '@chakra-ui/react';
import { ref, push, onValue, get } from 'firebase/database';
import { db } from '@/firebase/config';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarGroup } from './ui/avatar';

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
      {/* Comment Input */}
      {user && (
        <HStack spacing={3} m="6">
          <form onSubmit={handleCommentSubmit} style={{ width: '100%' }}>
            <HStack w="100%">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                bg="whiteAlpha.100"
                rounded="lg"
                minH="60px"
                resize="vertical"
                maxH="200px"
                mr="6"
              />
              <Button
                type="submit"
                isDisabled={!newComment.trim()}
                colorScheme="brand"
                rounded="full"
                size="sm"
              >
                Post
              </Button>
            </HStack>
          </form>
        </HStack>
      )}

      {/* Comments List */}
      <Box>
        {comments.map((comment, index) => (
          <Box key={index} mb={4}>
            <HStack align="start" spacing={3}>
              <Avatar
                size="sm"
                src={usersData[comment.userId]?.photoURL}
                name={comment.userName}
              />
              <Box>
                <Box
                  bg="gray.100"
                  _dark={{ bg: 'whiteAlpha.100' }}
                  p={3}
                  rounded="lg"
                  position="relative"
                  display="inline-block"
                  maxWidth="100%"
                  ml="auto"
                >
                  <Text
                    fontSize="sm"
                    color="gray.200"
                    _dark={{ color: 'gray.300' }}
                    textAlign="right"
                  >
                    {comment.text}
                  </Text>
                </Box>
                <Text fontSize="xs" color="gray.500" textAlign="right" mt={1}>
                  {(() => {
                    const now = Date.now();
                    const diff = now - comment.timestamp;
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const days = Math.floor(hours / 24);

                    if (hours < 1) return 'less than an hour ago';
                    if (hours < 24)
                      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
                    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
                  })()}
                </Text>
              </Box>
            </HStack>
            {index < comments.length - 1 && (
              <Separator borderColor="whiteAlpha.200" my={4} />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Comments;
