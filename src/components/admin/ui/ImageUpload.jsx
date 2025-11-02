import {useEffect} from "react";

function ImageUpload({
                         image,
                         onUploadSuccess,
                         variant = "light"
                     }) {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://upload-widget.cloudinary.com/global/all.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const handleImageUpload = () => {
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
                                secure_url: result.info.secure_url
                            }
                        });
                    }
                }
            );
        }
    };

    const themeStyles = {
        light: {
            label: "text-sm font-bold text-slate-900 mb-2",
            button: "cursor-pointer w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 bg-white hover:bg-slate-50 transition-all"
        },
        dark: {
            label: "text-white font-bold mb-2",
            button: "cursor-pointer w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 hover:bg-slate-700 transition-all"
        }
    };

    const {label: labelClass, button: buttonClass} = themeStyles[variant];

    return (
        <div>
            <label className={`block ${labelClass}`}>Image</label>
            <button
                type="button"
                onClick={handleImageUpload}
                className={buttonClass}
            >
                {image ? '✓ Image Uploaded' : 'Click to Upload Image'}
            </button>
            {image && (
                <img
                    src={image}
                    alt="preview"
                    className="mt-3 w-32 h-32 object-cover rounded-lg"
                />
            )}
        </div>
    );
}

export default ImageUpload;