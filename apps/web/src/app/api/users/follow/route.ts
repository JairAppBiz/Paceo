// @ts-nocheck
import sql from '@/app/api/utils/sql';
import { auth } from '@/auth';
import {
  createFollowNotification,
  createFollowRequestNotification,
} from '@/app/api/utils/notificationHelpers';

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const authUserId = session.user.id;

    if (!authUserId) {
      return Response.json({ error: 'No user ID found' }, { status: 400 });
    }

    // Look up the users table ID from auth_users ID
    const currentUserRows = await sql`
      SELECT id FROM users WHERE auth_user_id = ${authUserId}
    `;

    if (currentUserRows.length === 0) {
      return Response.json({ error: 'User profile not found' }, { status: 404 });
    }

    const followerId = currentUserRows[0].id;

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    const followingId = userId;

    if (followerId === followingId) {
      return Response.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    // Get the target user to check privacy settings
    const targetUserRows = await sql`
      SELECT profile_private FROM users WHERE id = ${followingId}
    `;

    if (targetUserRows.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const isPrivate = targetUserRows[0].profile_private;
    const status = isPrivate ? 'pending' : 'accepted';

    // Check if already following
    const existingFollow = await sql`
      SELECT * FROM followers 
      WHERE follower_id = ${followerId} AND following_id = ${followingId}
    `;

    if (existingFollow.length > 0) {
      return Response.json({ error: 'Already following or request pending' }, { status: 400 });
    }

    // Create follower record
    await sql`
      INSERT INTO followers (follower_id, following_id, status)
      VALUES (${followerId}, ${followingId}, ${status})
    `;

    // If accepted immediately (public profile), update counts
    if (status === 'accepted') {
      await sql`
        UPDATE users SET following_count = following_count + 1 WHERE id = ${followerId}
      `;
      await sql`
        UPDATE users SET follower_count = follower_count + 1 WHERE id = ${followingId}
      `;
    }

    // Create notification using helper functions
    if (status === 'pending') {
      await createFollowRequestNotification(followingId, followerId);
    } else {
      await createFollowNotification(followingId, followerId);
    }

    return Response.json({
      success: true,
      status,
      message: status === 'pending' ? 'Follow request sent' : 'Now following',
    });
  } catch (error) {
    console.error('Error following user:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
