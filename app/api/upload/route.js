import { NextResponse } from 'next/server';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  // Check if a file was provided
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Prepare to upload the file to Cloudinary
  const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`;
  
  const uploadData = new FormData();
  uploadData.append('file', file);
  uploadData.append('upload_preset', 'unsigned_preset'); // Replace with your upload preset if needed

  try {
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: uploadData,
    });

    // Check if the upload was successful
    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    const jsonResponse = await uploadResponse.json();
    return NextResponse.json({ url: jsonResponse.secure_url }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
