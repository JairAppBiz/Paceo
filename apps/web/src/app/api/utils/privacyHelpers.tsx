// @ts-nocheck
import sql from "@/app/api/utils/sql";

/**
 * Check if a viewer can see a user's private content
 * @param {number} targetUserId - The user being viewed
 * @param {number|null} viewerId - The user viewing (null if not logged in)
 * @returns {Promise<boolean>} - True if can view private content
 */
export async function canViewPrivateContent(targetUserId, viewerId) {
  // Viewing own profile
  if (viewerId === targetUserId) {
    return true;
  }

  // Not logged in
  if (!viewerId) {
    return false;
  }

  // Check if target profile is private
  const [targetUser] = await sql`
    SELECT profile_private FROM users WHERE id = ${targetUserId}
  `;

  if (!targetUser) {
    return false;
  }

  // Profile is public
  if (!targetUser.profile_private) {
    return true;
  }

  // Profile is private - check if following
  const [followRelation] = await sql`
    SELECT status FROM followers 
    WHERE follower_id = ${viewerId} AND following_id = ${targetUserId}
  `;

  return followRelation && followRelation.status === "accepted";
}

/**
 * Get basic public info that's always visible (username, profile image, follower counts, tier badge)
 * @param {number} userId
 * @returns {Promise<object>} - Basic public user info
 */
export async function getPublicUserInfo(userId) {
  const [user] = await sql`
    SELECT 
      id,
      username,
      profile_image,
      follower_count,
      following_count,
      profile_private,
      tracked_tier_category
    FROM users
    WHERE id = ${userId}
  `;

  return user || null;
}
