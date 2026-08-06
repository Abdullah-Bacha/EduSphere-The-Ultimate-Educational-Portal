'use client';

import { useState } from 'react';

export default function TeacherImageWithFallback({ image, name }) {
    const [imageError, setImageError] = useState(false);
    const hasImage = image && image.trim() !== "";
    const showImage = hasImage && !imageError;

    return (
        <>
            {showImage ? (
                <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: "center top" }}
                    onError={() => setImageError(true)}
                />
            ) : (
                <div className="h-full w-full flex items-center justify-center text-blue-300 bg-gradient-to-br from-blue-100 to-indigo-100">
                    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                </div>
            )}
        </>
    );
}
