# Media Instructions

This document provides guidance on customizing the media files (images and audio) for your wedding website.

## Wedding Photos

### Location
Photos should be placed in the `public/images/` directory.

### Requirements
- Format: JPG or PNG (JPG recommended for photos)
- Resolution: At least 1200x800 pixels (landscape orientation works best)
- File size: Ideally under 500KB per image for faster loading
- Naming: `wedding1.jpg`, `wedding2.jpg`, etc. through `wedding6.jpg`

### Photo Selection Tips
- Choose a variety of photos that tell your story
- Include close-ups and wider shots
- Select photos with good lighting and clarity
- Consider including engagement photos or photos from your journey together
- Ensure photos have similar aspect ratios for consistent display in the carousel

### Custom Photo Configuration
If you want to use different filenames or more/fewer photos:

1. Edit `src/App.tsx` to change the `sampleImages` array:
   ```typescript
   const sampleImages = [
     'https://picsum.photos/id/1/1200/800', // Replace with your image paths
     'https://picsum.photos/id/2/1200/800',
     // Add or remove images as needed
   ];
   ```

2. If changing the number of photos, you may need to adjust the carousel spacing in `src/components/3d/PhotoCarousel.tsx`.

## Background Music

### Location
Audio files should be placed in the `public/audio/` directory.

### Requirements
- Format: MP3 (recommended) or OGG
- Duration: 2-5 minutes (will loop automatically)
- File size: Ideally under 5MB for faster loading
- Default filename: `wedding-music.mp3`

### Music Selection Tips
- Choose romantic, instrumental music that won't distract from the content
- Ensure you have the rights to use the music (consider royalty-free options)
- Select music with a consistent volume level (not too loud)
- Avoid music with lyrics as it can be distracting

### Custom Audio Configuration
If you want to use a different filename or add multiple tracks:

1. Edit the `useAudio.ts` hook in `src/hooks/useAudio.ts`:
   ```typescript
   // Change the default audio source
   const [audioSrc, setAudioSrc] = useState('/audio/your-custom-filename.mp3');
   ```

2. To add multiple tracks with a selector, you'll need to modify both `useAudio.ts` and the `SoundControl.tsx` component.

## Image Optimization

For optimal performance, compress your images before adding them:

1. Use a tool like [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
2. Resize images to about 1200x800 pixels
3. Save at 80-90% quality

## Testing Media Files

After adding your customized media:

1. Run the website locally with `npm start`
2. Check that all images load properly in the carousel
3. Verify that the music plays and pauses correctly
4. Test on different devices to ensure responsiveness

## Troubleshooting

### Images Not Loading
- Check file paths and names
- Verify file formats (JPG/PNG)
- Check browser console for errors
- Try clearing browser cache

### Audio Not Playing
- Check file path and name
- Verify file format (MP3/OGG)
- Ensure audio is enabled in your browser
- Check browser console for errors 