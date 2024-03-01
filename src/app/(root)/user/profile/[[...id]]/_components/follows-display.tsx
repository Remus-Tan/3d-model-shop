import UserCard from "@/components/shared/user-card";
import { db } from "@/lib/db";

export default async function FollowsDisplay({
  option,
  userId,
}: {
  option: string;
  userId: string;
}) {
  let followList;
  let fetchUsers = [];

  if (option === "followers") {
    followList = await db.follows.findMany({
      where: {
        followingId: userId,
      },
    });

    if (followList) {
      for (let i = 0; i < followList.length; i++) {
        fetchUsers.push(
          await db.user.findUnique({ where: { id: followList[i].followerId } })
        );
      }
    }
  }

  if (option === "following") {
    followList = await db.follows.findMany({
      where: {
        followerId: userId,
      },
    });

    if (followList) {
      for (let i = 0; i < followList.length; i++) {
        fetchUsers.push(
          await db.user.findUnique({ where: { id: followList[i].followingId } })
        );
      }
    }
  }

  return (
    <div className="overflow-y-scroll max-h-[50svh]">
      {fetchUsers.length != 0 &&
        fetchUsers.map((user) => (
          <div className="py-2" key={user!.id}>
            <UserCard user={user!} />
          </div>
        ))}
    </div>
  );
}
