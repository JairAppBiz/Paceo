// @ts-nocheck
import sql from '@/app/api/utils/sql';
import { auth } from '@/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status') || 'accepted';

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Try to get current user's auth ID (optional for this endpoint)
    let currentUserId = null;
    const session = await auth();

    if (session?.user) {
      const userRows = await sql`
        SELECT id FROM users WHERE auth_user_id = ${session.user.id}
      `;
      if (userRows.length > 0) {
        currentUserId = userRows[0].id;
      }
    }

    // Get following list
    const following = await sql`
      SELECT 
        u.id,
        u.username,
        u.profile_image,
        u.city,
        u.state,
        f.status,
        f.created_at
      FROM followers f
      JOIN users u ON f.following_id = u.id
      WHERE f.follower_id = ${userId}
        AND f.status = ${status}
      ORDER BY f.created_at DESC
    `;

    // If current user is viewing, add follow status for each person they're following
    const followingWithStatus = await Promise.all(
      following.map(async (user) => {
        if (currentUserId && currentUserId !== user.id) {
          const followStatus = await sql`
            SELECT status FROM followers 
            WHERE follower_id = ${currentUserId} AND following_id = ${user.id}
          `;

          return {
            ...user,
            youFollow: followStatus.length > 0 && followStatus[0].status === 'accepted',
            youPending: followStatus.length > 0 && followStatus[0].status === 'pending',
          };
        }
        return user;
      })
    );

    return Response.json({ following: followingWithStatus });
  } catch (error) {
    console.error('Error getting following:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
