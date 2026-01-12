'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { uploadAPI } from '@/lib/api';
import { normalizeExternalUrl } from '@/lib/utils';

export default function ProfilePage() {
  const { user, isLoading, updateProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!user) return;
    setFullName(user.fullName || '');
    setEmail(user.email || '');
    setAvatar(user.avatar || '');
  }, [user]);

  const avatarSrc = useMemo(() => {
    const normalized = normalizeExternalUrl(avatar);
    return normalized || '';
  }, [avatar]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded-xl p-6 sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
              <p className="text-sm text-black/60 mt-1">
                {user.role} • {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-1">
              <div className="flex flex-col items-center sm:items-start">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-black/5 flex items-center justify-center text-xl font-semibold">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '';
                      }}
                    />
                  ) : (
                    <span>{(fullName || user.fullName || 'U').slice(0, 1).toUpperCase()}</span>
                  )}
                </div>

                <label className="mt-4 text-sm font-medium text-black/80">
                  Avatar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full text-sm"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setError('');
                    setMessage('');
                    try {
                      const res = await uploadAPI.uploadImage(file);
                      const url = res.data?.url ?? res.data?.data?.url;
                      if (typeof url === 'string' && url.length > 0) {
                        setAvatar(url);
                      } else {
                        setError('Upload failed');
                      }
                    } catch (err) {
                      setError('Upload failed');
                    }
                  }}
                />
              </div>
            </div>

            <form
              className="sm:col-span-2 space-y-5"
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSaving(true);
                setError('');
                setMessage('');

                try {
                  await updateProfile({
                    fullName: fullName.trim() || undefined,
                    email: email.trim() || undefined,
                    avatar: avatar.trim() || undefined,
                  });
                  setMessage('Saved');
                } catch (err) {
                  setError('Save failed');
                } finally {
                  setIsSaving(false);
                }
              }}
            >
              <div>
                <label className="block text-sm font-medium text-black/80">
                  Full Name
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black/80">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black/80">
                  Avatar URL
                </label>
                <input
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>

              {(message || error) && (
                <div className="text-sm">
                  {message ? (
                    <p className="text-green-700">{message}</p>
                  ) : null}
                  {error ? <p className="text-red-600">{error}</p> : null}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium disabled:opacity-60"
                >
                  {isSaving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
