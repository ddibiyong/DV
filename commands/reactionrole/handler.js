const { EMOJI_ROLE_MAP } = require('./setup');

const WATCHED_MESSAGE_IDS = new Set([
  '939006526931230753',
]);

module.exports = (client) => {
  client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;
    if (!WATCHED_MESSAGE_IDS.has(reaction.message.id)) return;
    if (reaction.partial) await reaction.fetch();

    const entry = EMOJI_ROLE_MAP[reaction.emoji.name];
    if (!entry) return;

    const member = await reaction.message.guild.members.fetch(user.id);

    // 반응 먼저 제거
    await reaction.users.remove(user.id);

    // 이미 역할이 있으면 제거, 없으면 부여 (토글)
    if (member.roles.cache.has(entry.roleId)) {
      await member.roles.remove(entry.roleId);
      console.log(`❌ [역할 제거] ${user.tag} → ${entry.label}`);
    } else {
      await member.roles.add(entry.roleId);
      console.log(`✅ [역할 부여] ${user.tag} → ${entry.label}`);
    }
  });

  // messageReactionRemove는 이제 필요 없음 (토글 방식으로 대체)
};