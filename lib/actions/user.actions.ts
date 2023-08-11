'use server';

import { revalidatePath } from 'next/cache';
import { connectToDB } from '../mongoose';
import User from '../models/user.model';

export async function fetchUser(userId: string) {
  try {
    connectToDB();
    const userDocument = await User.findOne({ id: userId });
    if (!userDocument) {
      return null;
    }
    const userData = userDocument.toObject();
    userData._id = userData._id.toString();
    delete userData.__v;

    return userData;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

interface Params {
  userId: string;
  objectId?: string;
  username: string;
  name: string;
  image?: string;
  bio?: string;
  path: string;
  onboarded?: boolean;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
  onboarded,
}: Params): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        path,
      },
      { upsert: true }
    );

    if (path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}
