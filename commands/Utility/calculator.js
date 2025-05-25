const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  ComponentType,
  MessageFlags,
} = require("discord.js");

function convertUnits(x) {
  const SET_SIZE = 64;
  const BOX_SIZE = 54 * SET_SIZE; // 1상자 = 54셋 = 3456개

  const a = Math.floor(x / BOX_SIZE); // 상자 수
  const remainder = x % BOX_SIZE;
  const b = Math.floor(remainder / SET_SIZE); // 셋 수
  const c = remainder % SET_SIZE; // 개 수

  return [a, b, c];
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("calculator")
    .setDescription("아이템을 정리했을 때, 총 몇 개인지 계산합니다.")
    .addIntegerOption((option) =>
      option.setName("숫자").setDescription("변환할 개수").setRequired(true)
    ),
  async execute(interaction) {
    const value = interaction.options.getInteger("숫자");
    const [a, b, c] = convertUnits(value);

    await interaction.reply(`${value} = ${a}상자 ${b}셋 ${c}개`);
  },
};