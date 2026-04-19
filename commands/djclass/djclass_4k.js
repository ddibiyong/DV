const {
  SlashCommandBuilder, EmbedBuilder
} = require("discord.js");

const DJ_CLASS_CONFIG = {
  'THE LORD OF DJMAX': { color: 0xF2B2F7 },
  'BEAT MAESTRO I':    { color: 0xFF7183 },
  'BEAT MAESTRO II':   { color: 0xFF7183 },
  'BEAT MAESTRO III':  { color: 0xFF7183 },
  'BEAT MAESTRO IV':   { color: 0xFF7183 },
  'SHOWSTOPPER I':     { color: 0xFF856F },
  'SHOWSTOPPER II':    { color: 0xFF856F },
  'SHOWSTOPPER III':   { color: 0xFF856F },
  'SHOWSTOPPER IV':    { color: 0xFF856F },
  'HEADLINER I':       { color: 0xFF9758 },
  'HEADLINER II':      { color: 0xFF9758 },
  'HEADLINER III':     { color: 0xFF9758 },
  'HEADLINER IV':      { color: 0xFF9758 },
  'TREND SETTER I':    { color: 0xFFAF51 },
  'TREND SETTER II':   { color: 0xFFAF51 },
  'TREND SETTER III':  { color: 0xFFAF51 },
  'TREND SETTER IV':   { color: 0xFFAF51 },
  'PROFESSIONAL I':    { color: 0xFFD352 },
  'PROFESSIONAL II':   { color: 0xFFD352 },
  'PROFESSIONAL III':  { color: 0xFFD352 },
  'PROFESSIONAL IV':   { color: 0xFFD352 },
  'HIGH CLASS I':      { color: 0xFEFF63 },
  'HIGH CLASS II':     { color: 0xFEFF63 },
  'HIGH CLASS III':    { color: 0xFEFF63 },
  'HIGH CLASS IV':     { color: 0xFEFF63 },
  'PRO DJ I':          { color: 0xC7E644 },
  'PRO DJ II':         { color: 0xC7E644 },
  'PRO DJ III':        { color: 0xC7E644 },
  'PRO DJ IV':         { color: 0xC7E644 },
  'MIDDLEMAN I':       { color: 0x9AE28A },
  'MIDDLEMAN II':      { color: 0x9AE28A },
  'MIDDLEMAN III':     { color: 0x9AE28A },
  'MIDDLEMAN IV':      { color: 0x9AE28A },
  'STREET DJ I':       { color: 0x92EACA },
  'STREET DJ II':      { color: 0x92EACA },
  'STREET DJ III':     { color: 0x92EACA },
  'STREET DJ IV':      { color: 0x92EACA },
  'ROOKIE I':          { color: 0x78E3DA },
  'ROOKIE II':         { color: 0x78E3DA },
  'ROOKIE III':        { color: 0x78E3DA },
  'ROOKIE IV':         { color: 0x78E3DA },
  'AMATEUR I':         { color: 0x8ECCDB },
  'AMATEUR II':        { color: 0x8ECCDB },
  'AMATEUR III':       { color: 0x8ECCDB },
  'AMATEUR IV':        { color: 0x8ECCDB },
  'TRAINEE I':         { color: 0xA9D0EE },
  'TRAINEE II':        { color: 0xA9D0EE },
  'TRAINEE III':       { color: 0xA9D0EE },
  'TRAINEE IV':        { color: 0xA9D0EE },
  'BEGINNER':          { color: 0xC0C0C0 },
};
 
function getClassConfig(djClass) {
  if (!djClass) return { color: 0x5865f2, emoji: "🎵" };
  // 정확히 일치하는 키 우선, 없으면 접두사 매칭
  const upper = djClass.toUpperCase();
  if (DJ_CLASS_CONFIG[upper]) return DJ_CLASS_CONFIG[upper];
  for (const key of Object.keys(DJ_CLASS_CONFIG)) {
    if (upper.startsWith(key)) return DJ_CLASS_CONFIG[key];
  }
  return { color: 0x5865f2, emoji: "🎵" };
}

function formatPower(value) {
  if (value == null) return "N/A";
  return value.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
}

function buildProgressBar(current, max, length = 12) {
  if (!max || max === 0) return "░".repeat(length);
  const ratio = Math.min(current / max, 1);
  const filled = Math.round(ratio * length);
  return "█".repeat(filled) + "░".repeat(length - filled);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("디클")
    .setDescription("V-ARCHIVE에서 DJ CLASS를 조회합니다.")
    .addStringOption((option) =>
      option
        .setName("nickname")
        .setDescription("V-ARCHIVE 닉네임")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("button")
        .setDescription("버튼 수 선택")
        .setRequired(true)
        .addChoices(
          { name: "4B", value: 4 },
          { name: "5B", value: 5 },
          { name: "6B", value: 6 },
          { name: "8B", value: 8 },
        ),
    ),

  async execute(interaction) {
    const nickname = interaction.options.getString("nickname");
    const button = interaction.options.getInteger("button");

    await interaction.deferReply();

    const encodedNick = encodeURIComponent(nickname);
    const url = `https://v-archive.net/api/v2/archive/${encodedNick}/djClass/${button}`;

    let data;
    try {
      const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      });
      data = await res.json();
    } catch (err) {
      console.error("[djclass] fetch 오류:", err);
      return interaction.editReply({
        content:
          "❌ API 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }

    // 에러 처리
    if (!data.success) {
      const messages = {
        101: `❌ **${nickname}** 닉네임을 V-ARCHIVE에서 찾을 수 없습니다.`,
        111: `⚠️ **${nickname}** 님의 **${button}B** DJ CLASS 정보가 없습니다.\nV-ARCHIVE에 ${button}B 기록이 등록되지 않았을 수 있습니다.`,
        900: `❌ 잘못된 입력값입니다. (버튼: ${button})`,
        999: `❌ V-ARCHIVE 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.`,
      };
      return interaction.editReply({
        content:
          messages[data.errorCode] ??
          `❌ 오류가 발생했습니다. (code: ${data.errorCode})`,
      });
    }

    const { djClass, djPowerSum, djPowerConversion, maxDjPower } = data;
    const { color } = getClassConfig(djClass);

    const progressRatio =
      maxDjPower > 0
        ? ((djPowerConversion / maxDjPower) * 100).toFixed(2)
        : "0.00";
    const progressBar = buildProgressBar(djPowerConversion, maxDjPower);

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(`${djClass}`)
      .setDescription(
        `**${nickname}** 님의 **${button}B** DJ CLASS 정보입니다.`,
      )
      .addFields(
        {
          name: "🎯 DJ POWER (TOP 100 합계)",
          value: `\`${formatPower(djPowerSum)}\``,
          inline: false,
        },
        {
          name: "📊 환산 점수",
          value: `\`${formatPower(djPowerConversion)}\``,
          inline: false,
        },
        {
          name: "🏆 이론치 (MAX)",
          value: `\`${formatPower(maxDjPower)}\``,
          inline: false,
        },
      )
      .setFooter({
        text: "Powered by V-ARCHIVE · v-archive.net",
      })
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  },
};