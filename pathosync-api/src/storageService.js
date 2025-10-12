const supabase = require('./supabaseClient');
const db = require('./db');

const BUCKET_NAME = 'pathosync';

/**
 * Uploads a file to Supabase Storage and saves its metadata to the database.
 * @param {object} file - The file object from multer (req.file).
 * @param {object} user - The authenticated user object.
 * @returns {object} The metadata of the saved file.
 */
const uploadFile = async (file, user) => {
  const { originalname, mimetype, size } = file;
  const { id: userId, tenant_id: tenantId } = user;

  const filePath = `${tenantId}/${userId}/${Date.now()}-${originalname}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file.buffer, {
      contentType: mimetype,
      upsert: false,
    });

  if (uploadError) {
    console.error('Error uploading file to Supabase:', uploadError.message);
    throw new Error('Failed to upload file.');
  }

  const { data: dbData, error: dbError } = await db.query(
    'INSERT INTO files (tenant_id, user_id, filename, bucket, path, content_type, size) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [tenantId, userId, originalname, BUCKET_NAME, filePath, mimetype, size]
  );

  if (dbError) {
    // If the DB insert fails, we should try to remove the orphaned file from storage.
    console.error('Error saving file metadata to DB:', dbError.message);
    await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    throw new Error('Failed to save file metadata.');
  }

  return dbData.rows[0];
};

/**
 * Generates a signed URL for downloading a file.
 * @param {string} fileId - The ID of the file.
 * @param {object} user - The authenticated user object.
 * @param {number} expiresIn - The expiration time for the URL in seconds.
 * @returns {string} The signed download URL.
 */
const createSignedUrl = async (fileId, user, expiresIn = 60) => {
  const { tenant_id: tenantId } = user;

  const { rows } = await db.query('SELECT * FROM files WHERE id = $1 AND tenant_id = $2', [fileId, tenantId]);

  if (rows.length === 0) {
    throw new Error('File not found or access denied.');
  }

  const file = rows[0];

  const { data, error } = await supabase.storage
    .from(file.bucket)
    .createSignedUrl(file.path, expiresIn);

  if (error) {
    console.error('Error creating signed URL:', error.message);
    throw new Error('Could not create signed URL.');
  }

  return data.signedUrl;
};

module.exports = {
  uploadFile,
  createSignedUrl,
};
