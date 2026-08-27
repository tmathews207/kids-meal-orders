// Cloudinary is used for photo storage (item library photos + kids' meal
// photos) instead of Firebase Storage, since it has a free tier that
// doesn't require a paid plan. Fill these in from your Cloudinary account
// (see SETUP.md) -- the unsigned upload preset must NOT lock the folder, so
// the app can route uploads into different folders per use.
export const CLOUDINARY_CLOUD_NAME = 'dt5jvaaur'
export const CLOUDINARY_UPLOAD_PRESET = 'kids-meal-orders'

// Folder names in Cloudinary for each kind of photo this app uploads.
export const CLOUDINARY_LIBRARY_FOLDER = 'library-items'
export const CLOUDINARY_MEAL_FOLDER = 'Menu'
