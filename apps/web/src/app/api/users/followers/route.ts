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

    // Get followers list
    const followers = await sql`
      SELECT 
        u.id,
        u.username,
        u.profile_image,
        u.city,
        u.state,
        f.status,
        f.created_at
      FROM followers f
      JOIN users u ON f.follower_id = u.id
      WHERE f.following_id = ${userId}
        AND f.status = ${status}
      ORDER BY f.created_at DESC
    `;

    // If current user is viewing, add follow status for each follower
    const followersWithStatus = await Promise.all(
      followers.map(async (follower) => {
        if (currentUserId && currentUserId !== follower.id) {
          const followStatus = await sql`
            SELECT status FROM followers 
            WHERE follower_id = ${currentUserId} AND following_id = ${follower.id}
          `;

          return {
            ...follower,
            youFollow: followStatus.length > 0 && followStatus[0].status === 'accepted',
            youPending: followStatus.length > 0 && followStatus[0].status === 'pending',
          };
        }
        return follower;
      })
    );

    return Response.json({ followers: followersWithStatus });
  } catch (error) {
    console.error('Error getting followers:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
