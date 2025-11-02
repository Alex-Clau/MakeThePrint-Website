export const initializeCloudinary = () => {
    return new Promise((resolve) => {
        if (window.cloudinary) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://upload-widget.cloudinary.com/global/all.js';
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
    });
};

export const handleImageUpload = (onUploadSuccess) => {
    if (window.cloudinary) {
        window.cloudinary.openUploadWidget(
            {
                cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
                uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
                zIndex: 9999,
            },
            (error, result) => {
                if (!error && result && result.event === 'success') {
                    onUploadSuccess({
                        info: {
                            secure_url: result.info.secure_url,
                            public_id: result.info.public_id
                        }
                    });
                }
            }
        );
    }
};