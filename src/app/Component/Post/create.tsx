'use client';

import { useState } from 'react';

export default function CreatePost() {
    const [text, setText] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Handle form submission here
        // You can send the text and files to your API endpoint
        console.log('Text:', text);
        console.log('Files:', files);

        // Example: Create FormData for file upload
        const formData = new FormData();
        formData.append('text', text);
        if (files) {
            Array.from(files).forEach((file, index) => {
                formData.append(`image_${index}`, file);
            });
        }

        // TODO: Send to API endpoint
        // const response = await fetch('/api/post/create', {
        //   method: 'POST',
        //   body: formData,
        // });
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Text Input */}
                <div>
                    <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                        Post Content
                    </label>
                    <textarea
                        id="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write your post content here..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* File Upload */}
                <div>
                    <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Images
                    </label>
                    <input
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {files && (
                        <div className="mt-2 text-sm text-gray-600">
                            {files.length} file(s) selected
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Create Post
                </button>
            </form>
        </div>
    );
}
