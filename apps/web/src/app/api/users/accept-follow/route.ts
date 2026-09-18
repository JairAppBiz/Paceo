// @ts-nocheck
import sql from '@/app/api/utils/sql';
import { auth } from '@/auth';
import { createFollowAcceptedNotification } from '@/app/api/utils/notificationHelpers';

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

    const currentUserId = currentUserRows[0].id;

    const body = await request.json();
    const { followerId } = body;

    if (!followerId) {
      return Response.json({ error: 'Follower ID is required' }, { status: 400 });
    }

    // Check if there's a pending follow request
    const existingFollow = await sql`
      SELECT * FROM followers 
      WHERE follower_id = ${followerId} AND following_id = ${currentUserId} AND status = 'pending'
    `;

    if (existingFollow.length === 0) {
      return Response.json({ error: 'No pending follow request found' }, { status: 404 });
    }

    // Update status to accepted
    await sql`
      UPDATE followers 
      SET status = 'accepted'
      WHERE follower_id = ${followerId} AND following_id = ${currentUserId}
    `;

    // Update follower counts for both users
    await sql`
      UPDATE users SET following_count = following_count + 1 WHERE id = ${followerId}
    `;
    await sql`
      UPDATE users SET follower_count = follower_count + 1 WHERE id = ${currentUserId}
    `;

    // Create notification using helper function
    await createFollowAcceptedNotification(followerId, currentUserId);

    return Response.json({
      success: true,
      message: 'Follow request accepted',
    });
  } catch (error) {
    console.error('Error accepting follow request:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
