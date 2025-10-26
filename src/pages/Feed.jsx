import { useState, useEffect, useRef } from 'react';
import { postsAPI, storiesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CreatePost from '../components/posts/CreatePost';
import PostCard from '../components/posts/PostCard';
import StoriesBar from '../components/stories/StoriesBar';
import SuggestedUsers from '../components/sidebar/SuggestedUsers';
import Trends from '../components/sidebar/Trends';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();
  const observerRef = useRef();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [postsResponse, storiesResponse] = await Promise.all([
        postsAPI.getFeed(),
        storiesAPI.getFeed()
      ]);
      
      setPosts(postsResponse.data.posts || []);
      setStories(storiesResponse.data || []);
      setHasMore(postsResponse.data.pagination?.hasMore || false);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await postsAPI.getFeed(nextPage);
      
      setPosts(prev => [...prev, ...(response.data.posts || [])]);
      setPage(nextPage);
      setHasMore(response.data.pagination?.hasMore || false);
    } catch (error) {
      console.error('Failed to load more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleNewPost = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostUpdate = (postId, updates) => {
    setPosts(prev => prev.map(post => 
      post._id === postId ? { ...post, ...updates } : post
    ));
  };

  const handlePostDelete = (postId) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
  };

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 mb-4 animate-pulse">
            <div className="flex space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/6"></div>
              </div>
            </div>
            <div className="mt-3 h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Stories */}
        <StoriesBar stories={stories} />

        {/* Create Post */}
        <CreatePost onPostCreated={handleNewPost} />

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              onUpdate={handlePostUpdate}
              onDelete={handlePostDelete}
            />
          ))}
        </div>

        {/* Loading More */}
        {loadingMore && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}

        {/* Observer element for infinite scroll */}
        {hasMore && !loadingMore && (
          <div ref={observerRef} className="h-10"></div>
        )}

        {/* No posts message */}
        {posts.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">🏀</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-600 mb-4">
              Follow some users or create the first post in your network!
            </p>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        <SuggestedUsers />
        <Trends />
      </div>
    </div>
  );
};

export default Feed;
