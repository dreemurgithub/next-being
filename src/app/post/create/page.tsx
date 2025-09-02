import { Suspense } from 'react';
import CreatePost from '@/app/Component/Post/create';

export default function CreatePostPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        }>
            <CreatePost />
        </Suspense>
    );
}
