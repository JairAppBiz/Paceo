// @ts-nocheck
import sql from '@/app/api/utils/sql';
import { auth } from '@/auth';

export async function GET(request) {
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

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if current user is following the target user
    const followingRows = await sql`
      SELECT status FROM followers 
      WHERE follower_id = ${currentUserId} AND following_id = ${userId}
    `;

    // Check if target user is following current user
    const followerRows = await sql`
      SELECT status FROM followers 
      WHERE follower_id = ${userId} AND following_id = ${currentUserId}
    `;

    return Response.json({
      isFollowing: followingRows.length > 0 && followingRows[0].status === 'accepted',
      isPending: followingRows.length > 0 && followingRows[0].status === 'pending',
      followsYou: followerRows.length > 0 && followerRows[0].status === 'accepted',
    });
  } catch (error) {
    console.error('Error getting follow status:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
