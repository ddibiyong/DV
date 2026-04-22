const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

// 이모지 ↔ 역할 매핑 (여기서 관리)
const EMOJI_ROLE_MAP = {
  '🎮': { label: 'test1', roleId: '1496483100535033876' },
  '🎵': { label: 'test2', roleId: '1496483132579516416' },
  '📚': { label: 'test3', roleId: '1496483146269724682' },
};

module.exports = {
  EMOJI_ROLE_MAP,  // handler.js에서 import해서 씀

  data: new SlashCommandBuilder()
    .setName('역할설정')
    .setDescription('반응 역할 메시지를 생성합니다')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const lines = Object.entries(EMOJI_ROLE_MAP)
      .map(([emoji, { label }]) => `${emoji} — **${label}**`)
      .join('\n');

    const msg = await interaction.channel.send(
      `**역할을 선택하세요!**\n이모지를 클릭하면 역할이 부여됩니다.\n\n${lines}`
    );

    // 이모지 자동으로 달아주기
    for (const emoji of Object.keys(EMOJI_ROLE_MAP)) {
      await msg.react(emoji);
    }

    // 메시지 ID를 나중에 쓸 수 있도록 출력
    await interaction.reply({
      content: `✅ 역할 메시지 생성 완료!\n메시지 ID: \`${msg.id}\``,
      ephemeral: true,
    });
  },
};