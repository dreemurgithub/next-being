import PostComponent, { Post } from "./PostComponent";

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-6">
      {Array.isArray(posts) && posts.map((post) => (
        <PostComponent key={post.id} post={post} />
      ))}
    </div>
  );
}
